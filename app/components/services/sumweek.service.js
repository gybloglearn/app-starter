define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get(date) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/sm/sm' + date + '.json'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
