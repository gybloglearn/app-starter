define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get(dry) {
      var req = {
        method: 'GET',
        url: 'app/components/php/Drying.php?mch=' + dry
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
