import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { HttpHeaders, HttpClient } from "@angular/common/http";

@Injectable()
export class MessageService{
    private message: any[];
    private receptMsgFriend: any[];
    private receptMsgFriendHorsLigne: any[];
    public notif: any;
    private notification: any[];
    messageSubject = new Subject<any[]>();
    receptMsgSubject = new Subject<any[]>();
    receptMsgSubjectHorsLigne = new Subject<any[]>();
    notifSubject = new Subject<any>();
    notificationSubject = new Subject<any>();
    constructor(public http: HttpClient){

    }

    emitConversation(me: string, to: string){
        let headers: any = new HttpHeaders({'content-type': 'application/json'});
        let options:any = {"key":"conversation", "src":me, "dst":to};
        let url:any = "http://192.168.43.24/Ionic/manage-message.php";

        return new Promise((resolve, reject)=>{
          this.http.post(url, JSON.stringify(options), headers).subscribe(
            (data: any)=>{
              this.message = data;
              this.messageSubject.next(this.message.slice());
              resolve(this.message);
              console.log('Donnees recus dans message service');
            },(error)=>{
              console.log('erreur reception message dans message service dans Error');
              // reject(error);
            }
          );
        });
    
        // this.http.post(url, JSON.stringify(options), headers).subscribe(
        //   (data: any)=>{
        //     this.message = data;
        //     console.log('Donnees recus dans message service');
        //   },(error)=>{
        //     console.log('erreur reception message dans message service dans Error');
        //   }
        // );
        // try{
        //     console.log('Taille du message:'+ this.message.length);
        //     this.messageSubject.next(this.message.slice());
        // }catch(Exception){
        //     console.log('erreur dans exception de message Service dans Catch');
        // }
    }


    sendMessage(me: string, to: string, msg:string, date: string){
        let headers: any = new HttpHeaders({'content-type': 'application/json'});
        let options:any = {"key":"message", "src": me, "dst": to, "msg": msg, "date": date};
        let url:any = "http://192.168.43.24/Ionic/manage-message.php";
    
        this.http.post(url, JSON.stringify(options), headers).subscribe(
          (data: any)=>{
            console.log('OK dans message service');
          },(error)=>{
            console.log('erreur dans message service');
          }
        );
        this.emitConversation(me, to);
      }

    receptMessage(me: string){
      let headers: any = new HttpHeaders({'content-type': 'application/json'});
      let options:any = {"key":"reception", "src":me};
      let url:any = "http://192.168.43.24/Ionic/manage-message.php";

      return new Promise((resolve,reject)=>{
        this.http.post(url, JSON.stringify(options), headers).subscribe(
          (data: any)=>{
            this.receptMsgFriend = data;
            console.log('message recu de dans message service :' + data);
            this.receptMsgSubject.next(this.receptMsgFriend.slice());
            resolve(this.receptMsgFriend);
          },(error)=>{
            console.log('erreur recept msg friend dans message service dans Error');
            //reject(error);
          }
        );
      });
  
      // this.http.post(url, JSON.stringify(options), headers).subscribe(
      //   (data: any)=>{
      //     this.receptMsgFriend = data;
      //     console.log('message recu de dans message service');
      //   },(error)=>{
      //     console.log('erreur recept msg friend dans message service dans Error');
      //   }
      // );
      // try{
      //     console.log('les destinateurs :'+this.receptMsgFriend);
      //     this.receptMsgSubject.next(this.receptMsgFriend.slice());
      // }catch(Exception){
      //     console.log('erreur dans exception de message Service dans Catch');
      // }
    }


    deleteReceptMsg(me: string, to: string){
      let headers: any = new HttpHeaders({'content-type': 'application/json'});
      let options:any = {"key":"deleteReception", "src": to, "dst": me};
      let url:any = "http://192.168.43.24/Ionic/manage-message.php";
  
      this.http.post(url, JSON.stringify(options), headers).subscribe(
        (data: any)=>{
          console.log('OK dans message service');
        },(error)=>{
          console.log('erreur dans message service');
        }
      );
    this.receptMessage(me);
    }

    numberNotification(me: string){
      let headers: any = new HttpHeaders({'content-type': 'application/json'});
      let options:any = {"key":"numberNotification", "src":me};
      let url:any = "http://192.168.43.24/Ionic/manage-message.php";

      return new Promise((resolve,reject)=>{
        this.http.post(url, JSON.stringify(options), headers).subscribe(
          (number: any)=>{
            this.notif = number;
            console.log(number + ' new notification');
            this.notifSubject.next();
            resolve(this.notif);
          },(error)=>{
            console.log('erreur dans number notification de message service');
            //reject(error);
          }
        );
      });
    }

    sendNotification(me: string){
      let headers: any = new HttpHeaders({'content-type': 'application/json'});
      let options:any = {"key":"notification", "src":me};
      let url:any = "http://192.168.43.24/Ionic/manage-message.php";

      return new Promise((resolve,reject)=>{
        this.http.post(url, JSON.stringify(options), headers).subscribe(
          (resultat: any)=>{
            this.notification = resultat;
            console.log('les notifications '+ this.notification);
            this.notificationSubject.next(this.notification.slice());
            resolve(this.notification);
          },(error)=>{
            console.log('erreur dans send notification de message service');
            //reject(error);
          }
        );
      });
    }

    receptMsgfriendHorsLigne(me: string){
      let headers: any = new HttpHeaders({'content-type': 'application/json'});
      let options:any = {"key":"receptionDesHorsLigne", "src":me};
      let url:any = "http://192.168.43.24/Ionic/manage-message.php";

      return new Promise((resolve,reject)=>{
        this.http.post(url, JSON.stringify(options), headers).subscribe(
          (data: any)=>{
            this.receptMsgFriendHorsLigne = data;
            console.log('message recu de dans message service :' + data);
            this.receptMsgSubjectHorsLigne.next(this.receptMsgFriendHorsLigne.slice());
            resolve(this.receptMsgFriendHorsLigne);
          },(error)=>{
            console.log('erreur recept msg friend dans message service dans Error');
            //reject(error);
          }
        );
      });
    }


}