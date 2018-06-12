define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getpartnumber: getpartnumber,
      getcycle: getcycle,
      getsm: getsm,
      getdt: getdt
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

    function getcycle(start, sm) {
      var req = {
        method: 'GET',
        //url: 'app/components/PHP/SM_Cycle.php?startdate=' + start + '&enddate=' + end + '&machinelist=' + sm
        url: 'app/components/PHP/SM_Cycle.php?startdate=' + start  +  '&machinelist=' + sm
      };
      return $http(req);
    }
    function getsm(start, mch) {
      var req = {
        method: 'GET',
        //url: 'app/components/PHP/ZW500_SM.php?startdate=' + start + '&enddate=' + end + '&report_id=' + mch
        url: 'app/components/PHP/ZW500_SM.php?startdate=' + start + '&report_id=' + mch
      };
      return $http(req);
    }
    function getdt(start, mch) {
      var req = {
        method: 'GET',
        //url: 'app/components/PHP/smdt.php?startdate=' + start + '&enddate=' + end + '&mch=' + mch
       url: 'app/components/PHP/smdt.php?startdate=' + start + '&mch=' + mch
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
