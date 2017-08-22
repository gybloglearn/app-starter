define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (7 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.levels = ["J1", "J2", "J3", "Konyvelesre kesz", "Konyvelve", "Visszautasitva", "Penzugyi reviewed"];
    vm.areas = ["WP01", "WP03 Dope", "WP03 Fiber", "WP03 500 RAW", "WP03 500 Sheet", "WP03 500 Modul", "WP03 1000 Bundle", "WP03 1000 SFG", "WP03 1500 Bundle", "WP03 1500 FG", "WP04", "DOCK", "WP03 1000 FG", "TTBY", "WP03 ZB", "WP03 Zeelung", "WP03 1000 RAW", "WP03 1500 RAW"];
    vm.actlevel = "J1";
    vm.actarea = "WP01";
    vm.data = [];
    vm.load = load;

    function load() {
      vm.data = [];
      dataService.get(vm.startdate, vm.enddate, vm.actlevel, vm.actarea).then(function (response) {
        vm.data = response.data;
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.today = $filter('date')(new Date(), 'yyyy-MM-dd');
    }
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
