define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getpartnumber: getpartnumber,
      getAll:getAll,
      post:post,
      put:put
    };

    return service;

    ///////////
    function getpartnumber() {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.15/modulapi/mods'
      };
      return $http(req);
    }
    function getAll() {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.15'
      };
      return $http(req);
    }
    function post(data) {
      var req = {
        method: 'POST',
        url: 'http://3.228.180.15',
        data:data,
        headers: {"Content-Type":"/json"}
      };
      return $http(req);
    }
    function put(data) {
      var req = {
        method: 'PUT',
        url: 'http://3.228.180.15',
        data:data,
        headers: {"Content-Type":"/json"}
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
