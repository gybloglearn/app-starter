define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get(day) {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.15/getReports/mtfreport.php?startdate='+ day
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
