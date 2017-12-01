define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      gettoday: gettoday,
      getoldday:getoldday
    };

    return service;

    ///////////

    function gettoday(linktoday) {
      var req = {
        method: 'GET',
        //url: 'http://3.228.180.15/getReports/files/mtf_'+ linktoday+'.json'
				url: 'http://3.228.180.13/file_reports/files/mtf/mtf_' + linktoday + '.json'
      };
      return $http(req);
    }

    function getoldday(linkoldday) {
      var req = {
        method: 'GET',
        //url: 'http://3.228.180.15/getReports/files/mtf_'+ linkoldday +'05.json'
				url: 'http://3.228.180.13/file_reports/files/mtf/mtf_' + linkoldday + '05.json'
      };
      return $http(req);
    }
  }
 Service.$inject = ['$http'];
  return Service;
});
