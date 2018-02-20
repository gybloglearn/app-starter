define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      //getbundle: getbundle,
      getbundlefile:getbundlefile,
      getetf: getetf
    };

    return service;

    ///////////

    /*function getbundle(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Bundle_history_uf.php?startdate=' + start + '&enddate=' + end
      };
      return $http(req);
    }*/
    function getbundlefile(date) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Bundle/bundle' + date + '.json'
      };
      return $http(req);
    }
    function getetf(sdate, edate) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1500_ETF_Moduls.php?startdate=' + sdate + '&enddate=' + edate
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
