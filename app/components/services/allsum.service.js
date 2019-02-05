define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getpartnumber: getpartnumber,
      get:get,
      getsheet: getsheet
    };

    return service;

    ///////////

    function getpartnumber() {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.13/modulapi/mods'
      };
      return $http(req);
    }
    function get(date,sm) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/smprod.php?startdate='+ date + '&mch='+ sm
      };
      return $http(req);
    }
    function getsheet(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Smtable.php?startdate=' + start + '&enddate=' + end
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
