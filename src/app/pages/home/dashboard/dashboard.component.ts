import { Component, OnInit } from '@angular/core';

import { SettingsProvider } from '../../../providers/storage/settings';
import { TeamProvider } from '../../../providers/web3/team';
import { PendingMember } from '../../../models/pending-member';
import { Member } from '../../../models/member';
import { NotificationProvider } from '../../../providers/notification';

declare function require(path: string): any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  
  pendingMembers: PendingMember[];
  members: Member[];
  teamName: string = '| team not available |';
  teamAddress: string;
  lastToken: string = '| no token has been created so far |';
  lastTokenDate: string = '| no token has been created so far |';
  private loadTeamsCalls: number = -1;


  constructor(
    private teamProvider: TeamProvider,
    private settingsProvider: SettingsProvider,
    private notificationProvider: NotificationProvider
  ) { }

  ngOnInit() {
    // require('../../../../assets/js/charts.js')();
    this.pendingMembers = [];
    this.members = [];
    this.teamAddress = null;
    this.repeatAsyncWithDelay(500, this.loadTeams);

    this.teamProvider.listenToken(token => {
      this.notificationProvider.notify("Token created: " + token, 'warning');
      this.lastToken = token;
      //prepare and show date
      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1).replace('T',' ');
      this.lastTokenDate = localISOTime;
    });
  }


  private async loadTeams() {
    this.loadTeamsCalls++;
    let teamAddress = await this.settingsProvider.getTeamAddress();
    this.teamAddress = teamAddress;
    
    if(this.teamAddress) {
      this.teamProvider.getMembers().then(members => {
        if (this.members.length < members.length && this.loadTeamsCalls) { //avoid first notify
          this.notificationProvider.notify('New member!', 'success');
        }
        this.members = members;       
      });
      this.teamProvider.getPendingMembers().then(pendingMembers =>  {
        if (this.pendingMembers.length < pendingMembers.length && this.loadTeamsCalls) {
          this.notificationProvider.notify('New pending member!', 'success');
        }
        this.pendingMembers = pendingMembers;
      });
      this.teamProvider.getTeamName().then(teamName =>  {
        this.teamName = teamName;
      });
    }
  }

  private repeatAsyncWithDelay(delay, cb)  {
    const helperFunction = async () => {
      await cb.call(this);
      setTimeout(helperFunction, delay)
    }
    helperFunction();
  } 
}
