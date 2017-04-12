define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get
    };

    return service;

    ///////////

    function get(day, year) {
      var y = year?year+'/':'';
      var req = {
        method: 'GET',
        url: 'http://3.228.180.15/getReports/files/' + y + 'mtf_'+day+'05.json'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});