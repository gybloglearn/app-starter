define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getAll: getAll,
      get: get,
      post: post
    };

    return service;

    ///////////
    function getAll() {
      var req = {
        method: 'GET',
        url: '//3.228.180.15/ticketapi/tasks'
      };
      return $http(req);
    }
    function get(id) {
      var req = {
        method: 'GET',
        url: '//3.228.180.15/ticketapi/task/' + id
      };
      return $http(req);
    }
    function post(data) {
      var req = {
        method: 'POST',
        url: '//3.228.180.15/ticketapi/task/' + data.id,
        data:data,
        header: {"Content-Type":"aplication/json"}
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
