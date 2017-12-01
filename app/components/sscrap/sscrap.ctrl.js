define([], function () {
  'use strict';
  function Controller(sscrapService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime()+24*60*60*1000, 'yyyy-MM-dd');
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.sm = [];
    vm.createdate = createdate;

    function createdate(dt) {
      vm.enddate= $filter('date')(new Date(dt).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      createsheetmakers(vm.startdate,vm.enddate);
    }

    function createsheetmakers(dt1, dt2) {
      vm.sm = [];
      var difference = ((new Date(dt2).getTime() - new Date(dt1).getTime()) / (24 * 3600 * 1000)) - 1;

      for (var i = 0; i <= difference; i++) {
        var actdate = $filter('date')(new Date(dt2).getTime() - ((i + 1) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        for (var j = 0; j < vm.sheetmakers.length; j++) {
          var obj = {};
          obj.id = vm.sheetmakers[j];
          obj.date = actdate;
          obj.shiftnum = 1;
          obj.type = "";
          obj.good = 0;
          obj.total = 0;
          obj.bad = 0;
          obj.diff = 0;

          var obj2 = {};
          obj2.id = vm.sheetmakers[j];
          obj2.date = actdate;
          obj2.shiftnum = 3;
          obj.type = "";
          obj2.good = 0;
          obj2.total = 0;
          obj2.bad = 0;
          obj2.diff = 0;

          vm.sm.push(obj);
          vm.sm.push(obj2);
        }
      }
      load();
    }

    function load() {
      for (var i = 0; i < vm.sheetmakers.length; i++) {
        sscrapService.getsheet(vm.startdate, vm.enddate, vm.sheetmakers[i]).then(function (response) {
          for (var j = 0; j < vm.sm.length; j++) {
            for (var k = 0; k < response.data.length; k++) {
              var actdate = $filter('date')(new Date(response.data[k].days).getTime(), 'yyyy-MM-dd');
              if (vm.sm[j].id == response.data[k].shortname && vm.sm[j].shiftnum == response.data[k].shiftnum && vm.sm[j].date == actdate && response.data[k].category == "TOTAL") {
                vm.sm[j].type = response.data[k].type;
                vm.sm[j].total = response.data[k].amount;
              }
              else if (vm.sm[j].id == response.data[k].shortname && vm.sm[j].shiftnum == response.data[k].shiftnum && vm.sm[j].date == actdate && response.data[k].category == "GOOD") {
                vm.sm[j].good = response.data[k].amount;
                vm.sm[j].diff = vm.sm[j].total - response.data[k].amount;
              }
            }
          }
        });
      }
      scrapload();
    }

    function scrapload() {
      sscrapService.getscrap(vm.startdate, vm.enddate).then(function (response) {
        for (var i = 0; i < vm.sm.length; i++) {
          vm.sm[i].shift = $filter('shift')(vm.sm[i].shiftnum, vm.sm[i].date);
          for (var j = 0; j < response.data.length; j++) {
            if (vm.sm[i].date == response.data[j].day && vm.sm[i].shift == response.data[j].shift && vm.sm[i].id.includes(response.data[j].sm)) {
              vm.sm[i].bad += response.data[j].pc;
            }
          }
        }
      });
      vm.enddate= $filter('date')(new Date(vm.enddate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));

      vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
      createsheetmakers(vm.startdate, vm.enddate);
    }
  }
  Controller.$inject = ['sscrapService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});