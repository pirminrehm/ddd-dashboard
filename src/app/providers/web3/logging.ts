import { AppStateTypes } from './../../states/types';
import { Injectable } from '@angular/core';

import { Web3Provider } from './web3';

// Import our contract artifacts and turn them into usable abstractions.
 import * as loggingArtifacts from '../../../../build/contracts/Logging.json';

 import { Team } from './../../models/team';

import { SettingsProvider } from './../storage/settings';
import { LoggingState } from '../../states/logging';
import { AppStateProvider } from '../storage/app-state';

/*
  Generated class for the Locations provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoggingProvider {

  private state: LoggingState;

  constructor(
      private web3Provider: Web3Provider,
      private settingsProvider: SettingsProvider,
  ) {
    this.state = AppStateProvider.getInstance(AppStateTypes.LOGGING) as LoggingState;
  }

  // CONTRACT ACCESSORS

  async getCount(): Promise<number> {

    const count = await this.call('getTeamAddressCount');
    this.state.count = await this.web3Provider.fromWeb3Number(count);

    return this.state.count;
  }

  async getTeamByIndex(index: number): Promise<Team> {
    if(!this.state.teamAddressByIndex[index] ||  true) {
      const team = await this.call('getTeamAddressByIndex', index);
      const teamName = await this.web3Provider.fromWeb3String(team[1]);
      this.state.teamAddressByIndex[index] = new Team(team[0], teamName);
    }
    return this.state.teamAddressByIndex[index];
  }

  // HELPERS

  async getTeam(): Promise<Team[]> {
    const count = await this.getCount();
    const locations = [];
    for(let i = 0; i < count; i++) {
      locations.push(await this.getTeamByIndex(i));
    }
    return locations;
  }


  // INTERNAL

  private async getContract(): Promise<any> {
    if(!this.state.contract) {
      const address = await this.settingsProvider.getLoggingAddress();
      console.log('get contract at');
      this.state.contract = await this.web3Provider.getContractAt(loggingArtifacts, address);
    }
    return this.state.contract;
  }

  private async call(name: string, ...params): Promise<any> {
    const contract =  await this.getContract();
    try {
      return contract[name].call(...params);
    } catch(e) {
      e => this.handleError(e);
    }
  }

  private handleError(e: Error) {
    console.log(e);
  }
}