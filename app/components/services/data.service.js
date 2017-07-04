define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      getdrying: getdrying
    };

    return service;

    ///////////

<<<<<<< HEAD
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
=======
    function get(startd,num) {
      var req = {
        method: 'GET',
        url: 'app/components/php/PottingDashboard.php?startdate=' + startd + '&machinename=Potting4&phasename=' + num
>>>>>>> 6b0d1e020a01cb7d87a7ffbe01e3770271a6d60f
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
