define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      post: post
    };

    return service;

    ///////////

    function get(mod) {
      var req = {
        method: 'GET',
        url: '../History_Plan/' + mod,
      };
      return $http(req);
    }
    function post(data) {
      var req = {
        method: 'POST',
        url: '../History_Plan/plan/' + data.id,
        data: data,
        headers: { "Content-Type": "application/json" }
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
