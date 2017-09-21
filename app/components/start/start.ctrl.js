define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (7 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.data = [];
    vm.loadall=loadall;

    function loadall() {
      vm.loading = true;
      vm.data = [];
      vm.data[0] = [];
      vm.data[1] = [];
      vm.data[2] = [];
      loadsl();
      loaddowntime();
      loadscrap();
      console.log(vm.data);
      vm.loading = false;
    }

    function loadsl() {
      dataService.getsl(vm.startdate, vm.enddate).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].machine == "SpinLine #136" || response.data[i].machine == "SpinLine #236") {
            vm.data[0].push(response.data[i]);
          }
        }
      });
    }
    function loaddowntime() {
      dataService.getdowntime(vm.startdate, vm.enddate).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          vm.data[1].push(response.data[i]);
        }
      });
    }
    function loadscrap() {
      dataService.getscrap(vm.startdate, vm.enddate).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].Cikkszam == "3111366" || response.data[i].Cikkszam == "3111377") {
            vm.data[2].push(response.data[i]);
          }
        }
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.today= $filter('date')(new Date(), 'yyyy-MM-dd');
      loadall();
    }
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
