define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get(sm,date) {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.15/getReports/smreport.php?mch='+ sm + '&startdate='+ date
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
