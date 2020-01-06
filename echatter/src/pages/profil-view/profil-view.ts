import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-profil-view',
  templateUrl: 'profil-view.html',
})
export class ProfilViewPage implements OnInit{
  profil: any;
  name: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilViewPage');
  }

  ngOnInit(){
    this.profil = this.navParams.get('profil');
    this.name = this.navParams.get('name');
  }

  ionViewWillEnter(){
    this.profil = this.navParams.get('profil');
    this.name = this.navParams.get('name');
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
