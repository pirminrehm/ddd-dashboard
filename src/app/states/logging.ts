import { IState } from './istate';

export class LoggingState implements IState {

  public contract: any;
  public count: number;

  public teamAddressByIndex = [];

  resetLogging() {
    this.contract = null;
    this.count = null;
    
    this.teamAddressByIndex = [];
  }

  reset() {
  }  
}
