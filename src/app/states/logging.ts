import { IState } from './istate';

export class LoggingState implements IState {

  public contract: any;
  public count: number;

  public teamAddressByIndex = [];

  reset() {
    this.contract = null;
    this.count = null;
    
    this.teamAddressByIndex = [];
  }
}
