import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../../service/message.service';
import { Subscription } from 'rxjs/Subscription';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { FriendsService } from '../../service/friends.service';
import { NoticePage } from '../notice/notice';
import { AuthService } from '../../service/auth.service';



@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage  implements OnInit, OnDestroy{
  name: string = '';
  me: string = 'inconnu';
  message: string = '';
  to: string;
  conversation: any = [];
  qui: string = 'inconnue';
  conversationSubscription = new Subscription();
  socket: any;
  friend_inline:any = [];
  recept_msg_friend:any = [];
  recept_msg_friend_outline:any = [];
  recept_msg_friend_outline_tmp:any = [];
  tab_outline:any = [];
  now = new Date();
  today: string = '';
  notice: any;
  myProfil: any;
  toProfil: any;

  receptMsgFriendSubscription = new Subscription();
  friendInlineSubscription = new Subscription();
  noticeSubscription = new Subscription();
  profilSubscription = new Subscription();
  toProfilSubscription = new Subscription();
  receptMsgFriendSubscriptionHorsLigne = new Subscription();

  constructor(public navCtrl: NavController, public navParams: NavParams,
            public http: HttpClient, public msgSrv: MessageService, 
            public menuCtrl: MenuController, public friendSrv: FriendsService, public authSrv: AuthService) {
              this.socket = io.connect('http://192.168.43.24:8888');
              this.me = this.navParams.get('me');
              this.to = this.navParams.get('to');
              this.socket.emit('mon_pseudo', this.me);
              //this.recuperationMessage();
              this.getMessages().subscribe((pseudo: string)=>{
                this.initReceptMsg();
                this.recuperationRecept();
                if(this.to === pseudo){
                  this.msgSrv.emitConversation(this.me,pseudo);
                  this.msgSrv.deleteReceptMsg(this.me, pseudo);
                  this.recuperationRecept();
                  setTimeout(
                    ()=>{
                      this.msgSrv.emitConversation(this.me,pseudo);
                    },300
                    );
                }
              });

              this.getNewUser().subscribe((pseudo: string)=>{
                if(this.testOutline(pseudo)){
                   console.log('le deconnect est en ligne :' + pseudo);
                }
                  this.friendSrv.listFriendInline(this.me);
                  this.recuperationInline();
              });

              this.getDeconnexion().subscribe((pseudo: string)=>{
                this.friendSrv.listFriendInline(this.me);
                this.msgSrv.receptMsgfriendHorsLigne(this.me);
              });

              this.getNotice().subscribe(who=>{
                if(who === this.me){
                  console.log('New notification');
                  this.initNotice();
                  this.msgSrv.numberNotification(this.me);
                }
              });

  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
  }

  ionViewWillEnter(){
    this.me = this.navParams.get('me');
    this.to = this.navParams.get('to');
    this.getProfil();
    this.toProfil = this.navParams.get('profil');
    this.initConversation();
    this.initInline();
    this.initReceptMsg();
    this.initNotice();
    this.today = this.getDate();
  }


  

  ngOnInit(){
    this.me = this.navParams.get('me');
    this.to = this.navParams.get('to');
    this.getProfil();
    this.toProfil = this.navParams.get('profil');
    this.initConversation();
    this.initInline();
    this.initReceptMsg();
    this.initNotice();
    this.today = this.getDate();
  }

  ionViewWillLeave(){
   this.to = ' ';
   this.conversation = [];
    this.socket.disconnect();
  }

  ionViewDidLeave(){
    this.to = ' ';
    this.conversation = [];
  }

  getProfil(){
    this.profilSubscription = this.authSrv.profilSubject.subscribe(
      (profil: any)=>{
        this.myProfil = profil;
      }
    );
    this.authSrv.getProfil(this.me);
}

getToProfil(){
  this.toProfilSubscription = this.authSrv.ToprofilSubject.subscribe(
    (Toprofil: any)=>{
      this.toProfil = Toprofil;
    }
  );
  this.authSrv.getToProfil(this.to);
}



  initConversation(){
    this.conversationSubscription = this.msgSrv.messageSubject.subscribe(
      (message: any[])=>{
        this.conversation = message;
      }
    );
    this.msgSrv.emitConversation(this.me, this.to);
    this.recuperationMessage();
  }

  initInline(){
    this.friendInlineSubscription = this.friendSrv.inlineSubject.subscribe(
      (inline: any[])=>{
        this.friend_inline = inline;
      }
    );
    this.friendSrv.listFriendInline(this.me);
    this.recuperationInline();
  }

  initReceptMsg(){
    this.receptMsgFriendSubscription = this.msgSrv.receptMsgSubject.subscribe(
      (recept: any[])=>{
        this.recept_msg_friend = recept;
        console.log('initreceptmsg '+ this.recept_msg_friend);
      }
    );
    this.msgSrv.receptMessage(this.me);
    this.initOutline();
    this.recuperationRecept();
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

  goToMessage(){
    this.navCtrl.setRoot(MessagePage,{me: this.me,to: this.to});
  }

  goToNotice(){
    this.navCtrl.setRoot(NoticePage,{me: this.me});
  }

  goToOptions(){
    console.log('Options click');
    this.menuCtrl.open();
  }

  goToFriend(){
    this.to = '';
    this.initConversation();
    this.navCtrl.setRoot(HomePage,{me: this.me});
  }

  sendMessage(){
    this.today = this.getDate();
    this.socket.emit('message', this.message);
    this.msgSrv.sendMessage(this.me, this.to, this.message, this.today);
    this.message= '';
    setTimeout(
      ()=>{
        this.msgSrv.emitConversation(this.me, this.to);
      },300
      );
    this.msgSrv.emitConversation(this.me, this.to);
  }

  isSent(name: string): boolean{
    if(this.me === name)
    {
      this.qui = 'moi';
      return true;
    }
    this.qui = this.to;
    return false;
  }

  recuperationMessage(){
    try{
      setTimeout(
        ()=>{
          this.msgSrv.emitConversation(this.me, this.to);
        },300
        );
    }catch(Exception){
      console.log('erreur dans recuperation message .ts');
    }
  }

  recuperationInline(){
    try{
      setTimeout(
        ()=>{
          this.friendSrv.listFriendInline(this.me);
        },300
        );
    }catch(Exception){
      console.log('erreur dans recuperation list des en ligne .ts');
    }
  }

  recuperationRecept(){
    try{
      setTimeout(
        ()=>{
          this.msgSrv.receptMessage(this.me);
        },300
        );
        this.initOutline();
    }catch(Exception){
      console.log('erreur dans recuperation list des en ligne .ts');
    }
  }


  checkName(){
    // let headers: any = new HttpHeaders({'content-type': 'application/json','Access-Control-Allow-Origin': '*'});
    let data = {name: this.name};

    this.http.post('http://192.168.43.24:8888/aty', data).subscribe(
      (response: any) => {
        console.log('POST Response: ', response);
      }, (error) =>{
        console.log('Erreur dans POST');
      }
    );

    this.http.get('http://192.168.43.24:8888/aty/'+ this.name).subscribe(
      (response: any) => {
        console.log('GET Response: ', response);
      }, (error)=>{
        console.log('Erreur dans GET');
      }
    );
  }

  getMessages(){
    let observable = new Observable(observer=>{
      this.socket.on('message',(msg)=>{
        observer.next(msg);
      });
    })
    //this.recuperationMessage();
    return observable;
  }

  getNewUser(){
    let observable = new Observable(observer=>{
      this.socket.on('new_user',(pseudo)=>{
        observer.next(pseudo);
      });
    })
    //this.recuperationMessage();
    return observable;
  }

  getDeconnexion(){
    let observable = new Observable(observer=>{
      this.socket.on('deconnect',(pseudo)=>{
        observer.next(pseudo);
      });
    })
    return observable;
  }

  chatWith(to: string, profil: string){
    this.to = to;
    this.toProfil = profil;
    this.msgSrv.deleteReceptMsg(this.me,this.to);
    this.msgSrv.receptMessage(this.me);
    this.recuperationRecept();
    this.msgSrv.emitConversation(this.me, this.to);
    this.recuperationMessage();
  }

  reception(from: any){
    for(let recept of this.recept_msg_friend){
      if(recept.name === from)
      {
        return true;
      }
    }
    return false;
  }

  isReallyOutline(who: string){
    for(let name of this.friend_inline){
      if(name === who)return false;
    }
    return true;
  }

  testOutline(pseudo: string){
    for(let friend of this.recept_msg_friend){
      if(pseudo === friend)return true;
    }
    return false;
  }

  supprOutline(pseudo: string){
    let count=0;
    for(let friend of this.recept_msg_friend){
      if(pseudo === friend)this.recept_msg_friend.splice(count,1);
      count++;
    }
  }

  initOutline(){
    this.receptMsgFriendSubscriptionHorsLigne = this.msgSrv.receptMsgSubjectHorsLigne.subscribe(
      (recept: any[])=>{
        this.recept_msg_friend_outline = recept;
      }
    );
    this.msgSrv.receptMsgfriendHorsLigne(this.me);
  }

  ngOnDestroy(){
    this.conversationSubscription.unsubscribe();
    this.friendInlineSubscription.unsubscribe();
    this.receptMsgFriendSubscription.unsubscribe();
  }

  getDate(){
    return document.getElementById('date').innerText;
  }

  getNotice(){
    let observable = new Observable(observer=>{
      this.socket.on('notification', (who)=>{
        observer.next(who);
      });
    })
    return observable;
  }


}
