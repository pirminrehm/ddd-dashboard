import { Component, OnInit } from '@angular/core';

import { SettingsProvider } from '../../../providers/storage/settings';
import { TeamProvider } from '../../../providers/web3/team';
import { PendingMember } from '../../../models/pending-member';
import { Member } from '../../../models/member';

declare function require(path: string): any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  
  pendingMembers: PendingMember[];
  members: Member[];
  teamName: string;
  teamAddress: string;
  private $: any = (<any>window).$;
  lastToken: string = 'no token has been created so far';
  lastTokenDate: string = 'no token has been created so far';


  constructor(
    private teamProvider: TeamProvider,
    private settingsProvider: SettingsProvider
  ) { }

  ngOnInit() {
    // require('../../../../assets/js/charts.js')();
    this.pendingMembers = [];
    this.members = [];
    this.teamAddress = null;
    this.repeatAsyncWithDelay(500, async () => {
      let teamAddress = await this.settingsProvider.getTeamAddress();
      this.teamAddress = teamAddress;
      
      if(this.teamAddress) {
        this.teamProvider.getMembers().then(members => {
          if (this.members.length < members.length) {
            this.setNotification('New member!', 'success');
          }
          this.members = members;       
        });
        this.teamProvider.getPendingMembers().then(pendingMembers =>  {
          if (this.pendingMembers.length < pendingMembers.length) {
            this.setNotification('New pending member!', 'success');
          }
          this.pendingMembers = pendingMembers;
        });
        this.teamProvider.getTeamName().then(teamName =>  {
          this.teamName = teamName;
        });
      }
    });
    this.teamProvider.listenToken(token => {
      this.setNotification("Token created: " + token, 'warning');
      this.lastToken = token;
      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1).replace('T',' ');
      this.lastTokenDate = localISOTime;
    });
  }

  private repeatAsyncWithDelay(delay, cb)  {
    const helperFunction = async () => {
      await cb();
      setTimeout(helperFunction, delay)
    }
    helperFunction();
  }

  private setNotification (message, type, timer = 4000) {
    this.$.notify({
      icon: "notifications",
      message: message

    },{
        type: type, //type = ['','info','success','warning','danger'];
        timer: timer,
        placement: {
            from: 'top',
            align: 'center'
        },
    });
  }
  
}
