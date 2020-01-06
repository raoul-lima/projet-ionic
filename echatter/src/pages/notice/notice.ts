import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MessagePage } from '../message/message';
import { MessageService } from '../../service/message.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'page-notice',
  templateUrl: 'notice.html',
})
export class NoticePage implements OnInit{
  me: string;
  notification: any[];
  myProfil: any;

  profilSubscription = new Subscription();
  notificationSubscription = new Subscription();
  constructor(public navCtrl: NavController, private navParams: NavParams, private menuCtrl: MenuController,
    private msgSrv: MessageService, public authSrv: AuthService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticePage');
  }

  ngOnInit(){
    this.me = this.navParams.get('me');
    this.getProfil();
    this.initNotification();
  }

  ionViewWillEnter(){
    this.me = this.navParams.get('me');
    this.getProfil();
    this.initNotification();
  }

  getProfil(){
    this.profilSubscription = this.authSrv.profilSubject.subscribe(
      (profil: any)=>{
        this.myProfil = profil;
      }
    );
    this.authSrv.getProfil(this.me);
}

  initNotification(){
    this.notificationSubscription = this.msgSrv.notificationSubject.subscribe(
      (notices: any[])=>{
        this.notification = notices;
      }
    );
    this.msgSrv.sendNotification(this.me);
  }

  goToMessage(){
    this.navCtrl.setRoot(MessagePage,{me: this.me});
  }

  goToNotice(){
    this.navCtrl.setRoot(NoticePage,{me: this.me});
  }

  goToOptions(){
    console.log('Options click');
    this.menuCtrl.open();
  }

  goToFriend(){
    this.navCtrl.setRoot(HomePage,{me: this.me});
  }

}
