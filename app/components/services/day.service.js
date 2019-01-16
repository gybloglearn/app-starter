define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      getplan: getplan
    };

    return service;

    ///////////

    function get(day) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/rewinder_01.php?startdate=' + day
      };
      return $http(req);
    }
    function getplan() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/planapi/allplans'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
