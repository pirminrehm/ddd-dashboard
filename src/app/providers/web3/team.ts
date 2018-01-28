import { TeamState } from './../../states/team';
import { AppStateTypes } from './../../states/types';
import { TeamInvitation } from './../../models/team-invitation';
import { SettingsProvider } from './../storage/settings';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Web3Provider } from './web3';
import { PendingMember } from '../../models/pending-member';
import { Member } from './../../models/member';
import { Voting } from './../../models/voting';
import { VotingProvider } from './voting';
import { AppStateProvider } from '../storage/app-state';

// Import our contract artifacts and turn them into usable abstractions.
import * as teamArtifacts from '../../../../build/contracts/Team.json';
import * as loggingArtifacts from '../../../../build/contracts/Logging.json';

/*
  Generated class for the Team provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TeamProvider {

  private state: TeamState;
  private contractCallMutex: Boolean = false;
  private getContractInvokes: number = 0;
  
  constructor(private web3Provider: Web3Provider,
              private settingsProvider: SettingsProvider
  ) {     
    this.state = AppStateProvider.getInstance(AppStateTypes.TEAM) as TeamState;
  }


  // CONTRACT ACCESSORS
  async getTeamName(): Promise<string> {
    if(!this.state.name) {
      let name = await this.call('getTeamName');
      this.state.name = await this.web3Provider.fromWeb3String(name);
    }
    return this.state.name;
  }

  async getPendingMembersCount(): Promise<number> {
    const count = await this.call('getPendingMembersCount');
    this.state.pendingMembersCount = await this.web3Provider.fromWeb3Number(count);
    return this.state.pendingMembersCount;
  }

  async getMembersCount(): Promise<number> {
    const count = await this.call('getMembersCount');
    this.state.membersCount = await this.web3Provider.fromWeb3Number(count);
    return this.state.membersCount;
  }

  async getVotingsCount(): Promise<number> {
    const count = await this.call('getVotingsCount');
    this.state.votingsCount = await this.web3Provider.fromWeb3Number(count);
    return this.state.votingsCount;
  }

  async getClosedVotingsCount(): Promise<number> {
    const count = await this.call('getClosedVotingsCount');
    return this.web3Provider.fromWeb3Number(count);
  }

  async getLocationAddress(): Promise<string> {
    if(!this.state.locationAddress) {
      this.state.locationAddress = await this.call('getLocationAddress');
    }
    return this.state.locationAddress;
  }

  async getMemberByIndex(index: number): Promise<Member> {
    if(!this.state.memberByIndex[index]) {
      const v = await this.call('getMemberByIndex', index);
      const name = await this.web3Provider.fromWeb3String(v[1]);
      const avatarId = await this.web3Provider.fromWeb3Number(v[2]);
      this.state.memberByIndex[index] = new Member(v[0], name, avatarId);
    }
    return this.state.memberByIndex[index];
  }

  async getPendingMemberByIndex(index: number): Promise<PendingMember> {
    let pendingMemberByIndex;
    try {
      const v = await this.call('getPendingMemberByIndex', index);
      const name = await this.web3Provider.fromWeb3String(v[1]);
      const avatarId = await this.web3Provider.fromWeb3Number(v[2]);
  
      pendingMemberByIndex = new PendingMember(v[0], name, avatarId, v[3]);
    } catch(e) {}
    return pendingMemberByIndex;
  }

  async getVotingsByIndex(index: number): Promise<PendingMember> {
    if(!this.state.votingsByIndex[index] || true) {
      let voting = await this.call('getVotingByIndex', index);
      this.state.votingsByIndex[index] = new Voting(
        voting[0], 
        await this.web3Provider.fromWeb3String(voting[1]),
        new Date(await this.web3Provider.fromWeb3Number(voting[2])* 1000).toISOString().replace(/T|Z/g, ' ')
      );
    }
    return this.state.votingsByIndex[index];
  }

  async getClosedVotingByIndex(index: number): Promise<PendingMember> {
    if(!this.state.closedVotingsByIndex[index]) {
      let voting = await this.call('getClosedVotingByIndex', index);
      this.state.closedVotingsByIndex[index] = this.prepareVoting(voting);
    }
    return this.state.closedVotingsByIndex[index];
  }

  // TRANSACTIONS

  async createTeam(name: string, creatorName: string) {
    name = await this.web3Provider.toWeb3String(name);
    creatorName = await this.web3Provider.toWeb3String(creatorName);
    
    const contract = await this.web3Provider.getRawContract(teamArtifacts);
    const account = await this.web3Provider.getAccount();
    
    const team = await contract.new(name, creatorName, 0, {from: account, gas: 5000000});
    let loggingAddress = await this.settingsProvider.getLoggingAddress();
    if(loggingAddress) {
      // console.time('addTeamToLogging');
      this.web3Provider.getContractAt(loggingArtifacts, loggingAddress).then(logging=>{
         return logging.addTeam(team.address,  {from: account, gas: 5000000});
      }).then(() => {
        // console.timeEnd('addTeamToLogging');        
      });
    }
    await this.settingsProvider.setTeamAddress(team.address);
    return team;
  }

  async createInvitationToken() {
    const contract = await this.getContract();
    const account = await this.web3Provider.getAccount();
    return contract.createInvitationToken({from: account});
  }

  async sendJoinTeamRequest(teamAddress: string, token: string, name: string, avatarId: number) {
    name = await this.web3Provider.toWeb3String(name);
    // TODO: avatarId = await this.web3Provider.toWeb3Number(avatarId);
    const contract = await this.web3Provider.getContractAt(teamArtifacts, teamAddress);
    const account = await this.web3Provider.getAccount();
    
    return contract.sendJoinTeamRequest(token, name, avatarId, {from: account, gas: 3000000});
  }

  async acceptPendingMember(address: string) {
    const contract = await this.getContract();
    const account = await this.web3Provider.getAccount();
    return contract.acceptPendingMember(address, {from: account, gas: 3000000});
  }

  async addVoting(name: string) {
    name = await this.web3Provider.toWeb3String(name);

    const contract = await this.getContract();
    const account = await this.web3Provider.getAccount();
    return contract.addVoting(name, {from: account, gas: 3000000});
  }

  // EVENTS

  async onTokenCreated(): Promise<any> {
    const TokenCreated = (await this.getContract()).TokenCreated(); 
    const res = await this.listenOnce(TokenCreated);
    return new TeamInvitation(res.address, res.args.token);
  }

  private tokenListenerInstance: any;
  public getTokenListener () {
    return new Observable<string>(observer => {
      this.getContract().then(instance => {
        this.tokenListenerInstance = instance.TokenCreated();
        this.tokenListenerInstance.watch((err, result) => {
          if(err) {
            throw err;
          } else if (result.args.token) {
            observer.next(result.args.token);
          }
        });
      });
    });
  }

  public destroyTokenListener () {
    this.tokenListenerInstance.stopWatching();
  }
  

  async onVotingCreated(): Promise<any> {
    const VotingCreated = (await this.getContract()).VotingCreated(); 
    const res = await this.listenOnce(VotingCreated);
    
    this.state.votingsCount += 1;
    return res.args.votingAddress;
  }

  // HELPERS

  async getMembers(): Promise<Member[]> {
    const count = await this.getMembersCount();
    const members = [];
    for(let i = 0; i < count; i++) {
      members.push(await this.getMemberByIndex(i));
    }
    return members;
  }


  async getPendingMembers(): Promise<PendingMember[]> {
    const count = await this.getPendingMembersCount();
    const pendingMembers = [];
    for(let i = 0; i < count; i++) {
      pendingMembers.push(await this.getPendingMemberByIndex(i));
    }
    return pendingMembers;
  }

  async getVotings(): Promise<string[]> {
    const count = await this.getVotingsCount();
    const votings = [];
    for(let i = 0; i < count; i++) {
      votings.push(await this.getVotingsByIndex(i));
    }
    return votings;
  }
  
  async getClosedVotings(): Promise<Voting[]> {
    const count = await this.getClosedVotingsCount();
    const votings = [];
    for(let i = 0; i < count; i++) {
      votings.push(await this.getClosedVotingByIndex(i));
    }
    return votings;
  }


  // INTERNAL

  private async getContract(): Promise<any> {
    let currentCall = this.getContractInvokes++
    // console.log('TRY_invokeGetContract', currentCall);
    await this.waitForAndSetContractCallMutex();
    // console.log('invokeGetContract', currentCall);
    if(!this.state.contract) {
      const address = await this.settingsProvider.getTeamAddress();
      if (!address){
        await new Promise(null);
      }
      // console.time('getContractAt');
      this.state.contract = await this.web3Provider.getContractAt(teamArtifacts, address);
      // console.log('getContractAt by No', currentCall);  
      // console.timeEnd('getContractAt');
    }
    this.resolveContractCallMutex();
    return this.state.contract;
  }

  private async call(name: string, ...params): Promise<any> {
    const contract =  await this.getContract();
    try {
      // console.time(name);
      let callData = await contract[name].call(...params);
      // console.timeEnd(name);      
      return callData;
    } catch(e) {
      e => this.handleError(e);
    }
  }

  private listenOnce(Event: any): Promise<any> {
    return new Promise((resolve, reject) => {
      Event.watch((err, result) => {
        if(err) {
          reject(err);
          throw err;
        }
        
        resolve(result);
        Event.stopWatching();
      });
    });
  }

  private handleError(e: Error) {
    console.log(e);
  }

  private async waitForAndSetContractCallMutex(): Promise<any> {
    return new Promise(resolve => {
      let tryEntrance = () => {
        if (!this.contractCallMutex) {
          this.contractCallMutex = true;
          // console.log('mutex: close');
          resolve();
        } else {
          setTimeout(tryEntrance, 50);
        }
      };
      tryEntrance();
    });
  }

  private resolveContractCallMutex(): Promise<any> {
    this.contractCallMutex = false;
    // console.log('mutex: open');    
    return Promise.resolve();
  }

  private async prepareVoting(voting) {
    return new Voting(
      voting[0], 
      await this.web3Provider.fromWeb3String(voting[1]),
      new Date(await this.web3Provider.fromWeb3Number(voting[2]*1000)).toISOString().replace(/T|Z/g, ' ').slice(0,19)
    )
  }
  
}
