define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      erase: erase
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
    function erase(id) {
      var request = {
        method: "DELETE",
        url: "app/components/PHP/Pottinginfosave/clorinationinfo/" + id
      };
      return $http(request);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
