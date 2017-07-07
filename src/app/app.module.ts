import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ModalPage} from '../pages/modal/modal';
import { LetturePage } from '../pages/letture/letture';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps} from '@ionic-native/google-maps';
import { DeviceMotion } from '@ionic-native/device-motion';
import { File } from '@ionic-native/file';
import {Camera} from '@ionic-native/camera';
import { CameraProvider } from '../providers/camera/camera';
import { GooglesnapProvider } from '../providers/googlesnap/googlesnap';
import { ExpcalculusProvider } from '../providers/expcalculus/expcalculus';
import { GeojsonProvider } from '../providers/geojson/geojson';




@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ModalPage,
    LetturePage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ModalPage,
    LetturePage
  ],
  providers: [
    GooglesnapProvider,
    Camera,
    CameraProvider,
    File,
    DeviceMotion,
    GoogleMaps,
    LocationTrackerProvider,
    BackgroundGeolocation,
    Geolocation,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ExpcalculusProvider,
    GeojsonProvider,



  ]
})
export class AppModule {}
