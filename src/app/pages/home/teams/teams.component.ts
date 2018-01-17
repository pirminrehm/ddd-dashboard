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

  constructor(
    private loggingProvider: LoggingProvider,
    private settingsProvider: SettingsProvider,
    private notificationProvider: NotificationProvider
  ) { }

  async ngOnInit() {
    this.repeatAsyncWithDelay(500, this.loadTeams);
  }

  async loadTeams() {
    this.loadTeamsCalls++;
    let teams = await this.loggingProvider.getTeam();
    this.currentAddress = await this.settingsProvider.getTeamAddress();
    if (this.teams.length != teams.length && this.loadTeamsCalls){
      this.notificationProvider.notify(`New team created: ${teams[teams.length-1].name} `, 'success');
    }
    this.teams = teams;
  }

  async setTeam(team) {
    this.currentAddress = team.address;
    await this.settingsProvider.setTeamAddress(team.address);
    this.notificationProvider.notify(`Team choosen: ${team.name} `);    
  }

  private repeatAsyncWithDelay(delay, cb)  {
    const helperFunction = async () => {
      await cb.call(this);
      setTimeout(helperFunction, delay)
    }
    helperFunction();
  }

}
