define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      getDays: getDays
    };

    return service;

    ///////////

    function get(st, pl, pu) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ROWIP.php?status=' + st + '&pl_id=' + pl + '&pu_id=' + pu
      };
      return $http(req);
    }
    function getDays(d) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/getWipData.php?d=' + d
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
