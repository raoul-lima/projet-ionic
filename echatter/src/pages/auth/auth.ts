import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HomePage } from '../home/home';
import { AddAccountPage } from '../add-account/add-account';
import { AuthService } from '../../service/auth.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})
export class AuthPage {
  connexion: boolean = false;
  errorMessage: string = '';
  username: string = '';
  password: string = '';
  baseURI: string = 'http://192.168.43.24/Ionic/';
  socket: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, public modalCtrl: ModalController,
              public http: HttpClient, public loadCtrl: LoadingController,
              public toastCtrl: ToastController,public authSrv: AuthService) {

                this.socket = io.connect('http://192.168.43.24:8888');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthPage');
  }

  ionViewWillLeave(){
    this.socket.disconnect();
  }

  clickConnect(){
    //this.navCtrl.setRoot(HomePage,{me: 'Essai'});
    this.connexion = true;
  }


  addAccount(){
    // let modal = this.modalCtrl.create(AddAccountPage);
    // modal.present();
    this.navCtrl.setRoot(AddAccountPage);
  }

  loginUser(){                      
      let headers: any = new HttpHeaders({'content-type':'application/json'});
      let options: any = {"key":"authentification","username": this.username,"password": this.password};
      let url: any = this.baseURI + "manage-user.php";

      let load = this.loadCtrl.create({content: 'Veuillez Patienter !!!'});
      load.present();
      
      this.http.post(url, JSON.stringify(options), headers).subscribe(
        (data: any) => {
          //this.sendNotification(data);
          if(data){
                  let option: any = {"key":"whoAmi","username": this.username};
                  this.http.post(url, JSON.stringify(option), headers).subscribe(
                  (psed: any) =>{
                  this.authSrv.signIn(psed);
                  this.authSrv.me = psed;
                  this.socket.emit('new_user', psed);
                  this.socket.disconnect();
                  this.navCtrl.setRoot(HomePage,{me: psed});
                  },(error)=>{
                  this.errorMessage += 'Pseudo not found ';
                  }
                  );
          }
          else{
            this.errorMessage = 'Username or Password Invalid';
          }
        }, (error) => {
          this.sendNotification('something went wrong !! \n Please, try Again');
        }
      );

      load.dismiss();
  }

  sendNotification(msg: string){
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'bottom',
      duration: 4000
    });
    toast.present();
  }





}
