define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Pottinginfosave/positions/11223344'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
