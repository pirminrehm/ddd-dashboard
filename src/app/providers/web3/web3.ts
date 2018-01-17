import { SettingsProvider } from './../storage/settings';
import { Injectable } from '@angular/core';

import * as Web3 from 'web3';

import contract from 'truffle-contract';


const TEST_RPC_IP = 'localhost:7545'; //'192.168.0.150:9545';

declare var window: any;

/*
  Generated class for the Web3Provider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Web3Provider {

  private ready: Promise<any>;

  private web3: any;
  private account: string;
  private accounts: string[];

  constructor(
    private settingsProvider: SettingsProvider
  ) {
    this.ready = new Promise((resolve,reject) => this.init(resolve,reject));
  }


  // GETTER

  async getAccount() {
    // TODO: Maybe remove this function completly from web3 provider and 
    // call settings provider directly instead.
    await this.ready;
    const account = await this.settingsProvider.getAccount();
    return account ? account : this.accounts[0];
  }

  async getAccounts() {
    await this.ready;
    return this.accounts;
  }


  // INTERACTORS

  async toWeb3String(value: string) {
    await this.ready;
    return this.web3.fromUtf8(value);
  }

  async fromWeb3String(value: any) {
    await this.ready;
    return this.web3.toUtf8(value);
  }

  async toWeb3Number(value: number) {
    await this.ready;
    return this.web3.toBigNumber(value);
  }

  async fromWeb3Number(value: any) {
    await this.ready;
    return Number(value.toString(10));
  }


  // HELPERS
  async getRawContract(artifact: any) {
    await this.ready;

    const location = contract(artifact);
    location.setProvider(this.web3.currentProvider);
    return location;
  }

  async getDeployedContract(artifact: any) {
    return (await this.getRawContract(artifact)).deployed();
  }

  async getContractAt(artifact: any, address:string) {
    return (await this.getRawContract(artifact)).at(address);
  }


  private async init(resolve,reject) {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      console.warn(
        'Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.warn(
        'No web3 detected. Falling back to http://' + TEST_RPC_IP + '. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(
        new Web3.providers.HttpProvider('http://' + TEST_RPC_IP)
      );
    }

    // Query and init accounts
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert('There was an error fetching your accounts.');
        return;
      }

      if (accs.length === 0) {
        alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }
      this.accounts = accs;
      resolve();


    });
  }
}
