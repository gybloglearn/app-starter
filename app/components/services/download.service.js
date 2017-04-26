define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get(start, end, typ, category) {
      var req = {
        method: 'GET',
        url: '../../../../getReports/ZW1000Scrap.php?startdate=' + start + '&enddate=' + end + '&datetype=' + typ + '&cat=' + category
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
