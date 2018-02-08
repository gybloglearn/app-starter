define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getpartnumber: getpartnumber,
      getsl: getsl,
      getsm: getsm,
      getsoesm: getsoesm,
      getpotting: getpotting,
      getmtf: getmtf,
      gettodaymtf: gettodaymtf,
      getgradebyd1000: getgradebyd1000,
      getgradebyd1500: getgradebyd1500,
      getsapdata: getsapdata,
      getsmtable: getsmtable,
      getpottingtable: getpottingtable,
      getmtftable: getmtftable,
      getrework: getrework
    };

    return service;

    ///////////

    function getsapdata() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/sapdata.php'
      };
      return $http(req);
    }
    function getpartnumber() {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.13/modulapi/mods'
      };
      return $http(req);
    }

    function getsl(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW500_SL.php?startdate=' + start + '&enddate=' + end + '&cat=Day'
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
    function getsoesm(date, sm) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/sumsm.php?startdate=' + date + '&mch=' + sm
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
    /*function getmtf(date) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/MTF/mtf' + date + '.json'
      };
      return $http(req);
    }*/
    function getmtf(date) {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.13/uf/app/components/PHP/MTF/mtf' + date + '.json'
      };
      return $http(req);
    }
    function gettodaymtf(date) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/ZW500_MTF_report.php?startdate=' + date
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
    function getsmtable(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/sm_table.php?startdate=' + start + '&enddate=' + end
      };
      return $http(req);
    }
    function getpottingtable(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/potting_table.php?startdate=' + start + '&enddate=' + end
      };
      return $http(req);
    }
    function getmtftable(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/mtf_table.php?startdate=' + start + '&enddate=' + end
      };
      return $http(req);
    }
    function getrework(start, end) {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/BP_Rework.php?startdate=' + start + '&enddate=' + end
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
