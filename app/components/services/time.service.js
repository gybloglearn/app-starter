define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get(dt) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/dayfiles/sm' + dt + '.json'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
