define([], function () {
  'use strict';
  function Controller(smdataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.load = load;
    vm.smloading = false;

    function load() {
      vm.smloading = true;
      vm.data = [];
      vm.missdata = [];
      vm.misst = 0;
      vm.hossz=vm.sheetmakers.length;

      for (var i = 0; i < vm.sheetmakers.length; i++) {
        smdataService.get(vm.datum, vm.sheetmakers[i]).then(function (response) {
          vm.data = response.data;

          for (var j = 0; j < vm.data.length - 1; j++) {
            var k = j + 1
            var diff = (vm.data[k].timestamp - vm.data[j].timestamp);
            vm.misst += diff / 1000 - vm.data[j].Event_time;

            var obj = {
              type: vm.data[j].Event_type,
              start: vm.data[j].timestamp,
              nextstart: vm.data[k].timestamp,
              time: vm.data[j].Event_time,
              difference: diff / 1000,
              timediff: diff / 1000 - vm.data[j].Event_time
            }
            vm.missdata.push(obj);
          }
          vm.smloading = false;
        });
      }
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
    }
  }
  Controller.$inject = ['smdataService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});