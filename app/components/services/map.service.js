define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

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
