import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
/**
 * Generated class for the LetturePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-letture',
  templateUrl: 'letture.html',
})
export class LetturePage {

  public data;
  constructor(public navCtrl: NavController, public navParams: NavParams,public locationTracker: LocationTrackerProvider) {
 this.data=locationTracker.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LetturePage');
  }

}
