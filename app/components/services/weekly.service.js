define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get(start,end,mch) {
      var req = {
        method: 'GET',
        url: 'app/components/php/sumsm.php?startdate=' + start + '&enddate=' + end + '&mch=' + mch
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
