define([], function () {
  'use strict';
  function Controller(smdataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.sm = "SM4";
    vm.load = load;
    vm.smloading = false;

    function load() {
      vm.smloading = true;
      vm.data = [];
      vm.missdata = [];
      vm.misst = 0;

      smdataService.get(vm.datum, vm.sm).then(function (response) {
        vm.data = response.data;

        for (var i = 0; i < vm.data.length - 1; i++) {
            var j = i + 1
            var diff = (vm.data[j].timestamp - vm.data[i].timestamp);
            vm.misst += diff / 1000 - vm.data[i].Event_time;

            var obj = {
              type: vm.data[i].Event_type,
              start: vm.data[i].timestamp,
              nextstart: vm.data[j].timestamp,
              time: vm.data[i].Event_time,
              difference: diff / 1000,
              timediff: diff / 1000 - vm.data[i].Event_time
            }
            vm.missdata.push(obj);
          }
        vm.smloading = false;
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['smdataService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});