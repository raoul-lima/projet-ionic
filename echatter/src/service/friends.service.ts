import { Subject } from "rxjs/Subject";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class FriendsService{
    private friends: any[];
    private myFriends: any[];
    private otherFriends: any[];
    public request_list: number;
    public friendTmp: any[];
    public listFriendSearch: any[];
    private list_of_request: any[];
    private list_of_friend_inline: any[];
    baseURI: string = 'http://192.168.43.24/Ionic/';
    friendSubject = new Subject<any[]>();
    MyfriendSubject = new Subject<any[]>();
    otherFriendSubject = new Subject<any[]>();
    requestSubject = new Subject<any[]>();
    inlineSubject = new Subject<any[]>();

    constructor(private http: HttpClient){}

    emitFriends(){
        let headers: any = new HttpHeaders({'content-type':'application/json'});
        let options: any = {"key": "listUsers"};
        let url: any = "http://192.168.43.24/Ionic/manage-user.php";

        return new Promise((resolve, reject)=>{
            this.http.post(url, JSON.stringify(options), headers).subscribe(
                (data: any)=>{
                    this.friends = data;
                    this.friendSubject.next(this.friends.slice());
                    resolve(this.friends);
                }, (error)=>{
                    console.log('erreur de recuperation list amis dans service friends');
                    //reject(error);
                }
                );
        });

        // this.http.post(url, JSON.stringify(options), headers).subscribe(
        //     (data: any)=>{
        //         this.friends = data;
        //     }, (error)=>{
        //         console.log('erreur de recuperation list amis dans service friends');
        //     }
        //     );
        //     try{
        //         console.log(this.friends);
        //         this.friendSubject.next(this.friends.slice());
        //     }catch(Exception){
        //         console.log('erreur dans exception de friends Service');
        //     } 
    }

    emitMyFriends(moi: string){
        let headers: any = new HttpHeaders({'content-type':'application/json'});
        let options: any = {"key": "listMyFriends", "me": moi};
        let url: any = "http://192.168.43.24/Ionic/manage-user.php";

        return new Promise((resolve, reject)=>{
            this.http.post(url, JSON.stringify(options), headers).subscribe(
                (data: any)=>{
                    this.myFriends = data;
                    this.friendTmp = data;
                    this.MyfriendSubject.next(this.myFriends.slice());
                    resolve(this.myFriends);
                }, (error)=>{
                    console.log('erreur de recuperation list de mes amis dans service friends');
                   // reject(error);
                }
                );
        });

        // this.http.post(url, JSON.stringify(options), headers).subscribe(
        // (data: any)=>{
        //     this.myFriends = data;
        //     this.friendTmp = data;
        // }, (error)=>{
        //     console.log('erreur de recuperation list de mes amis dans service friends');
        // }
        // );
        // try{
        //     console.log(this.myFriends);
        //     this.MyfriendSubject.next(this.myFriends.slice());
        // }catch(Exception){
        //     console.log('erreur dans exception de friends Service');
        // }
    }

    addFriend(amis: any, moi: string){
        let headers: any = new HttpHeaders({'content-type':'application/json'});
        let options: any = {"key": "addFriend", "me": moi, "friend": amis};
        let url: any = "http://192.168.43.24/Ionic/manage-user.php";

        this.http.post(url, JSON.stringify(options), headers).subscribe(
        (data: any)=>{
            console.log('ajout d\'amis avec succes');
        }, (error)=>{
            console.log('erreur de recuperation list de mes amis dans service friends');
        }
        );

        this.emitFriends();
        this.emitMyFriends(moi);
        this.emitFriends();
    }

    acceptFriend(amis:any, moi: string, date: string){
        let headers: any = new HttpHeaders({'content-type':'application/json'});
        let options: any = {"key": "accept", "me": moi, "friend": amis, "time": date};
        let url: any = "http://192.168.43.24/Ionic/manage-user.php";

        this.http.post(url, JSON.stringify(options), headers).subscribe(
        (data: any)=>{
            console.log('ajout d\'amis avec succes');
        }, (error)=>{
            console.log('erreur de recuperation list de mes amis dans service friends');
        }
        );

        this.emitFriends();
        this.emitMyFriends(moi);
        this.emitFriends();
    }

    emitOtherFriends(limite: number){
        let headers: any = new HttpHeaders({'content-type':'application/json'});
        let options: any = {"key": "listOtherUsers", "limite": limite};
        let url: any = "http://192.168.43.24/Ionic/manage-user.php";

        return new Promise((resolve,reject)=>{
            this.http.post(url, JSON.stringify(options), headers).subscribe(
                (data: any)=>{
                    this.otherFriends = data;
                    this.otherFriendSubject.next(this.otherFriends.slice());
                    resolve(this.otherFriends);
                }, (error)=>{
                    console.log('erreur de recuperation list des autres amis dans service friends');
                    //reject(error);
                }
                );
        });

        // this.http.post(url, JSON.stringify(options), headers).subscribe(
        // (data: any)=>{
        //     this.otherFriends = data;
        // }, (error)=>{
        //     console.log('erreur de recuperation list des autres amis dans service friends');
        // }
        // );
        
        // try{
        //     console.log(this.otherFriends);
        //     this.otherFriendSubject.next(this.otherFriends.slice());
        // }catch(Exception){
        //     console.log('erreur dans exception de autres amis friends Service');
        // }   
    }

    numberRequest(me: string){
        let headers: any = new HttpHeaders({'content-type':'application/json'});
        let options: any = {"key": "numberOfRequest", "pseudo": me};
        let url: any = "http://192.168.43.24/Ionic/manage-user.php";

        this.http.post(url, JSON.stringify(options), headers).subscribe(
        (data: any)=>{
            this.request_list = data;
            console.log('nombre de requete: ' + data);
        }, (error)=>{
            console.log('erreur de recuperation nombre de requete dans service friends');
        }
        );
    }

    emitRequestList(me: string){
        let headers: any = new HttpHeaders({'content-type':'application/json'});
        let options: any = {"key": "listOfRequest", "pseudo": me};
        let url: any = "http://192.168.43.24/Ionic/manage-user.php";

        return new Promise((resolve,reject)=>{
            this.http.post(url, JSON.stringify(options), headers).subscribe(
                (data: any)=>{
                    this.list_of_request = data;
                    this.requestSubject.next(this.list_of_request.slice());
                    console.log('pseudo des requetes: ' + data);
                    resolve(this.list_of_request);
                }, (error)=>{
                    console.log('erreur de recuperation pseudo de requete dans service friends');
                    
                }
                );
        });

        // this.http.post(url, JSON.stringify(options), headers).subscribe(
        // (data: any)=>{
        //     this.list_of_request = data;
        //     console.log('pseudo des requetes: ' + data);
        // }, (error)=>{
        //     console.log('erreur de recuperation pseudo de requete dans service friends');
        // }
        // );

        // try{
        //     console.log(this.list_of_request);
        //     this.requestSubject.next(this.list_of_request.slice());
        // }catch(Exception){
        //     console.log('erreur dans request list de friends Service');
        // }   
    }

    listFriendInline(me: string){
        let headers: any = new HttpHeaders({'content-type':'application/json'});
        let options: any = {"key": "inline", "pseudo": me};
        let url: any = "http://192.168.43.24/Ionic/manage-user.php";

        return new Promise((resolve,reject)=>{
            this.http.post(url, JSON.stringify(options), headers).subscribe(
                (data: any)=>{
                    this.list_of_friend_inline = data;
                    console.log('pseudo des en ligne: ' + data);
                    this.inlineSubject.next(this.list_of_friend_inline.slice());
                    resolve(this.list_of_friend_inline);
                }, (error)=>{
                    console.log('erreur de recuperation pseudo des en ligne dans service friends');
                    //reject(error);
                }
                );
        });

        // this.http.post(url, JSON.stringify(options), headers).subscribe(
        // (data: any)=>{
        //     this.list_of_friend_inline = data;
        //     console.log('pseudo des en ligne: ' + data);
        // }, (error)=>{
        //     console.log('erreur de recuperation pseudo des en ligne dans service friends');
        // }
        // );

        // try{
        //     console.log(this.list_of_friend_inline);
        //     this.inlineSubject.next(this.list_of_friend_inline.slice());
        // }catch(Exception){
        //     console.log('erreur dans inline friends list de friends Service');
        // }   
    }

    friendSearch(who: string){
        let headers: any = new HttpHeaders({'content-type':'application/json'});
        let options: any = {"key": "searchFriend","who":who};
        let url: any = "http://192.168.43.24/Ionic/manage-user.php";

            this.http.post(url, JSON.stringify(options), headers).subscribe(
                (data: any)=>{
                    this.listFriendSearch = data;
                    this.friendSubject.next(this.listFriendSearch.slice());
                    // console.log('resultat recherche '+ this.listFriendSearch);
                }, (error)=>{
                    console.log('erreur de recuperation list amis dans service friends');
                }); 
    }

    removeFriend(me: string, who: string, date: string){
        let headers: any = new HttpHeaders({'content-type':'application/json'});
        let options: any = {"key": "removeFriend", "me": me, "who": who, "time": date};
        let url: any = "http://192.168.43.24/Ionic/manage-user.php";

        this.http.post(url, JSON.stringify(options), headers).subscribe(
        (data: any)=>{
            console.log('friend deleted');
        }, (error)=>{
            console.log('erreur dans friend delete service');
        }
        );
    }

}