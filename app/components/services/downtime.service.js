define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/SPL36Downtime.php?startdate=' + start + '&enddate=' + end
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
