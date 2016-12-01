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
        url: '//3.228.180.15/hpd/api/getSSOs'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
