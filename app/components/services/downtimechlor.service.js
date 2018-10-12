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
        url: 'app/components/PHP/Pottinginfosave/clorinationinfo/11454878'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
