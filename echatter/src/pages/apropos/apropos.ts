import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-apropos',
  templateUrl: 'apropos.html',
})
export class AproposPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AproposPage');
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
