define([], function () {
    'use strict';
    function week() {
      return function (dt) {
        var firstdayyear = new Date(dt).getFullYear() + "-01-01";
        var firstdaynum = new Date(firstdayyear).getDay();
  
        if (firstdaynum == 0) {
          firstdaynum = 7;
        }
        var weeknum = 0;
  
        if (firstdaynum < 5) {
          weeknum++;
        }
  
        var daydiff = (new Date(dt).getTime() - new Date(firstdayyear).getTime()) / (24 * 3600 * 1000);
        if (daydiff % 7 == 0) {
          weeknum += daydiff / 7;
        }
        else {
          weeknum += Math.floor(daydiff / 7);
          var pieceday = daydiff - (Math.floor(daydiff / 7) * 7);
          if (pieceday + firstdaynum > 7) {
            weeknum++;
          }
        }
        if (weeknum < 10) {
          weeknum = "0" + weeknum;
        }
        else {
          weeknum.toString();
        }
        if (weeknum == 0) {
          weeknum = 52;
        }
        return weeknum;
      }
    }
    return week;
  });