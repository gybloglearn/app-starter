define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getpartnumber: getpartnumber
    };

    return service;

    ///////////

    function getpartnumber() {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.15/modulapi/mods'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
