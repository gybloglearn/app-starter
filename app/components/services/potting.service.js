define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getpartnumber: getpartnumber,
      getpotting: getpotting,
      get: get,
      post: post,
      put: put
    };

    return service;

    ///////////

    function getpartnumber() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1000_moduls.json'
      };
      return $http(req);
    }

    function getpotting(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1000_Potting.php?startdate=' + start + '&enddate=' + end + '&filter=&phaseid=Centrifuge end'
      };
      return $http(req);
    }
    function get() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Pottinginfosave/info1000/11254878'
      };
      return $http(req);
    }
    function post(data) {
      var req = {
        method: 'POST',
        url: 'app/components/PHP/Pottinginfosave/info1000/' + data.id,
        data: data
      };
      return $http(req);
    }
    function put(data) {
      var req = {
        method: 'PUT',
        url: 'app/components/PHP/Pottinginfosave/info1000/' + data.id,
        data: data
      };
      return $http(req);
    }
    /*function erase(id) {
      var request = {
        method: "DELETE",
        url: "app/components/php/Pottinginfosave/info/" + id
      };
      return $http(request);
    }*/
  }
  Service.$inject = ['$http'];
  return Service;
});
