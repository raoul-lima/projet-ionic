import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController, LoadingController, PopoverController, ModalController, Alert, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as io from 'socket.io-client';

import { AuthPage } from '../pages/auth/auth';
import { AuthService } from '../service/auth.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { CallComponent } from '../components/call/call';
import { SmsComponent } from '../components/sms/sms';
import { AproposPage } from '../pages/apropos/apropos';
import { MoiPage } from '../pages/moi/moi';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = AuthPage;
  socket: any;
  who: string= 'inconnu';
  messageShared: string = 'Rejoignez nous sur echatter';
  @ViewChild('content') content: NavController;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menuCtrl: MenuController,
    public authSrv: AuthService,public loadCtrl: LoadingController, private socialSharing: SocialSharing,
    private popoverCtrl: PopoverController, public modalCtrl: ModalController, private alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.socket = io.connect('http://192.168.43.24:8888');    
    this.socket.emit('new_user_anonyme', this.who);
  }

  deconnect(){
    let alert = this.alertCtrl.create({
      title: 'Deconnexion',
      subTitle: 'Vous deconnecter ?',
      buttons:[
        {
          text: 'Confirm',
          handler: () => {
            let load = this.loadCtrl.create({content: 'Deconnexion ...'});
            load.present();
            this.who = this.authSrv.me;
            //this.socket.emit('deconnect',this.who);
            this.authSrv.signOut(this.who);
            this.socket.emit('deconnect',this.who);
            this.menuCtrl.close();
            //this.socket.emit('deconnect',this.who);
            load.dismiss();
            //this.socket.disconnect();
            this.content.setRoot(this.rootPage);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  dismiss(){
    this.menuCtrl.close();
  }

  share(){
    this.socialSharing.share(this.messageShared,null,null,null).then(()=>{

    }).catch(()=>{

    });
  }

  callPopover(event){
    let popover = this.popoverCtrl.create(CallComponent);
    popover.present({
      ev: event
    });
  }

  smsPopover(event){
    let popover = this.popoverCtrl.create(SmsComponent);
    popover.present({
      ev: event
    });
  }

  Apropos(){
    let modal  = this.modalCtrl.create(AproposPage);
    modal.present();
  }

  moi(){
  this.menuCtrl.close();
  this.content.setRoot(MoiPage);
  }
  
}

