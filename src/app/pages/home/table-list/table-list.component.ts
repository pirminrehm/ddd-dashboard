import { Component, OnInit } from '@angular/core';

import { LoggingProvider } from '../../../providers/web3/logging';


@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  teamAddresses: any[];

  constructor(
    private loggingProvider: LoggingProvider
  ) { }

  async ngOnInit() {
    let teamAddresses = await this.loggingProvider.getTeamAddresses();
    this.teamAddresses = teamAddresses;
  }

}
