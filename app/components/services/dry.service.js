define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      getArchive: getArchive
    };

    return service;

    ///////////

    function get(dry) {
      var req = {
        method: 'GET',
        url: 'app/components/php/Drying.php?mch=' + dry
      };
      return $http(req);
    }

    function getArchive(dayhr){
      var req = {
        method: 'GET',
        url: 'http://3.228.180.13/file_reports/files/drying/Dryingnumbers_' + dayhr + '.json'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
