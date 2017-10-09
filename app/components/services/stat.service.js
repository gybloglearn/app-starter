define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get(sdate, edate) {
      var req = {
        method: 'GET',
        url: 'app/components/php/braidt.php?startdate=' + sdate + '&enddate=' + edate
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
