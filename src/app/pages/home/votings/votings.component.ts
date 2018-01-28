import { Component, OnInit } from '@angular/core';

import { LoggingProvider } from '../../../providers/web3/logging';
import { TeamProvider } from '../../../providers/web3/team';
import { VotingProvider } from '../../../providers/web3/voting';
import { SettingsProvider } from '../../../providers/storage/settings';
import { Member } from '../../../models/member';
import { NotificationProvider } from '../../../providers/notification';
import { LocationPoint } from '../../../models/location-point';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-votings',
  templateUrl: './votings.component.html',
  styleUrls: ['./votings.component.css']
})
export class VotingsComponent implements OnInit {

  private votings: any[];
  private closedVotings: any[];
  private currentAddress: any;
  private members: Member[];
  private teamAddress: string;
  private clearTimouts: boolean;
  private locationPoints: LocationPoint[];
  private allPoints: any = {};
  private chartReloadSubject = new Subject();

  constructor(
    private loggingProvider: LoggingProvider,
    private settingsProvider: SettingsProvider,
    private notificationProvider: NotificationProvider,
    private votingProvider: VotingProvider,
    private teamProvider: TeamProvider
  ) { }

  async ngOnInit() {   
    this.clearTimouts = false;
    this.teamAddress = await this.settingsProvider.getTeamAddress();

    this.repeatAsyncWithDelay(500, this.getVotings);
    this.repeatAsyncWithDelay(500, this.getClosdVotings);
    this.repeatAsyncWithDelay(500, this.loadMembers);
  }

  ngOnDestroy() {
    this.clearTimouts = true;
  }

  async getVotings () {
    let votings = await this.teamProvider.getVotings();
    if (this.votings && this.votings.length < votings.length) { //avoid first notify
      this.notificationProvider.notify('New Voting!', 'success');
    }
    this.votings = votings;
  }

  async getClosdVotings () {
    let closedVotings = await this.teamProvider.getClosedVotings();
    if (this.closedVotings && this.closedVotings.length < closedVotings.length) { //avoid first notify
      this.notificationProvider.notify('Voting closed!', 'warning');
    }
    this.closedVotings = closedVotings;
  }

  async setVotingAddress(address) {
    if (this.currentAddress !== address) {
      this.locationPoints = [];
      this.allPoints[this.currentAddress] = null;
      this.chartReloadSubject.next();
    }
    this.currentAddress = address;
    if (this.members) {
      this.members.forEach(member => member.points = null);
    }
  }

  private async loadMembers() {
    if(this.teamAddress && this.currentAddress) {
      const members = await this.teamProvider.getMembers();
      members.forEach(async member => {
        let points = await this.votingProvider.getUserPointsByAddress(this.currentAddress, member.account);
        if (member.points != null && member.points < points) {
          this.notificationProvider.notify(member.name + ' has voted', 'success');
        }
        member.points = points;
      })
      this.members = members;

      let locationPoints = await this.votingProvider.getLocationPoints(this.currentAddress)
      this.locationPoints = locationPoints;
      const allPoints = locationPoints.reduce(function (a,b) { return a + b.points; }, 0)
      const lastAllPoints = this.allPoints[this.currentAddress];
      if (lastAllPoints != allPoints) {
        this.chartReloadSubject.next();
      }
      this.allPoints[this.currentAddress] = allPoints;
    }
  }


  private repeatAsyncWithDelay(delay, cb)  {
    const helperFunction = async () => {
      await cb.call(this);
      if (!this.clearTimouts) {
        setTimeout(helperFunction, delay);
      }
    }
    helperFunction();
  }
}
