define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      getweek: getweek
    };

    return service;

    ///////////

    function get(datum) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/history.php?day=' + datum
      };
      return $http(req);
    }

    function getweek(datum) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/history.php?weekly&day=' + datum
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
