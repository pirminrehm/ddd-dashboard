import { Component, OnInit } from '@angular/core';

import { LoggingProvider } from '../../../providers/web3/logging';
import { SettingsProvider } from '../../../providers/storage/settings';

import { Team } from '../../../models/team';

import { NotificationProvider } from '../../../providers/notification';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  teams: Team[] = [];
  currentAddress: any;
  private loadTeamsCalls: number = -1;
  private clearTimouts: boolean;
  private teamCount: any = 'Logging Contract not avialable!'

  constructor(
    private loggingProvider: LoggingProvider,
    private settingsProvider: SettingsProvider,
    private notificationProvider: NotificationProvider
  ) { }

  async ngOnInit() {
    this.clearTimouts = false;
    this.repeatAsyncWithDelay(500, this.loadTeams);
  }

  ngOnDestroy() {
    this.clearTimouts = true;
  }

  async loadTeams() {
    this.loadTeamsCalls++;
      let teams = await this.loggingProvider.getTeam();
      this.teamCount = teams.length;
      this.currentAddress = await this.settingsProvider.getTeamAddress();
      if (this.teams.length != teams.length && this.loadTeamsCalls){
        this.notificationProvider.notify(`New team created: ${teams[teams.length-1].name} `, 'success');
      }
      this.teams = teams.reverse();
  }

  async setTeam(team) {
    this.currentAddress = team.address;
    this.notificationProvider.notify(`Team choosen: ${team.name} `);
    await this.settingsProvider.setTeamAddress(team.address);
    window.location.reload();
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
