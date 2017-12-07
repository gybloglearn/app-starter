define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getmodul: getmodul
    };

    return service;

    ///////////

    function getmodul(date, id, phase) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1000_Modulhistory.php?startdate=' + date + '&filter=' + id + '&phaseid=' + phase
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
