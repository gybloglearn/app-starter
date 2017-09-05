define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getpartnumber: getpartnumber,
      getmodul: getmodul,
      getmap:getmap
    };

    return service;

    ///////////

    function getpartnumber() {
      var req = {
        method: 'GET',
        url: '../modulapi/mods'
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
    function getmap(start, end, tank) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/MTF_BT.php?startdate=' + start + '&enddate=' + end + '&machineid=' + tank
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
