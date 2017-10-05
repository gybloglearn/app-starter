define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get(date,sm) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/smprod.php?startdate='+ date + '&mch='+ sm
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
