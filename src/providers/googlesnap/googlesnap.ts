import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the GooglesnapProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GooglesnapProvider {
  public retry=0;
  public data=null;
  public apikey="AIzaSyCtroxu5U6vJvGehJxOHVtb1NXXl0xyrbU";
  public parameters="";
  public dataurl="";

  constructor(public http: Http) {
    console.log('Hello GooglesnapProvider Provider');
  }


  load(parameters) {

    this.dataurl="https://roads.googleapis.com/v1/snapToRoads?path="+parameters+"&interpolate=true&key="+this.apikey;
    //this.dataurl="https://roads.googleapis.com/v1/snapToRoads?path=-35.27801,149.12958|-35.28032,149.12907|-35.28099,149.12929|-35.28144,149.12984|-35.28194,149.13003|-35.28282,149.12956|-35.28302,149.12881|-35.28473,149.12836&interpolate=true&key="+this.apikey;
    //alert(this.dataurl);

    return new Promise(resolve => {
      this.http.get(this.dataurl)
        .map(res => res.json())
        .subscribe(data => {
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference
            this.data = data;
            console.log(data);
            //alert(data.snappedPoints[0].placeId);
          this.retry=0;
            resolve(this.data);


          },
          error => {
          if(this.retry<4) {
            this.retry += 1;
            this.load(parameters);
          }
          else {
            this.retry=0;


            console.log(JSON.stringify(error.json()));
          }
          }
        );

    });
  }


}
