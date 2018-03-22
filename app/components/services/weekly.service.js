define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getpartnumber: getpartnumber,
      getsmfile: getsmfile,
      getsm: getsm
    };

    return service;

    ///////////
    function getpartnumber() {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.13/modulapi/mods'
      };
      return $http(req);
    }
    function getsmfile(date) {
			var d = new Date().getTime().toString().substr(-5);
      var req = {
        method: 'GET',
        url: 'app/components/PHP/sm/sm' + date + '.json' + '?' + d
      };
      return $http(req);
    }
    function getsm(start, end, mch) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW500_SM.php?startdate=' + start + '&enddate=' + end + '&report_id=' + mch
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
