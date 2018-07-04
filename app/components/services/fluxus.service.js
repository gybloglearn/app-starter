define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getpartnumber: getpartnumber,
      getetf: getetf
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
    function getetf(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1000_ETF_Moduls.php?startdate=' + start + '&enddate=' + end + '&filter=&phaseid=BP end'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
