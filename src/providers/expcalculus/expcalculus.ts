import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ExpcalculusProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ExpcalculusProvider {

private frequency=40;

  constructor(public http: Http) {


    console.log('Hello ExpcalculusProvider Provider');

  }

  calculateexp(data) {

    var arr = {
      max: function(array) {
        return Math.max.apply(null, array);
      },

      min: function(array) {
        return Math.min.apply(null, array);
      },

      range: function(array) {
        return arr.max(array) - arr.min(array);
      },

      midrange: function(array) {
        return arr.range(array) / 2;
      },

      sum: function(array) {
        var num = 0;
        for (var i = 0, l = array.length; i < l; i++) num += array[i];
        return num;
      },

      mean: function(array) {
        return arr.sum(array) / array.length;
      },

      median: function(array) {
        array.sort(function(a, b) {
          return a - b;
        });
        var mid = array.length / 2;
        return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
      },

      modes: function(array) {
        if (!array.length) return [];
        var modeMap = {},
          maxCount = 0,
          modes = [];

        array.forEach(function(val) {
          if (!modeMap[val]) modeMap[val] = 1;
          else modeMap[val]++;

          if (modeMap[val] > maxCount) {
            modes = [val];
            maxCount = modeMap[val];
          }
          else if (modeMap[val] === maxCount) {
            modes.push(val);
            maxCount = modeMap[val];
          }
        });
        return modes;
      },

      variance: function(array) {
        var mean = arr.mean(array);
        return arr.mean(array.map(function(num) {
          return Math.pow(num - mean, 2);
        }));
      },

      standardDeviation: function(array) {
        return Math.sqrt(arr.variance(array));
      },

      meanAbsoluteDeviation: function(array) {
        var mean = arr.mean(array);
        return arr.mean(array.map(function(num) {
          return Math.abs(num - mean);
        }));
      },

      zScores: function(array) {
        var mean = arr.mean(array);
        var standardDeviation = arr.standardDeviation(array);
        return array.map(function(num) {
          return (num - mean) / standardDeviation;
        });
      }
    };

    let velox = 0;
    for (let i = 0; i < data.length; i++) {
      velox += data[i].speed;
    }
    velox = velox / (data.length);
    velox=this.convertToRange(velox,[0,70],[1,2]);

    let zacc = [];

    for (let i = 0; i < data.length; i++) {
      if(data[i].accelerometer[2]>=0)
      zacc.push(data[i].accelerometer[2]/velox);
      else
        zacc.push(Math.abs(data[i].accelerometer[2]/velox));

    }

    let time=data.length*this.frequency;

    let zscores=arr.zScores(zacc);
    alert(zacc);

    let exposure= this.numerical_int(this.frequency,zacc);
    alert(exposure/time);



  }

  numerical_int(dx, array) {

    let integral = 0;
    let n = array.length;
    for (let i = 1; i < n; i++) {
      let dy_init = array[i - 1];
      let dy_end = array[i];
      let darea = dx * (dy_init + dy_end) / 2.;
      integral = integral + darea;
    }
    return integral;

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

}
