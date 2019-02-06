define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      getpartnumber: getpartnumber,
      getetf: getetf,
      getclorination: getclorination,
      postclorination: postclorination,
      getfluxus: getfluxus,
      postfluxus: postfluxus,
      getimpregnal: getimpregnal,
      postimpregnal: postimpregnal
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
    function getclorination() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Pottinginfosave/clorinationinfo/456123789'
      };
      return $http(req);
    }
    function postclorination(data) {
      var req = {
        method: 'POST',
        url: 'app/components/PHP/Pottinginfosave/clorinationinfo/' + data.id,
        data: data
      };
      return $http(req);
    }
    function getfluxus() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Pottinginfosave/fluxusinfo/123456789'
      };
      return $http(req);
    }
    function postfluxus(data) {
      var req = {
        method: 'POST',
        url: 'app/components/PHP/Pottinginfosave/fluxusinfo/' + data.id,
        data: data
      };
      return $http(req);
    }
    function getimpregnal() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Pottinginfosave/impregnalinfo/987654321'
      };
      return $http(req);
    }
    function postimpregnal(data) {
      var req = {
        method: 'POST',
        url: 'app/components/PHP/Pottinginfosave/impregnalinfo/' + data.id,
        data: data
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
