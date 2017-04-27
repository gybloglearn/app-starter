define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getAll: getAll,
      post: post,
      put: put,
      erase: erase
    };

    return service;

    ///////////
    function getAll() {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.15/'
      };
      return $http(req);
    }
    function post(data) {
      var req = {
        method: 'POST',
        url: 'http://3.228.180.15/' + data.id,
        data: data
      };
      return $http(req);
    }
    function put(data) {
      var req = {
        method: 'PUT',
        url: 'http://3.228.180.15/' + data.id,
        data: data
      };
      return $http(req);
    }
    function erase(id) {
      var request = {
        method: "DELETE",
        url: "http://3.228.180.15/" + id
      };
      return $http(request);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});