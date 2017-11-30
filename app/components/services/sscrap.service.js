define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getsheet: getsheet,
      getscrap: getscrap
    };

    return service;

    ///////////

    function getsheet(start, end, mch) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW500_SM.php?startdate=' + start + '&enddate=' + end + '&report_id=' + mch
      };
      return $http(req);
    }
    function getscrap(st,ed) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/sm.scraps.php?startdate=' + st + '&enddate=' + ed
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
