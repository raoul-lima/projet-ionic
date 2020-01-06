import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { FriendsService } from '../../service/friends.service';
import { AuthService } from '../../service/auth.service';
import * as io from 'socket.io-client'; 

@Component({
  selector: 'page-request',
  templateUrl: 'request.html',
})
export class RequestPage implements OnInit{
  socket: any;
  list_request:any = [];
  listRequestSubscription = new Subscription(); 
  listTmp:any=[];
  now = new Date();
  today: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public friendSrv: FriendsService, public authSrv: AuthService, public viewCtrl: ViewController) {
      this.socket = io.connect('http://192.168.43.24:8888');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestPage');
  }

  ngOnInit(){
    this.initRequest();
    setTimeout(
      ()=>{
        this.initRequest();
      },500
    );
    this.friendSrv.emitMyFriends(this.authSrv.me);
    this.listTmp = this.friendSrv.friendTmp;
  }

  initRequest(){
    this.listRequestSubscription = this.friendSrv.requestSubject.subscribe(
      (listRequest: any[])=>{
        this.list_request = listRequest;
        console.log('list dans request page: '+ listRequest);
      }
    );
    this.friendSrv.emitRequestList(this.authSrv.me);
  }

  closeModal(){
    this.friendSrv.emitMyFriends(this.authSrv.me);
    this.friendSrv.emitFriends();
    this.viewCtrl.dismiss();
  }

  isFriend(name: string): boolean{
      for(let friend of this.listTmp){
        if(friend === name) return true;
      }
      return false;
  }

  acceptFriend(name: string){
    this.today = this.getDate();
    this.friendSrv.acceptFriend(name, this.authSrv.me, this.today);
    this.listTmp.push(name);
    this.friendSrv.numberRequest(this.authSrv.me);
    this.socket.emit('notification', name);
    // this.friendSrv.emitMyFriends(this.authSrv.me);
    // this.friendSrv.emitFriends();
  }

  getDate(){
    return document.getElementById('date').innerText;
  }

  

}
