define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getsl: getsl,
      getdowntime: getdowntime
    };

    return service;

    ///////////

    function getsl(start, end, cat) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW500_SL.php?startdate=' + start + '&enddate=' + end + '&cat=Day'
      };
      return $http(req);
    }
    function getdowntime(start, end) {
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
