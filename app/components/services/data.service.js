define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getplan: getplan,
      getsm: getsm,
      getsoesm: getsoesm
    };

    return service;

    ///////////

    function getplan(id, datum) {
      var req = {
        method: 'GET',
        url: 'http://3.228.180.15/planapi/plan/' + id + '/' + datum
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
  }
  Service.$inject = ['$http'];
  return Service;
});
