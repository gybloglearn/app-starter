define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get() {
      var req = {
        method: 'GET',
        url: '//url//'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
