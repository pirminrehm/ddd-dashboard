import { Component, OnInit } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar-routes.config';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SettingsProvider } from '../../providers/storage/settings';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    logging: any = {};

    constructor(
      location: Location,
      private settingsProvider: SettingsProvider
    ) {
      this.location = location;
    }

    async ngOnInit(){
      this.listTitles = ROUTES.filter(listTitle => listTitle);
      this.logging.address = await this.settingsProvider.getLoggingAddress();
      console.log(this.logging.address);
    }

    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 2 );
      }
      titlee = titlee.split('/').pop();

      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }

    setLoggingContract() {
      console.log(this.logging.address);      
      this.settingsProvider.setLoggingAddress(this.logging.address);
      window.location.reload();
    }
}
