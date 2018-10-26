define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get(start,end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1000_PDT_Fluxus.php?startdate=' + start + '&enddate=' + end + '&partnumber='
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
