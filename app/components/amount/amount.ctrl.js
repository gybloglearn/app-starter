define([], function () {
  'use strict';
  function Controller(amountService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (7 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.categories = ["Day", "Week", "Month", "Year"];
    vm.actcat = "Day";
    vm.sldata = [];
    vm.dates=[];
    vm.load=load;
    vm.loading = true;

    function load() {
      vm.loading = true;
      vm.sldata = [];
      vm.dates=[];
      amountService.get(vm.startdate, vm.enddate, vm.actcat).then(function (response) {
        vm.sldata = response.data;
        vm.dates=$filter('unique')(vm.sldata,'item1');
        vm.loading = false;
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['amountService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
