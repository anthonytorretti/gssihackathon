import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { CameraProvider} from '../../providers/camera/camera';
import { ModalController } from 'ionic-angular';
import { ModalPage } from '../modal/modal';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {


  constructor(public navCtrl: NavController,private modalCtrl:ModalController, private camera:CameraProvider,public navParams: NavParams,public locationTracker: LocationTrackerProvider) {

  }

  openModal(data) {
    let obj = {data: data};
      let myModal = this.modalCtrl.create(ModalPage,obj);
    myModal.present();
  }


}
