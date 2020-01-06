import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, MenuController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessagePage } from '../message/message';
import { FriendsService } from '../../service/friends.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../service/auth.service';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { RequestPage } from '../request/request';
import { MessageService } from '../../service/message.service';
import { NoticePage } from '../notice/notice';
import { ProfilViewPage } from '../profil-view/profil-view';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy{
  pageActif: string = 'message';
  baseURI: string = 'http://192.168.43.24/Ionic/';
  friends: any = [];
  errorMessage: string = '';
  me: string = 'inconnu';
  MyFriends: any = [];
  socket: any;
  request: number;
  notice: any;
  myProfil: any;
  friendsSubscription = new Subscription();
  MyfriendsSubscription = new Subscription();
  otherFriendsSubscription = new Subscription();
  requestSubscrition = new Subscription();
  noticeSubscription = new Subscription();
  profilSubscription = new Subscription();

  constructor(public friendSrv: FriendsService,public navCtrl: NavController, public navParams: NavParams,
    public loadCtrl: LoadingController, public http: HttpClient, public menuCtrl: MenuController,
    public authSrv: AuthService, public modalCtrl: ModalController, public msgSrv: MessageService){
    this.socket = io.connect('http://192.168.43.24:8888');
    this.me = this.navParams.get('me');
    this.getRequest().subscribe(msg=>{
      console.log('reception de requete du :'+ msg);
      this.friendSrv.numberRequest(this.me);
    });

    this.getNotice().subscribe(who=>{
      if(who === this.me){
        console.log('New notification');
        this.initNotice();
        this.msgSrv.numberNotification(this.me);
      }
    });
  }


  ngOnInit() {
    this.me = this.navParams.get('me');
    this.getProfil();
    this.authSrv.me = this.me;
    this.initMyFriends();
    this.initFriends();
    this.initMyFriends();
    this.initNotice();
    this.friendSrv.numberRequest(this.me);
    setTimeout(
      ()=>{
        this.initFriends();
      },100
    );
  }

  ionViewWillEnter(){
    this.me = this.navParams.get('me');
    this.getProfil();
    this.authSrv.me = this.me;
    this.initMyFriends();
    this.initFriends();
    this.initMyFriends();
    this.initNotice();
    this.friendSrv.numberRequest(this.me);
    setTimeout(
      ()=>{
        this.initFriends();
      },100
    );
  }

  ionViewWillLeave(){
    this.socket.disconnect();
  }

  getProfil(){
    this.profilSubscription = this.authSrv.profilSubject.subscribe(
      (profil: any)=>{
        this.myProfil = profil;
      }
    );
    this.authSrv.getProfil(this.me);
}

  initFriends(){
    this.friendsSubscription = this.friendSrv.friendSubject.subscribe(
      (friends: any[])=>{
        this.friends = friends;
      }
    );
    this.friendSrv.emitFriends();
  }

  initMyFriends(){
    this.MyfriendsSubscription = this.friendSrv.MyfriendSubject.subscribe(
      (myFriends: any[])=>{
        this.MyFriends = myFriends;
      }
    );
    this.friendSrv.emitMyFriends(this.me);
  }

  initNotice(){
    this.noticeSubscription = this.msgSrv.notifSubject.subscribe(
      (notif: any)=>{
        this.notice = this.msgSrv.notif;
        if(this.notice === 0){
          this.notice = '';
        }
      }
    );
    this.msgSrv.numberNotification(this.me);
  }

  addFriend(fr: any){
    console.log(fr);
    console.log(this.me);

    let load = this.loadCtrl.create({content: 'Veuillez Patienter !!!'});
    load.present();
    this.friendSrv.addFriend(fr, this.me);
    this.friendSrv.emitFriends();
    this.socket.emit('request',this.me);
    load.dismiss();
    setTimeout(
      ()=>{
        this.friendSrv.emitMyFriends(this.me);
        this.friendSrv.emitFriends();
      }, 100
    );
  }

  getRequest(){
    let observable = new Observable(observer=>{
      this.socket.on('request', (pseudo)=>{
        observer.next(pseudo);
      });
    })
    return observable;
  }

  getNotice(){
    let observable = new Observable(observer=>{
      this.socket.on('notification', (who)=>{
        observer.next(who);
      });
    })
    return observable;
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


  isFriend(name: string): boolean{
    for(let friend of this.MyFriends){
      if(friend.name === name) return true;
    }
    return false;
  }

  contact(name: string, profil: string){
    this.navCtrl.setRoot(MessagePage,{me: this.me, to: name, profil: profil});
  }

  doRefresh(refresher){
    this.initMyFriends();
    this.initFriends();
    this.initMyFriends();
    setTimeout(
      ()=>{
        this.initFriends();
        refresher.complete();
      },100
    );
  }

  doInfinite(infiniteScroll){
    setTimeout(
      ()=>{
        // this.searchOtherFriends();
        infiniteScroll.complete();
      },1000
    )
    
  }

  searchOtherFriends(){
    let taille_friends = 0;
    for(let p of this.friends){
      taille_friends++;
    }

    this.friendSrv.emitOtherFriends(taille_friends);
    console.log('taille actuelle de friends dans searchOtherFriends'+taille_friends);
    this.otherFriendsSubscription = this.friendSrv.otherFriendSubject.subscribe(
      (otherFriends: any[])=>{
        console.log('data sup recu '+otherFriends);
        for(let i of otherFriends){
            this.friends.push(i);  
        }
      }, (error)=>{
        console.log('erreur dans searchOtherFriends');
      }
    );
  }


  showListRequest(){
    let modal = this.modalCtrl.create(RequestPage);
    modal.present();
  }

  cancelSearch(){
    this.initFriends();
  }

  onSearch(event){
    // console.log(event.target.value);
    let who: string = event.target.value;
    this.friendSrv.friendSearch(who);
    this.friends = this.friendSrv.listFriendSearch;
  }

  viewProfil(name: string, profil: string){
    let modal = this.modalCtrl.create(ProfilViewPage,{name: name,profil: profil});
    modal.present();
  }

  ngOnDestroy(){
    this.friendsSubscription.unsubscribe();
    this.requestSubscrition.unsubscribe();
    this.MyfriendsSubscription.unsubscribe();
    this.otherFriendsSubscription.unsubscribe();
  }
}