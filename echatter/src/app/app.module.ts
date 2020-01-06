import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {HttpClientModule} from "@angular/common/http";
import { SocialSharing } from '@ionic-native/social-sharing';
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {AuthPage} from "../pages/auth/auth";
import { AddAccountPage } from '../pages/add-account/add-account';
import { MessagePage } from '../pages/message/message';
import { FriendsService } from '../service/friends.service';
import { MessageService } from '../service/message.service';
import { AuthService } from '../service/auth.service';
import { Camera } from '@ionic-native/camera';
import { RequestPage } from '../pages/request/request';
import { CallComponent } from '../components/call/call';
import { SmsComponent } from '../components/sms/sms';
import { AproposPage } from '../pages/apropos/apropos';
import { MoiPage } from '../pages/moi/moi';
import { NoticePage } from '../pages/notice/notice';
import { ChangeProfilComponent } from '../components/change-profil/change-profil';
import { ProfilViewPage } from '../pages/profil-view/profil-view';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AuthPage,
    AddAccountPage,
    MessagePage,
    RequestPage,
    AproposPage,
    MoiPage,
    CallComponent,
    SmsComponent,
    NoticePage,
    ChangeProfilComponent,
    ProfilViewPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AuthPage,
    AddAccountPage,
    MessagePage,
    RequestPage,
    AproposPage,
    MoiPage,
    CallComponent,
    SmsComponent,
    NoticePage,
    ChangeProfilComponent,
    ProfilViewPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FriendsService,
    MessageService,
    AuthService,
    Camera,
    SocialSharing,
    SMS,
    CallNumber
  ]
})
export class AppModule {}
