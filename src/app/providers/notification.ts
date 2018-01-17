import { Injectable } from '@angular/core';


@Injectable()
export class NotificationProvider {

  private $: any = (<any>window).$;

  constructor() {}

  public notify  (message: string, type: string = 'info', timer: number = 4000) {
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