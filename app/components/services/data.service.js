define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      getplan: getplan
    };

    return service;

    ///////////

    function get() {
      var req = {
        method: 'GET',
        url: ''
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
