define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      getplan: getplan
    };

    return service;

    ///////////

   function get(date) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Rewinder/rewinder' + date + '.json'
      };
      return $http(req);
    }
    
    function getplan() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/planapi/allplans'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
