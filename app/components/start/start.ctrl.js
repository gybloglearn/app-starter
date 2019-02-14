define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;

    function loadpds() {
      vm.todate="";
      vm.allnumber=0;
      dataService.getpds().then(function (response) {
        var d=response.data;
        vm.todate=$filter('date')(new Date(d[0].save).getTime()+(6*3600*1000), 'yyyy-MM-dd HH:mm');
        vm.allnumber=d.length;
      });
    }

    activate();

    function activate() {
      loadpds();
    }
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
