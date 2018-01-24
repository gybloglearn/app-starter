define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getbundle: getbundle,
      getetf: getetf
    };

    return service;

    ///////////

    function getbundle(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Bundle_history_uf.php?startdate=' + start + '&enddate=' + end
      };
      return $http(req);
    }
    function getetf(sdate, edate) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1500_Modul_History_ETF_uf.php?startdate=' + sdate + '&enddate=' + edate + '&phaseid=Grade Date'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
