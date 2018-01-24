define([], function () {
    'use strict';
    function changeDate() {
      return function (dt) {
        var datenum=0;
        var daynum=new Date(dt).getHours() * 60 + new Date(dt).getMinutes();
        if (daynum < 350) {
            datenum = new Date(dt).getTime() - (24 * 3600 * 1000);
          }
        else{
            datenum = new Date(dt).getTime();
          }
        return datenum;
      }
    }
    return changeDate;
  });