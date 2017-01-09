define([], function () {
  'use strict';

  function PottingService($http) {
    var service = {
      get: get,
      getdays: getdays
    };

    return service;

    ///////////

    function get(mch, datum) {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.15/getReports/pottingreport.php?mch=' + mch + '&startdate=' + datum
      };
      return $http(req);
    }

    function getdays(mch, kezdodatum, vegdatum) {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.15/getReports/pottingreport.php?mch=' + mch + '&startdate=' + kezdodatum + '&enddate' + vegdatum
      };
      return $http(req);
    }
  }
  PottingService.$inject = ['$http'];
  return PottingService;
});
