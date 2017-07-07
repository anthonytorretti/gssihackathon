import { Component} from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker} from '@ionic-native/google-maps';
import { CameraProvider} from '../../providers/camera/camera';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map:GoogleMap;
  constructor(public navCtrl: NavController,private camera:CameraProvider, private googlemaps: GoogleMaps, public locationTracker: LocationTrackerProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Maps');
    setTimeout(() => {
      this.loadMap();
    }, 1000)
  }

  start(){
    this.locationTracker.startTracking(this.map);
  }

  stop(){
    this.locationTracker.stopTracking();
  }

  segnala(){
    let lat=this.locationTracker.lat;
    let lng=this.locationTracker.lng;
    this.camera.takephoto(lat,lng);
  }


  loadMap(){

    let element: HTMLElement = document.getElementById('map');

    this.map = this.googlemaps.create(element);



    this.map.one(GoogleMapsEvent.MAP_READY).then(
      () => {

        let ionic: LatLng = new LatLng(this.locationTracker.lat,this.locationTracker.lng);

        // create CameraPosition
        let position: CameraPosition = {
          target: ionic,
          zoom: 14,
          tilt: 30
        };

        this.map.moveCamera(position);
        // Now you can add elements to the map like the marker
      }
    );



 }
}
