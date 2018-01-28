import { Component, OnInit } from '@angular/core';

import { SettingsProvider } from '../../../providers/storage/settings';
import { TeamProvider } from '../../../providers/web3/team';
import { PendingMember } from '../../../models/pending-member';
import { Member } from '../../../models/member';
import { NotificationProvider } from '../../../providers/notification';
import { Observable } from 'rxjs/Observable';

declare function require(path: string): any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  
  private pendingMembers: PendingMember[];
  private members: Member[];
  private teamName: string;
  private teamAddress: string;
  private lastToken: string;
  private lastTokenDate: string;
  private clearTimouts: boolean;
  private tokenListenerObservable: Observable<string>;
  private loadMembersCalls: number = -1;
  private loadPendingMembersCalls: number = -1;


  constructor(
    private teamProvider: TeamProvider,
    private settingsProvider: SettingsProvider,
    private notificationProvider: NotificationProvider
  ) {  }

  async ngOnInit() {
     // require('../../../../assets/js/charts.js')();
    this.pendingMembers = [];
    this.members = [];
    this.teamAddress = null;
    this.clearTimouts = false;
    this.lastToken = '| no token has been created so far |';
    this.lastToken = this.lastTokenDate;
    this.teamName = '| team not available |';

    let teamAddress = await this.settingsProvider.getTeamAddress();
    this.teamAddress = teamAddress;

    let teamName = await this.teamProvider.getTeamName();
    this.teamName = teamName;

    this.repeatAsyncWithDelay(500, this.loadMembers);
    this.repeatAsyncWithDelay(500, this.loadPendingMembers);

    this.tokenListenerObservable =this.teamProvider.getTokenListener();

    this.tokenListenerObservable.subscribe(token => {
      this.notificationProvider.notify("Token created: " + token, 'warning');
      this.lastToken = token;
      //prepare and show date
      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1).replace('T',' ');
      this.lastTokenDate = localISOTime;
    });
  }

  ngOnDestroy() {
    this.clearTimouts = true;
    try {
      this.teamProvider.destroyTokenListener();
    } catch (e) {}
  }

  private async loadMembers() {
    if(this.teamAddress) {
      this.loadMembersCalls++;
      const members = await this.teamProvider.getMembers();
      if (this.members.length < members.length && this.loadMembersCalls) { //avoid first notify
        this.notificationProvider.notify('New member!', 'success');
      }
      this.members = members;       
    }
  }

  private async loadPendingMembers() {
    if(this.teamAddress) {
      this.loadPendingMembersCalls++;   
      const pendingMembers = await this.teamProvider.getPendingMembers();
      if (this.pendingMembers.length < pendingMembers.length && this.loadPendingMembersCalls) {
        this.notificationProvider.notify('New pending member!', 'success');
      }
      this.pendingMembers = pendingMembers;
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
