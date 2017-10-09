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
        url: 'app/components/php/Braidt_Plan/allplans'
      };
      return $http(req);
    }
    function post(data) {
      var req = {
        method: 'POST',
        url: 'app/components/php/Braidt_Plan/plan/' + data.id,
        data: data
      };
      return $http(req);
    }
    function put(data) {
      var req = {
        method: 'PUT',
        url: 'app/components/php/Braidt_Plan/plan/' + data.id,
        data: data
      };
      return $http(req);
    }
    function erase(id) {
      var request = {
        method: "DELETE",
        url: "app/components/php/Braidt_Plan/plan/" + id
      };
      return $http(request);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
