define([], function () {
  'use strict';
  function Controller(allsumService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.sm = [];
    vm.createdates = createdates;

    function loadPartnumbers() {
      vm.partnumbers = [];
      allsumService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
        console.log(vm.partnumbers);
      });
    }

    function createdates() {
      vm.loaddata = true;
      vm.dates = [];
      vm.days = [];
      var differencedate = 0;
      differencedate = (new Date(vm.enddate).getTime() - new Date(vm.startdate).getTime()) / (24 * 3600 * 1000);
      for (var i = 0; i <= differencedate; i++) {
        vm.dates[i] = $filter('date')(new Date(vm.enddate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyyMMdd');
        vm.days.push({
          date: vm.dates[i], joaeq: 0, ttlaeq: 0, jolap: 0, ttllap: 0, lapselejt: 0, terv: 0, szer: 0, musz: 0, ttlido: 0
        });
      }
      callsm();
    }

    function callsm() {
      for (var i = 0; i < vm.sheetmakers.length; i++) {
        vm.sm[i] = {};
        vm.sm[i].id = vm.sheetmakers[i];
        vm.sm[i].musz = 0;
        vm.sm[i].szerv = 0;
        vm.sm[i].terv = 0;
        vm.sm[i].jo = 0;
        vm.sm[i].jaeq = 0;
        vm.sm[i].ossz = 0;
        vm.sm[i].oaeq = 0;
        vm.sm[i].selejt = 0;
        vm.sm[i].saeq = 0;
      }
      vm.sm[i + 1] = {}
      vm.sm[i + 1].id = "SMS";
      vm.sm[i + 1].musz = 0;
      vm.sm[i + 1].szerv = 0;
      vm.sm[i + 1].terv = 0;
      vm.sm[i + 1].jo = 0;
      vm.sm[i + 1].jaeq = 0;
      vm.sm[i + 1].ossz = 0;
      vm.sm[i + 1].oaeq = 0;
      vm.sm[i + 1].selejt = 0;
      vm.sm[i + 1].saeq = 0;

      console.log(vm.sm);
      load();
    }

    function load() {
      vm.dt = [];

      for (var i = 0; i < vm.sheetmakers.length; i++) {
        allsumService.get(vm.startdate, vm.sheetmakers[i]).then(function (response) {
          var d=response.data;
          for(var j=0;j<d.length;j++){
            console.log(d[j]);
          }
        });
      }
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadPartnumbers();
    }
  }
  Controller.$inject = ['allsumService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});