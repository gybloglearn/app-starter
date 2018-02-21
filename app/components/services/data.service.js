define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      getchart:getchart,
      getArchive: getArchive,
      getsm: getsm,
      getdrynum:getdrynum,
      getdrying: getdrying
    };

    return service;

    ///////////

    function get(startd, num) {
      var req = {
        method: 'GET',
        url: 'app/components/php/PottingDashboard.php?startdate=' + startd + '&machinename=Potting3&phasename=' + num
      };
      return $http(req);
    }
    function getchart(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/php/PottingSSO.php?startdate=' + start + '&enddate=' + end + '&machinename=Potting3'
      };
      return $http(req);
    }
    function getArchive(dayhr) {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.13/file_reports/files/drying/Dryingnumbers_' + dayhr + '.json'
      };
      return $http(req);
    }
    function getsm(sm, date) {
      var req = {
        method: 'GET',
        url: '../getReports/smreport.php?mch=' + sm + '&startdate=' + date
      };
      return $http(req);
    }
    function getdrynum() {
      var req = {
        method: 'GET',
        url: '../Potting4Dashboard/app/components/php/Dryingnum/Drynumbers.json'
      };
      return $http(req);
    }
    function getdrying() {
      var req = {
        method: 'GET',
        url: 'app/components/php/Drying.php?mch=Drying2'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
