import { Component, OnInit } from '@angular/core';

import { LoggingProvider } from '../../../providers/web3/logging';
import { TeamProvider } from '../../../providers/web3/team';
import { SettingsProvider } from '../../../providers/storage/settings';



@Component({
  selector: 'app-votings',
  templateUrl: './votings.component.html',
  styleUrls: ['./votings.component.css']
})
export class VotingsComponent implements OnInit {

  votings: any[];
  closedVotings: any[];
  currentAddress: any;

  constructor(
    private loggingProvider: LoggingProvider,
    private settingsProvider: SettingsProvider,
    private teamProvider: TeamProvider
  ) { }

  async ngOnInit() {
    this.repeatAsyncWithDelay(500, this.getVotings);
    this.repeatAsyncWithDelay(500, this.getClosdVotings);
  }

  async getVotings () {
    let votings = await this.teamProvider.getVotings();
    this.votings = votings;
  }

  async getClosdVotings () {
    let closedVotings = await this.teamProvider.getClosedVotings();
    this.closedVotings = closedVotings;
  }

  async setVotingAddress(address) {
    this.currentAddress = address;
  }

  private repeatAsyncWithDelay(delay, cb)  {
    const helperFunction = async () => {
      await cb.call(this);
      setTimeout(helperFunction, delay)
    }
    helperFunction();
  }

}
