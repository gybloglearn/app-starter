define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      getsm: getsm
    };

    return service;

    ///////////

    function get(startd, pot, num) {
      var req = {
        method: 'GET',
        url: 'app/components/php/PottingDashboard.php?startdate=' + startd + '&machinename=' + pot + '&phasename=' + num
      };
      return $http(req);
    }
    function getsm(sm, date) {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.15/getReports/smreport.php?mch=' + sm + '&startdate=' + date
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
