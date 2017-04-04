define([], function () {
  'use strict';
  function Controller(statService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.stat_data = [];
    vm.sumstat = [];
    vm.startdatum = $filter('date')(new Date().getTime()-(24*3600*1000), 'yyyy-MM-dd');
    vm.enddatum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.load = load;
    vm.startdatumszam = vm.startdatum;
    vm.enddatumszam = vm.enddatum;
    vm.beallit = beallit;

    function beallit() {
      vm.szam1 = new Date(vm.startdatum);
      vm.szam2 = new Date(vm.enddatum);
      vm.startdatumszam = $filter('date')(vm.szam1, 'yyyy-MM-dd');
      vm.enddatumszam = $filter('date')(vm.szam2, 'yyyy-MM-dd');
    }

    function load() {
      var act = "";
      var actszam=0;
      var tomb = [];
      var talalat = 0;
      var a = 0;
      vm.dis = true;
      vm.braidtloading = true;
      vm.stat_data = [];
      statService.get(vm.startdatum, vm.enddatum).then(function (response) {
        vm.stat_data = response.data;
        vm.dis = false;
        for (var i = 0; i < vm.stat_data.length; i++) {
          act = vm.stat_data[i].machine_Stat;
          actszam=vm.stat_data[i].Stat_Time*1;
          for (var j = 0; j < vm.sumstat.length; j++) {
            if (vm.sumstat[j].id == act) {
              vm.sumstat[j].time=vm.sumstat[j].time+actszam;
              vm.sumstat[j].piece++;
              talalat++;
            }
          }
          if (talalat > 0) {
            talalat = 0;
            a = a;
          }
          else {
            vm.sumstat[a]={}
            vm.sumstat[a].id=act;
            vm.sumstat[a].time=actszam;
            vm.sumstat[a].piece=1;
            a++
          }
        }
        console.log(vm.stat_data);
        console.log(vm.sumstat);
        vm.braidtloading = false;
      });
    }
    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['statService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
