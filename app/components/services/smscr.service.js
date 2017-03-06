define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      getbtw: getbtw,
      getprod: getprod
    };

    return service;

    ///////////

    function get(stdate) {
      var req = {
        method: 'GET',
        url: '//3.228.180.15/getReports/sm.scraps.php?startdate=' + stdate
      };
      return $http(req);
    }
    function getbtw(stdate, enddate) {
      var req = {
        method: 'GET',
        url: '//3.228.180.15/getReports/sm.scraps.php?startdate=' + stdate + '&enddate=' + enddate
      };
      return $http(req);
    }
    function getprod(mch,stdate, enddate) {
      var req = {
        method: 'GET',
        url: '//3.228.180.15/getReports/smreport.1.php?mch=' + mch + '&startdate=' + stdate + '&enddate=' + enddate
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
