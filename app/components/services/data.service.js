define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
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
  }
  Service.$inject = ['$http'];
  return Service;
});
