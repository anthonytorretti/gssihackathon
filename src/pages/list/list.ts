import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { ModalController } from 'ionic-angular';
import { ModalPage } from '../modal/modal';
import { CameraProvider } from '../../providers/camera/camera';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {


  constructor(public camera: CameraProvider,public navCtrl: NavController,private modalCtrl:ModalController,public navParams: NavParams,public locationTracker: LocationTrackerProvider) {

  }

  openModal(data) {
    let obj = {data: data};
      let myModal = this.modalCtrl.create(ModalPage,obj);
    myModal.present();
  }


}
