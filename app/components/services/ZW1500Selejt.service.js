define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get(startdat,enddat,categ) {
      var req = {
        method: 'GET',
        url: 'app/components/php/ZW1500FGScrapData.php?startdate=' + startdat + '&enddate=' + enddat + '&cat=' + categ
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
