define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
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
