define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getpartnumber: getpartnumber,
      getmodul: getmodul
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
    function getmodul(date, id) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ModulHistory.php?startdate=' + date + '&modulid=' + id
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
