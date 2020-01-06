import { Component } from '@angular/core';
import { SMS } from '@ionic-native/sms';

@Component({
  selector: 'sms',
  templateUrl: 'sms.html'
})
export class SmsComponent {
  number: string = '';
  message: string = '';
  constructor(private sms: SMS) {
    
  }

  sendSMS(){
    var options:{
      replaceLineBreaks: true,
      android:{
        intent: 'INTENT'
      }
    }
    this.sms.send(this.number,this.message,options).then(()=>{
      console.log('send sms clicked');
    }).catch((err)=>{
      alert(JSON.stringify(err));
    });
  }

}
