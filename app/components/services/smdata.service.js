define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get(date,sm) {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.15/getReports/sm.php?startdate='+ date + '&mch='+ sm
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
