import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HomePage } from '../home/home';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Observable } from 'rxjs/Observable';
import { AuthPage } from '../auth/auth';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'page-add-account',
  templateUrl: 'add-account.html'
})
export class AddAccountPage implements OnInit{
  accountForm: FormGroup;
  username: string;
  password: string;
  pseudo: string;
  baseURI: string = "http://192.168.43.24/Ionic/";
  errorMessage: string = '';
  base64Image: any;
  picture: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public formBuilder: FormBuilder, public viewCtrl: ViewController,
              public loadCtrl: LoadingController, public http: HttpClient,
              public toastCtrl: ToastController, private camera: Camera,
              public authSrv: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddAccountPage');
  }

  ngOnInit(){
    this.initForm();
  }

  initForm(){
    this.accountForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      pseudo: ['', Validators.required]
    });
  }

  onAddUser(){
    let usernam = this.accountForm.controls['username'].value;
    let pass = this.accountForm.controls['password'].value;
    let pseud = this.accountForm.controls['pseudo'].value;

    console.log(usernam + "  "+ pass +"  "+ pseud);
    let load = this.loadCtrl.create({content: 'Veuillez Patienter !!!'});
    load.present();
    this.createUser(usernam, pass, pseud);
    load.dismiss();
  }

  createUser(usernam: string, pass: string, pseud: string)
  {
    let headers: any = new HttpHeaders({'content-type': 'application/json'});
    let options: any = {"key":"create", "username": usernam, "password": pass, "pseudo": pseud};
    let url: any = this.baseURI + "manage-user.php";

    let opt: any = {"key":"exist", "pseudo": pseud};

    this.http.post(url, JSON.stringify(opt), headers).subscribe(
      (data: any)=>{
        if(data)
        {
            this.errorMessage = 'Pseudo deja servi !!!';
        }
        else
        {
            this.createUser_suite(usernam, pass, pseud);
        }
      }, (error)=>{
        this.errorMessage = 'Une erreur s\'est produite';
      }
    );
    this.uploadImage(pseud);
  }

  createUser_suite(usernam: string, pass: string, pseud: string){
    let headers: any = new HttpHeaders({'content-type': 'application/json'});
    let options: any = {"key":"create", "username": usernam, "password": pass, "pseudo": pseud};
    let url: any = this.baseURI + "manage-user.php";

    this.http.post(url, JSON.stringify(options), headers).subscribe(
          (data: any) => {
                          this.navCtrl.setRoot(HomePage,{me: pseud});
                          this.authSrv.signIn(pseud);
                          this.sendNotification('BIENVENUE chez nous !!!');
          }, (error) => {
                          this.sendNotification('something went wrong !! \n Please, try Again');
         }
      );
  }

  sendNotification(msg: string){
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'bottom',
      duration: 4000
    });

    toast.present();
  }

  closeModal(){
    // this.viewCtrl.dismiss();
    this.navCtrl.setRoot(AuthPage);
  }

  openGallery(){
    console.log('Open Gallery');
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle errorMessage
    });
  }

  openCamera(){
    console.log('Open Camera');
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle errorMessage
    });
  }

  uploadImage(pseudo: string){
    let url = 'http://192.168.43.24/Ionic/manage-image.php';
    // let headers: any = new HttpHeaders({'content-type': 'application/json'});
    // let options:any = {"pseudo":pseudo};
    let postData = new FormData();
    postData.append('pseudo', pseudo);
    postData.append('file',this.base64Image);
    let data:Observable<any> = this.http.post(url,postData);
    data.subscribe((result)=>{
      console.log(result);
    });
  }

  AccessCamera(){
    this.camera.getPicture({
      targetWidth:512,
      targetHeight:512,
      correctOrientation:true,
      sourceType:this.camera.PictureSourceType.CAMERA,
      destinationType:this.camera.DestinationType.DATA_URL
    }).then((imageData)=>{
      this.base64Image='data:image/jpeg;base64,'+imageData;
      this.picture = imageData;
    }, (err)=>{
      console.log(err);
    });
  }

  AccessGallery(){
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType:this.camera.DestinationType.DATA_URL
    }).then((imageData)=>{
      this.base64Image='data:image/jpeg;base64,'+imageData;
      this.picture=imageData;
    },(err)=>{
      console.log(err);
    });
  }

}
