define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      getpartnumber: getpartnumber
    };

    return service;

    ///////////

    function get(id) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/zw.modul.data.php?id=' + id
      };
      return $http(req);
    }
    function getpartnumber() {
      var req = {
        method: 'GET',
        url: '../modulapi/mods'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
