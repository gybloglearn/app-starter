define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get(startdate, enddate) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/BP_Rework.php?startdate='+ startdate + '&enddate=' + enddate
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
