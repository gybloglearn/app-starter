define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getpds: getpds
    };

    return service;

    ///////////

    function getpds() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/File/forchlor.json'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
