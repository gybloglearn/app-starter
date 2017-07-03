define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      getmulti: getmulti
    };

    return service;

    ///////////

    function get(start) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/CL4.php?startdate=' + start
      };
      return $http(req);
    }
    function getmulti(startd, endd) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/CL4.php?startdate=' + startd + '&enddate=' + endd
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
