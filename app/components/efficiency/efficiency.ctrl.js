define([], function () {
  'use strict';
  function Controller($cookies, $state, $rootScope, efficiencyService, $filter) {
    var vm = this;
    vm.date = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.create_found = create_found;
    vm.loading = false;

    activate();

    function create_found() {
      vm.data = [];
      vm.loading = true;

      var nowdate = $filter('date')(new Date(), 'yyyy-MM-dd');
      var nowdatenum = new Date(nowdate).getTime();
      var datenum = new Date(vm.date).getTime();

      if (datenum < nowdatenum) {
        for (var i = 0; i < vm.sheetmakers.length; i++) {
          var obj = {
            sm: vm.sheetmakers[i],
            date: vm.date,
            dayshift: $filter('shift')(1, $filter('date')(vm.date, 'yyyy-MM-dd')) + " ",
            daycyclemin: 0,
            daycyclemax: 0,
            daysheet: 0,
            daydowntime: 0,
            dayruntime: 720 * 60,
            nightshift: $filter('shift')(3, $filter('date')(vm.date, 'yyyy-MM-dd')) + " ",
            nightcyclemin: 0,
            nightcyclemax: 0,
            nightsheet: 0,
            nightdowntime: 0,
            nightruntime: 720 * 60
          }
          vm.data.push(obj);
        }
      }
      else {
        var adddaynum = 0;
        var addnightnum = 0;
        var minutes = new Date().getHours() * 60 + new Date().getMinutes();
        if (minutes < 350) {
          addnightnum = minutes + 370;
          adddaynum = 720;
        }
        else if (minutes >= 350 && minutes < 1070) {
          adddaynum = minutes - 350;
        }
        else {
          addnightnum = minutes - 1070;
          adddaynum = 720;
        }
        for (var i = 0; i < vm.sheetmakers.length; i++) {
          var obj = {
            sm: vm.sheetmakers[i],
            date: vm.date,
            dayshift: $filter('shift')(1, $filter('date')(vm.date, 'yyyy-MM-dd')) + " ",
            daycyclemin: 0,
            daycyclemax: 0,
            daysheet: 0,
            daydowntime: 0,
            dayruntime: adddaynum * 60,
            nightshift: $filter('shift')(3, $filter('date')(vm.date, 'yyyy-MM-dd')) + " ",
            nightcyclemin: 0,
            nightcyclemax: 0,
            nightsheet: 0,
            nightdowntime: 0,
            nightruntime: addnightnum * 60
          }
          vm.data.push(obj);
        }
      }
      loadavg();
      loadsheets();
      loaddowntime();
    }

    function loadavg() {
      angular.forEach(vm.sheetmakers, function (v, k) {
        efficiencyService.getcycle(vm.date, v).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            for (var k = 0; k < vm.data.length; k++) {
              if (vm.data[k].date == response.data[j].Shift_Day && response.data[j].Shift_Num == "1" && vm.data[k].sm == v) {
                vm.data[k].daycyclemin = response.data[j].Shift_Avg * 1;
                vm.data[k].daycyclemax = (response.data[j].Shift_Avg * 1) + 15;
              }
              else if (vm.data[k].date == response.data[j].Shift_Day && response.data[j].Shift_Num == "3" && vm.data[k].sm == v) {
                vm.data[k].nightcyclemin = response.data[j].Shift_Avg * 1;
                vm.data[k].nightcyclemax = (response.data[j].Shift_Avg * 1) + 15;
              }
            }
          }
        });
      });
    }

    function loadsheets() {
      angular.forEach(vm.sheetmakers, function (v, k) {
        efficiencyService.getsm(vm.date, v).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].days = $filter('date')(new Date(response.data[j].days), 'yyyy-MM-dd');
            for (var k = 0; k < vm.data.length; k++) {
              if (vm.data[k].date == response.data[j].days && response.data[j].category == "TOTAL" && response.data[j].shiftnum == "1" && vm.data[k].sm == v) {
                vm.data[k].daysheet += response.data[j].amount;
              }
              else if (vm.data[k].date == response.data[j].days && response.data[j].category == "TOTAL" && response.data[j].shiftnum == "3" && vm.data[k].sm == v) {
                vm.data[k].nightsheet += response.data[j].amount;
              }
            }
          }
        });
      });
    }

    function loaddowntime() {
      angular.forEach(vm.sheetmakers, function (v, k) {
        efficiencyService.getdt(vm.date, v).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            var num = new Date(response.data[j].timestamp).getHours() * 60 + new Date(response.data[j].timestamp).getMinutes();
            if (num <= 350) {
              response.data[j].date = $filter('date')(response.data[j].timestamp - (24 * 3600 * 1000), 'yyyy-MM-dd');
            }
            else {
              response.data[j].date = $filter('date')(response.data[j].timestamp, 'yyyy-MM-dd');
            }
            for (var k = 0; k < vm.data.length; k++) {
              if (vm.data[k].date == response.data[j].date && vm.data[k].dayshift == response.data[j].Shift_Name && vm.data[k].sm == v) {
                vm.data[k].daydowntime += response.data[j].Event_time;
                vm.data[k].dayruntime -= response.data[j].Event_time;;
              }
              else if (vm.data[k].date == response.data[j].date && vm.data[k].nightshift == response.data[j].Shift_Name && vm.data[k].sm == v) {
                vm.data[k].nightdowntime += response.data[j].Event_time;
                vm.data[k].nightruntime -= response.data[j].Event_time;;
              }
            }
          }
          console.log(vm.data);
          vm.loading = false;
        });
      });
    }

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      create_found();
    }
  }
  Controller.$inject = ['$cookies', '$state', '$rootScope', 'efficiencyService', '$filter'];
  return Controller;
});