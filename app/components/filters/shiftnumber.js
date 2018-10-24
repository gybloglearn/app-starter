define([], function () {
  'use strict';
  function shiftnumber() {
    return function (dt) {
      var shiftnum = 0;
      var daynum = new Date(dt).getHours() * 60 + new Date(dt).getMinutes();
      if (350 <= daynum && daynum < 1070) {
        shiftnum = 1;
      }
      else {
        shiftnum = 3;
      }
      return shiftnum;
    }
  }
  return shiftnumber;
});