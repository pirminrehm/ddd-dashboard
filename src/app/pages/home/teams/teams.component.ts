import { Component, OnInit } from '@angular/core';

import { LoggingProvider } from '../../../providers/web3/logging';
import { SettingsProvider } from '../../../providers/storage/settings';



@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  teamAddresses: any[];
  currentAddress: any;

  constructor(
    private loggingProvider: LoggingProvider,
    private settingsProvider: SettingsProvider
  ) { }

  async ngOnInit() {
    this.repeatAsyncWithDelay(500, async () => {
      let teamAddresses = await this.loggingProvider.getTeamAddresses();
      this.currentAddress = await this.settingsProvider.getTeamAddress();
      this.teamAddresses = teamAddresses;
    })
  }

  async setTeamAddress(address) {
    console.log(address);
    this.currentAddress = address;
    await this.settingsProvider.setTeamAddress(address);
    window.location.reload();
  }

  private repeatAsyncWithDelay(delay, cb)  {
    const helperFunction = async () => {
      await cb();
      setTimeout(helperFunction, delay)
    }
    helperFunction();
  }

}
