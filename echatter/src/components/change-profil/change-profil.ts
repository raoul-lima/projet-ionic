import { Component } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../service/auth.service';
import { NavController, ViewController } from 'ionic-angular';

@Component({
  selector: 'change-profil',
  templateUrl: 'change-profil.html'
})
export class ChangeProfilComponent {
  base64Image:any;
  picture: any;
  me: string;
  constructor(private camera: Camera, private http: HttpClient, private authSrv: AuthService, public navCtrl: NavController,
    public viewCtrl: ViewController) {
    this.me = this.authSrv.me;
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
      this.uploadImage(this.me);
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
      this.uploadImage(this.me);
    },(err)=>{
      console.log(err);
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
      this.viewCtrl.dismiss(result);
    });
  }

}
