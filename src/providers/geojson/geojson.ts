import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import Geotool from 'geojson-tools';
import { File } from '@ionic-native/file';
/*
  Generated class for the GeojsonProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GeojsonProvider {
  public fileswritten=0;
  public alldata=[];

  constructor(public http: Http,public file:File) {
    console.log('Hello GeojsonProvider Provider');


  }

  addtogeojson(puntigoogle,exposure){

    let placeid= puntigoogle.snappedPoints[0].placeId;

    let punti=[];
    for(let i=0;i<puntigoogle.snappedPoints.length;i++)
    {
     punti.push([puntigoogle.snappedPoints[i].location.latitude,puntigoogle.snappedPoints[i].location.longitude]);
    }

    var georow = {
      type:"Feature",
      geometry: Geotool.toGeoJSON(punti,'linestring'),
      properties:{
        placeid:placeid,
        exposure:exposure,
      }
    };


    this.alldata.push(georow);
    let jsonstring=JSON.stringify(georow) + ",";

    this.file.createFile(this.file.externalDataDirectory, 'data.txt', false);
    this.file.writeFile(this.file.externalDataDirectory,'data.txt',jsonstring,{append: true, replace: false})
    this.fileswritten+=1;

  }




}
