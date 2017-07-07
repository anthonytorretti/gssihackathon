import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { LatLng} from '@ionic-native/google-maps';
import { GooglesnapProvider } from '../../providers/googlesnap/googlesnap';
import { ExpcalculusProvider } from '../../providers/expcalculus/expcalculus';
import { } from '../../providers/geo'

/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class LocationTrackerProvider {

  public routeiterator=1;
  public pointiterator=1;
  public map;
  public accelerometer;

  frequency=40;

  public geolocation = new Geolocation();
  public enable_reading=false;

  public watch: any;
  public lat: number = 42.356652;
  public lng: number = 13.386234;

  public latold: number = 0;
  public lngold: number = 0;


  public currentacceleration=[];
  public accelerometerdata=[];
  public accelerationlimit=3;


  public distance: number = 0;
  public maxdistance: number = 100;


  public points = [];
  public speed:number =0;

  public data=[];

  public firststart:boolean = true;
  public restart:boolean= true;

  public file;
public fullstring="";

  constructor(public zone: NgZone,private deviceMotion: DeviceMotion,private googlesnap: GooglesnapProvider,private expcalc: ExpcalculusProvider ) {
    console.log('Hello LocationTrackerProvider Provider');
  }

    startTracking(map) {

    this.map=map;
    this.firststart=true;


    this.accelerometer = this.deviceMotion.watchAcceleration({frequency:this.frequency}).subscribe((acceleration: DeviceMotionAccelerationData) => {
      if(this.enable_reading) {
        this.currentacceleration = [acceleration.x, acceleration.y, acceleration.z-9.81];
        this.accelerometerdata.push(this.currentacceleration);
        this.pointiterator += 1;
        this.addreading();
      }
    });

    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {



      console.log(position);

      // Run update inside of Angular's zone
      this.zone.run(() => {

        if (this.firststart==true) {
          this.startreading();
          this.latold = position.coords.latitude;
          this.lngold = position.coords.longitude;
          this.lat = this.latold;
          this.lng = this.lngold;
          this.speed =position.coords.speed;
          this.firststart = false;
        }

        else{
          this.latold = this.lat;
          this.lngold = this.lng;
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.speed =position.coords.speed;
        }


        let partialdistance= this.getdistance(this.lat, this.lng,this.latold,this.lngold,"MT");

        this.distance=this.distance+partialdistance;

        //IF TRACKING RESTARTED
        if(this.distance==0 && this.restart){

          this.pointiterator=1;
          this.restart=false;
        }

        if(this.distance<=this.maxdistance){
          if(partialdistance<5) {
            this.points.push([this.lat, this.lng]);
            this.updatemap();
          }

        }

        //REACHED MAX DISTANCE FOR SEGMENT
        else{

          this.routeiterator+=1;
          this.map.clear();
          this.distance=0;

          this.savedata();
          this.restart=true;
        }
      });

    });

  }

  stopTracking() {


    this.stopreading();

    this.distance=0;

    this.watch.unsubscribe();

    this.firststart=true;
    this.map.clear();

    this.savedata();

  }

  getdistance(lat1, lon1, lat2, lon2, unit) {
      var radlat1 = Math.PI * lat1/180
      var radlat2 = Math.PI * lat2/180
      var theta = lon1-lon2
      var radtheta = Math.PI * theta/180
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist)
      dist = dist * 180/Math.PI
      dist = dist * 60 * 1.1515
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      if (unit=="MT") { dist = dist * 1.609344 *1000}
      return dist
}

  updatemap() { // To Add Marker
    let location: LatLng = new LatLng(this.lat,this.lng);

    this.map.setCenter(location);
    this.map.setZoom(18);
    this.map.addMarker({
      position: location,
      icon: { url : './assets/dot.png' }
      });

  }

  startreading(){
    this.enable_reading=true;
  }

  stopreading(){
    this.enable_reading=false;
  }

  addreading(){



    var reading = {
      tratta:this.routeiterator,
      point:this.pointiterator,
      lat:this.lat,
      lng:this.lng,
      accelerometer:this.currentacceleration,
      speed:this.speed
    };

    this.data.push(reading);

  }

  savedata(){
    if(this.speed==null)
      this.speed=0;

    let tempdata=this.data;
    this.data=[];

    let parameters="";
    for (var i=0;i<this.points.length;i++){

      if(i!=this.points.length-1) {

        parameters += this.points[i].toString() + "|";
      }
      else
        parameters+=this.points[i].toString();
    }

    this.expcalc.calculateexp(tempdata);

    this.googlesnap.load(parameters)
      .then(data => {


      });
    this.points=[];
  }


}