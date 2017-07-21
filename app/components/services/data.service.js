define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getpartnumber: getpartnumber,
      getsm: getsm,
      getpotting: getpotting,
      getmtf: getmtf,
      getgradebyd1000: getgradebyd1000,
      getgradebyd1500: getgradebyd1500
    };

    return service;

    ///////////

    function getpartnumber() {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.15/modulapi/mods'
      };
      return $http(req);
    }

    function getsm(start, end, mch) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW500_SM.php?startdate=' + start + '&enddate=' + end + '&report_id=' + mch
      };
      return $http(req);
    }

    function getpotting(start, end, mch) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW500_Potting.php?startdate=' + start + '&enddate=' + end + '&report_id=' + mch
      };
      return $http(req);
    }
    function getmtf(date) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/MTF/mtf' + date + '.json'
      };
      return $http(req);
    }
    function getgradebyd1000(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1000_GradebyDay.php?startdate=' + start + '&enddate=' + end
      };
      return $http(req);
    }
    function getgradebyd1500(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW1500_GradebyDay.php?startdate=' + start + '&enddate=' + end
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
