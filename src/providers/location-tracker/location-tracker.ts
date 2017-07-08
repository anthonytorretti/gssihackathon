import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { LatLng, Polyline, PolylineOptions,MarkerOptions,Marker} from '@ionic-native/google-maps';
import { GooglesnapProvider } from '../../providers/googlesnap/googlesnap';
import { ExpcalculusProvider } from '../../providers/expcalculus/expcalculus';
import { GeojsonProvider } from '../../providers/geojson/geojson';

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
  public polylines=[];
  public roadstate="OK";
  public buttontext="Start Tracking";

  frequency=40;

  public geolocation = new Geolocation();
  public enable_reading=false;

  public watch: any;
  public lat: number = 42.356652;
  public lng: number = 13.386234;

  public latold: number = 0;
  public lngold: number = 0;


  public currentacceleration=[0,0,0];
  public accelerometerdata=[];
  public accelerationlimit=0.7;


  public distance: number = 0;
  public maxdistance: number = 100;


  public points = [];
  public mappoints =[];
  public speed:number =0;
  public minspeed:number=10;

  public data=[];

  public firststart:boolean = true;
  public restart:boolean= true;




  constructor(public zone: NgZone,private geojson: GeojsonProvider,private deviceMotion: DeviceMotion,private googlesnap: GooglesnapProvider,private expcalc: ExpcalculusProvider ) {
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
        this.updateroadstate(acceleration.z-9.81);
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

        this.updatemap();

        if(this.enable_reading) {
          let partialdistance = this.getdistance(this.lat, this.lng, this.latold, this.lngold, "MT");

          this.distance = this.distance + partialdistance;

          //IF TRACKING RESTARTED
          if (this.distance == 0 && this.restart) {

            this.pointiterator = 1;
            this.restart = false;
          }

          if (this.distance <= this.maxdistance) {

            this.mappoints.push({lat: this.lat, lng: this.lng});
            this.points.push([this.lat, this.lng]);
            this.updatemap();


          }

          //REACHED MAX DISTANCE FOR SEGMENT
          else {

            this.routeiterator += 1;
            this.map.clear();
            this.distance = 0;

            this.savedata();
            this.restart = true;
          }
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

    let markerOptions: MarkerOptions = {
      position: location,
      icon: { url : './assets/dot.png' }
    };

    let marker: Marker = this.map.addMarker(markerOptions);




    // this.map.addMarker({
    //   position: location,
    //   icon: { url : './assets/dot.png' }
    //   });
    //
    // this.map.marker

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



    for (let i=0;i<this.polylines.length;i++){
      let polyline: Polyline = this.map.addPolyline(this.polylines[i]);
    }


    if(this.speed==null)
      this.speed=0;

    let tempdata=this.data;
    this.data=[];

    let parameters="";
    for (let i=0;i<this.points.length;i++){

      if(i!=this.points.length-1) {

        parameters += this.points[i].toString() + "|";
      }
      else
        parameters+=this.points[i].toString();
    }

    let exposure=this.expcalc.calculateexp(tempdata);

    this.googlesnap.load(parameters)
      .then(data => {

          this.geojson.addtogeojson(data,exposure);

      });

    let colorline=this.RainBowColor(exposure);


    let polyoptions: PolylineOptions = {
      points:this.mappoints,
      geodesic: true,
      color: colorline,
      width: 20
    };

    let polyline: Polyline = this.map.addPolyline(polyoptions);

    this.polylines.push(polyoptions);



    // this.map.addPolyline({
    //   points:this.mappoints,
    //   geodesic: true,
    //   color: '#FF0000',
    //   width: 2
    // });

    let lastmappoint=this.mappoints[this.mappoints.length-1];
    this.mappoints=[];
    this.mappoints.push(lastmappoint);
    this.points=[];
  }

 RainBowColor(length)

{

  let value=this.convertToRange(length,[0,3],[0,1]);


  var i = (value * 255 / 255);
  var r = Math.abs(Math.round(Math.cos(90 -(90*i) )*255));
  var g = Math.abs(Math.round(Math.sin(90 -(90*i) )*255));
  var b = 0;

  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

  convertToRange(value, srcRange, dstRange){
    // value is outside source range return
    if (value < srcRange[0] || value > srcRange[1]){
      return NaN;
    }

    let srcMax = srcRange[1] - srcRange[0],
      dstMax = dstRange[1] - dstRange[0],
      adjValue = value - srcRange[0];

    return (adjValue * dstMax / srcMax) + dstRange[0];

  }

  updateroadstate(acceleration){


    if (acceleration<this.accelerationlimit){
      this.roadstate="OK";
    }

    else if (acceleration>this.accelerationlimit){
      this.roadstate="Attenzione";
    }
}

  toggletrack(map){
    if(this.enable_reading){
      this.stopTracking();
      this.buttontext="Start Tracking";
    }
    else {
      this.startTracking(map)
      this.buttontext = "Stop Tracking";
    }
  }
}
