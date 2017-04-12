define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get(zw, ye) {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.15/getReports/downgrade.php?prl=' + zw + '&year=' + ye
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
