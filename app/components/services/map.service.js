define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      getpartnumber: getpartnumber
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

    function get(start, end, tank) {
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
