define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
			getToday: getToday,
      ppget: ppget
    };

    return service;

    ///////////

    function ppget(from){
      var req={
        method:'GET',
        url:'//3.228.180.15/getReports/pp.php?from=' + from
      };
      return $http(req);
    }
    function get(stdate,enddate,mch) {
      var req = {
        method: 'GET',
        url: '//3.228.180.15/getReports/bp.php?startdate=' + stdate + '&enddate=' + enddate + '&mch=' + mch
      };
      return $http(req);
    }
    function getToday(stdate,mch) {
      var req = {
        method: 'GET',
        url: '//3.228.180.15/getReports/bp.php?startdate=' + stdate + '&mch=' + mch
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
