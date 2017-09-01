define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      getsm: getsm,
      getdrynum:getdrynum,
      getdrying: getdrying
    };

    return service;

    ///////////

    function get(startd, num) {
      var req = {
        method: 'GET',
        url: 'app/components/php/PottingDashboard.php?startdate=' + startd + '&machinename=Potting4&phasename=' + num
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
    function getdrynum() {
      var req = {
        method: 'GET',
        url: 'app/components/php/Dryingnum/Drynumbers.json'
      };
      return $http(req);
    }
    function getdrying() {
      var req = {
        method: 'GET',
        url: 'app/components/php/Drying.php?mch=Drying3'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
