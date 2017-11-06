define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      getAll:getAll,
      post:post,
      put:put,
      erase:erase
    };

    return service;

    ///////////

    function get(start, end, mch) {
      var req = {
        method: 'GET',
        url: 'app/components/php/PottingSSO.php?startdate=' + start + '&enddate=' + end + '&machinename=' + mch
      };
      return $http(req);
    }
    function getAll() {
      var req = {
        method: 'GET',
        url: 'app/components/php/Pottinginfosave/allinfos'
      };
      return $http(req);
    }
    function post(data) {
      var req = {
        method: 'POST',
        url: 'app/components/php/Pottinginfosave/info/' + data.id,
        data: data
      };
      return $http(req);
    }
    function put(data) {
      var req = {
        method: 'PUT',
        url: 'app/components/php/Pottinginfosave/info/' + data.id,
        data: data
      };
      return $http(req);
    }
    function erase(id) {
      var request = {
        method: "DELETE",
        url: "app/components/php/Pottinginfosave/info/" + id
      };
      return $http(request);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
