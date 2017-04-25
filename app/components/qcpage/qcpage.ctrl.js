define([], function () {
  'use strict';
  function Controller(downloadService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.type = ["ETF", "Gradeing"];
    vm.times = ["nap", "hét", "hónap", "negyedév", "év"];
    vm.data = [];
    vm.startdate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.acttime = "nap";
    vm.acttype = "ETF";
    vm.load = load;

    function load() {
      vm.data = [];
      vm.dis = true;
      vm.QCloading = true;

      downloadService.get(vm.startdate, vm.enddate, vm.acttype, vm.acttime).then(function (response) {
        vm.data = response.data;
        vm.dis = false;
        vm.QCloading = false;
        console.log(vm.data);
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['downloadService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
