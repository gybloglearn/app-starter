define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.create_dates = create_dates;

    function create_dates() {
      vm.dates = [];
      vm.loaddates = [];
      vm.size = 0;
      var stnum = new Date(vm.startdate).getTime();
      var endnum = new Date(vm.enddate).getTime();
      while (stnum <= endnum) {
        vm.dates.push($filter('date')(stnum, 'yyyy-MM-dd'));
        vm.loaddates.push($filter('date')(stnum, 'yyyyMMdd'));
        stnum += (24 * 3600 * 1000);
        vm.size++;
      }
      getplans();
    }

    function getplans() {
      vm.allplans = [];
      dataService.getplan().then(function (resp) {
        vm.allplans = resp.data;
        load();
      });
    }

    function load() {
      vm.acttarget = 0;
      vm.data = [];
      for (var i = 0; i < vm.allplans.length; i++) {
        if (vm.allplans[i].startdate <= vm.startdate && vm.allplans[i].enddate >= vm.enddate) {
          vm.acttarget = vm.allplans[i].aeq;
        }
      }
      for (var j = 0; j < vm.loaddates.length; j++) {
        dataService.get(vm.loaddates[j]).then(function (response) {
          var d = response.data;
          for (var k = 0; k < d.length; k++) {
            d[k].ProducedLength_aeq = d[k].ProducedLength / 8900;
            vm.data.push(d[k]);
          }
        });
      }
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      var num = new Date().getHours() * 60 + new Date().getMinutes();
      if (num < 350) {
        vm.snum=-8;
        vm.en=-2
        vm.startdate = $filter('date')(new Date().getTime() - 8 * 24 * 1000 * 60 * 60, 'yyyy-MM-dd');
        vm.enddate = $filter('date')(new Date().getTime() - 2 * 24 * 1000 * 60 * 60, 'yyyy-MM-dd');
        vm.edate = $filter('date')(new Date().getTime() - (2 * 24 * 3600 * 1000), 'yyyy-MM-dd');
      }
      else {
        vm.snum=-7;
        vm.en=-1
        vm.startdate = $filter('date')(new Date().getTime() - 7 * 24 * 1000 * 60 * 60, 'yyyy-MM-dd');
        vm.enddate = $filter('date')(new Date().getTime() - 24 * 1000 * 60 * 60, 'yyyy-MM-dd');
        vm.edate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      }
      create_dates();
    }
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
