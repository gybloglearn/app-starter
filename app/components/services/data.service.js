define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      getsm: getsm,
      getdrying: getdrying
    };

    return service;

    ///////////

    function get(startd, num) {
      var req = {
        method: 'GET',
        url: 'app/components/php/PottingDashboard.php?startdate=' + startd + '&machinename=Potting3&phasename=' + num
      };
      return $http(req);
    }
    function getsm(sm, date) {
      var req = {
        method: 'GET',
        url: '../getReports/smreport.php?mch=' + sm + '&startdate=' + date
      };
      return $http(req);
    }
    function getdrying() {
      var req = {
        method: 'GET',
        url: 'app/components/php/Drying.php?mch=Drying2'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
