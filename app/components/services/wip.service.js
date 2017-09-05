define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
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
  }
  Service.$inject = ['$http'];
  return Service;
});
