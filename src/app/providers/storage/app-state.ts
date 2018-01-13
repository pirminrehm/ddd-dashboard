import { Injectable } from '@angular/core';

import { AppStateTypes } from '../../states/types';
import { TeamState } from '../../states/team';
import { VotingState } from '../../states/voting';
import { LocationState } from './../../states/location';
import { LoggingState } from './../../states/logging';

/*
  Generated class for the CacheProvider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AppStateProvider { 
  private static instances = [];

  constructor() {
  }

  static getInstance(type: AppStateTypes) {
    let state;
    if(type == AppStateTypes.TEAM) {
      state = new TeamState();
    } else if(type === AppStateTypes.VOTING) {
      state = new VotingState();
    } else if(type === AppStateTypes.LOCATION) {
      state = new LocationState();
    } else if(type === AppStateTypes.LOGGING) {
      state = new LoggingState();
    }
    this.instances.push(state);
    
    return state;
  }

  resetStates() {
    AppStateProvider.instances.forEach(instance => instance.reset());
  }
}