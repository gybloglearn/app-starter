define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get(start, end, mch) {
      var req = {
        method: 'GET',
        url: 'app/components/php/PottingSSO.php?startdate=' + start + '&enddate=' + end + '&machinename=' + mch
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
