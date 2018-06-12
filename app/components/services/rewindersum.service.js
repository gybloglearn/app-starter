define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get(date) {
      var req = {
        method: 'GET',
        url: '..Braid/app/components/PHP/Rewinder/rewinder' + date + '.json'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
