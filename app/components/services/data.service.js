define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getpartnumber: getpartnumber,
      getsm: getsm,
      getpotting: getpotting
    };

    return service;

    ///////////

    function getpartnumber() {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.15/modulapi/mods'
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

    function getpotting(start, end, mch) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW500_Potting.php?startdate=' + start + '&enddate=' + end + '&report_id=' + mch
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
