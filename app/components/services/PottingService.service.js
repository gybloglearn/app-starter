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
        url: 'app/components/php/ZW500_Potting.php?startdate=' + datum + '&report_id=' + mch
      };
      return $http(req);
    }

    function getdays(mch, kezdodatum, vegdatum) {
      var req = {
        method: 'GET',
        url: 'app/components/php/ZW500_Potting.php?startdate=' + kezdodatum + '&enddate=' + vegdatum + '&report_id=' + mch
      };
      return $http(req);
    }
  }
  PottingService.$inject = ['$http'];
  return PottingService;
});
