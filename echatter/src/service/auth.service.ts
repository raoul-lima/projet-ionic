import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Subject } from "rxjs/Subject";

@Injectable()
export class AuthService{
    public me: string = 'inconnu';
    public profil:any;

    profilSubject = new Subject<any>();
    ToprofilSubject = new Subject<any>();
    constructor(public http: HttpClient){

    }

    signIn(pseudo: string){
        let headers: any = new HttpHeaders({'content-type':'application/json'});
        let options: any = {"key": "connect","pseudo":pseudo};
        let url: any = "http://192.168.43.24/Ionic/manage-user.php";

        this.http.post(url, JSON.stringify(options), headers).subscribe(
        (data: any)=>{
            console.log('Vous etes connecté');
        }, (error)=>{
            console.log('erreur de connexion');
        }
        );
    }

    signOut(pseudo: string){
        let headers: any = new HttpHeaders({'content-type':'application/json'});
        let options: any = {"key": "disconnect","pseudo":pseudo};
        let url: any = "http://192.168.43.24/Ionic/manage-user.php";

        this.http.post(url, JSON.stringify(options), headers).subscribe(
        (data: any)=>{
            console.log('Vous etes deconnecté dans auth service');
        }, (error)=>{
            console.log('erreur de deconnexion dans auth service');
        }
        );
    }

    getProfil(pseudo: string){
        let headers: any = new HttpHeaders({'content-type':'application/json'});
        let options: any = {"key": "findProfil","who":pseudo};
        let url: any = "http://192.168.43.24/Ionic/fetch_image.php";
    
        this.http.post(url, JSON.stringify(options), headers).subscribe(
            (path: any)=>{
                //console.log('le path '+path);
                this.profil = path;
                this.profilSubject.next(this.profil.slice());
            }, (error)=>{
                console.log('erreur de getProfil dans auth service');
            }
        );
    }

    getToProfil(pseudo: string){
        let headers: any = new HttpHeaders({'content-type':'application/json'});
        let options: any = {"key": "findProfil","who":pseudo};
        let url: any = "http://192.168.43.24/Ionic/fetch_image.php";
    
        this.http.post(url, JSON.stringify(options), headers).subscribe(
            (path: any)=>{
                //console.log('le path '+path);
                
                this.ToprofilSubject.next(this.profil.slice());
            }, (error)=>{
                console.log('erreur de getProfil dans auth service');
            }
        );
    }
    
}