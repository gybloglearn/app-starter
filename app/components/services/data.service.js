define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      getplan: getplan
    };

    return service;

    ///////////

    function get(sm, date) {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.15/getReports/smreport.php?mch=' + sm + '&startdate=' + date
      };
      return $http(req);
    }
    function getplan(id, datum) {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.15/planapi/plan/' + id + '/' + datum
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
