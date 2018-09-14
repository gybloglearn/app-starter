define([], function () {
  'use strict';
  function Controller(sscrapService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
    vm.sm = [];
    vm.load = load;

    function loadpartnumber() {
      vm.aeqs = [];
      sscrapService.getpartnumber().then(function (response) {
        vm.aeqs = response.data;
      })
    }

    function load() {
      vm.sm = [];
      sscrapService.getsheet(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd')).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          response.data[j].date=response.data[j].Day;
          response.data[j].id = response.data[j].MachineName[0] + response.data[j].MachineName[5] + response.data[j].MachineName[10];
          response.data[j].shiftnum = parseInt(response.data[j].ShiftNum);
          response.data[j].shift = $filter('shift')(response.data[j].ShiftNum, response.data[j].Day);
          response.data[j].Totalsheets = parseFloat(response.data[j].Totalsheets);
          if (response.data[j].ScrapSheets == "") {
            response.data[j].ScrapSheets = 0;
          }
          else {
            response.data[j].ScrapSheets = parseFloat(response.data[j].ScrapSheets);
          }
          response.data[j].Goodsheets = response.data[j].Totalsheets - response.data[j].ScrapSheets;
          for (var k = 0; k < vm.aeqs.length; k++) {
            if (response.data[j].type == vm.aeqs[k].id) {
              response.data[j].aeq = parseFloat(vm.aeqs[k].aeq);
            }
          }
          response.data[j].sumaeq = response.data[j].Totalsheets / response.data[j].SheetNum * response.data[j].aeq;
          response.data[j].goodaeq = (response.data[j].Totalsheets - response.data[j].ScrapSheets) / response.data[j].SheetNum * response.data[j].aeq;
          response.data[j].modul = Math.floor(response.data[j].Totalsheets / response.data[j].SheetNum);
          response.data[j].lsh = (response.data[j].Totalsheets - response.data[j].modul * response.data[j].SheetNum);
          vm.sm.push(response.data[j]);
        }
        scrapload();
      });
    }

    function scrapload() {
      sscrapService.getscrap(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd')).then(function (response) {
        for (var i = 0; i < vm.sm.length; i++) {
          vm.sm[i].bad = 0;
          for (var j = 0; j < response.data.length; j++) {
            if (response.data[j].chem == "DS- D12 FLOW") {
              response.data[j].chem = "CS-D12 FLOW";
            }
            if (response.data[j].chem == "DS- D13 CP5") {
              response.data[j].chem = "CS-D13 CP5";
            }

            if (vm.sm[i].Day == response.data[j].day && vm.sm[i].shift == response.data[j].shift && vm.sm[i].MachineName.includes(response.data[j].sm) && (vm.sm[i].PartGroup_Name == response.data[j].chem || vm.sm[i].PartGroup_Name == "DX" && response.data[j].chem == "D12 FLOW")) {
              vm.sm[i].bad += response.data[j].pc;
            }
          }
          //console.log(vm.sm[i]);
        }
        vm.loading = false;
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
      vm.loading = true;
      loadpartnumber();
      load();
    }

  }
  Controller.$inject = ['sscrapService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});