define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getpartnumber: getpartnumber,
      get: get,
      getrework: getrework
    };

    return service;

    ///////////

    function getpartnumber() {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.13/modulapi/mods'
        //url: '../modulapi/mods'
      };
      return $http(req);
    }
    function get(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/mtf_table.php?startdate=' + start + '&enddate=' + end
      };
      return $http(req);
    }
    function getrework(startdate, enddate) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/BP_Rework.php?startdate=' + startdate + '&enddate=' + enddate
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
