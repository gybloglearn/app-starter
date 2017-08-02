define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getshift: getshift,
      getAllshift: getAllshift,
      getAlltmk: getAlltmk,
      getAlltype:getAlltype,
      postshift: postshift,
      posttmk: posttmk,
      eraseshift:eraseshift,
      erasetmk:erasetmk
    };

    return service;

    ///////////

    function getshift(datum) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/shift/' + datum
      };
      return $http(req);
    }
    function getAllshift() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/allshift/'
      };
      return $http(req);
    }
    function getAlltmk() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/alltmk/'
      };
      return $http(req);
    }
    function getAlltype() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/alltype/'
      };
      return $http(req);
    }
    function postshift(data) {
      var req = {
        method: 'POST',
        url: 'app/components/PHP/shift/' + data.id,
        data: data
      };
      return $http(req);
    }
    function posttmk(data) {
      var req = {
        method: 'POST',
        url: 'app/components/PHP/tmk/' + data.id,
        data: data
      };
      return $http(req);
    }
    function eraseshift(id) {
      var request = {
        method: "DELETE",
        url: "app/components/PHP/shift/" + id
      };
      return $http(request);
    }
    function erasetmk(id) {
      var request = {
        method: "DELETE",
        url: "app/components/PHP/tmk/" + id
      };
      return $http(request);
    }

  }
  Service.$inject = ['$http'];
  return Service;
});
