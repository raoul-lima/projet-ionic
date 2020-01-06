import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FriendsService } from '../../service/friends.service';
import { Subscription } from 'rxjs/Subscription';
import { NavParams, AlertController, NavController, PopoverController, ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import * as io from 'socket.io-client';
import { ChangeProfilComponent } from '../../components/change-profil/change-profil';
import { ProfilViewPage } from '../profil-view/profil-view';

@Component({
  selector: 'page-moi',
  templateUrl: 'moi.html',
})
export class MoiPage implements OnInit{
  me: string = this.authSrv.me;
  today: string;
  now = new Date();
  myFriends: any;
  socket: any;
  myProfil: string;
  hasFriend = 0;
  MyfriendsSubscription = new Subscription();
  constructor(public navParams: NavParams, public authSrv: AuthService, private friendSrv: FriendsService,
    private alertCtrl: AlertController, private navCtrl: NavController,public http: HttpClient, 
    private popoverCtrl: PopoverController, public modalCtrl: ModalController) {
      this.socket = io.connect('http://192.168.43.24:8888');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MoiPage');
  }

  ngOnInit(){
    this.initMyFriends();
  }

  ionViewWillEnter(){
    this.initMyFriends();
    this.getProfil(this.me);
  }

  initMyFriends(){
    this.MyfriendsSubscription = this.friendSrv.MyfriendSubject.subscribe(
      (myFriends: any[])=>{
        this.myFriends = myFriends;
        this.verifHasFriend();
        console.log('amis dans moi '+ this.myFriends);
      }
    );
    this.friendSrv.emitMyFriends(this.me);
  }

  verifHasFriend(){
    for(let fr of this.myFriends){
      this.hasFriend = 1;
    }
  }

  deleteFriend(who: string){
    this.today = this.getDate();
    let alert = this.alertCtrl.create({
      title:'Quit Friend', subTitle:'Do you really want to quit ' + who, buttons:[
        {
          text: 'Confirm',
          handler: () => {
            this.friendSrv.removeFriend(this.me, who, this.today);
            this.friendSrv.emitMyFriends(this.me);
              this.socket.emit('notification', who);
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

  retour(){
    this.navCtrl.setRoot(HomePage,{me: this.me});
  }

  getDate(){
    return document.getElementById('date').innerText;
  }

  getProfil(pseudo: string){
    let headers: any = new HttpHeaders({'content-type':'application/json'});
    let options: any = {"key": "findProfil","who":pseudo};
    let url: any = "http://192.168.43.24/Ionic/fetch_image.php";

    this.http.post(url, JSON.stringify(options), headers).subscribe(
        (path: any)=>{
            console.log('le path '+path);
            this.myProfil = path;
        }, (error)=>{
            console.log('erreur de getProfil dans auth service');
        }
    );
}

changeProfilPopover(event){
  let popover = this.popoverCtrl.create(ChangeProfilComponent);
  popover.present({
    ev: event
  });

  popover.onDidDismiss(popoverData =>{
        console.log("popoverData");
        this.initMyFriends();
        setTimeout(()=>{
          this.getProfil(this.me);
        }, 500);                                         
  });     
}

viewProfil(name: string, profil: string){
  let modal = this.modalCtrl.create(ProfilViewPage,{name: name,profil: profil});
  modal.present();
  }

}
