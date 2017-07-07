import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';

/*
  Generated class for the CameraProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CameraProvider {

  public data=[];

  constructor(public camera: Camera) {
    console.log('Hello CameraProvider Provider');

  }

  takephoto(lat,lng){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      let date = new Date().toISOString();
      this.data.push([base64Image,lat,lng,date]);
    }, (err) => {
      // Handle error
    });

  }



}
