import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'call',
  templateUrl: 'call.html'
})
export class CallComponent {

  number: string = '';

  constructor(private callNumber: CallNumber) {
    
  }

  call(){
    this.callNumber.callNumber(this.number,true).then(()=>{

    }).catch((err)=>{
      alert(JSON.stringify(err));
    });
  }

}
