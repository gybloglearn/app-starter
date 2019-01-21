define([], function () {
  'use strict';
  function Controller(dayService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.date = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.shifts = [1, 3];
    vm.load = false;
    vm.getrewinder = getrewinder;
    vm.target = target;
    vm.iconize = iconize;
    vm.actshiftnum = "";
    vm.meteraeq = "aeq";

    function create_rewinders() {
      vm.rewinders = [];
      for (var i = 1; i < 18; i++) {
        if (i == 1) {
          vm.rewinders.push("Rewinder0" + i);
        }
        else {
          vm.rewinders.push("Rewinder" + i);
        }
      }
    }

    function getplans() {
      vm.allplans = [];
      dayService.getplan().then(function (resp) {
        vm.allplans = resp.data;
      });
    }

    function getrewinder() {
      vm.datenum = $filter('date')(new Date(vm.date), 'yyyy-MM-dd');
      vm.data = [];
      vm.load = true;
      dayService.get(vm.date).then(function (response) {
        var d = response.data;
        for (var j = 0; j < d.length; j++) {
          if (d[j].MachineName == "Rewinder1") {
            d[j].MachineName = "Rewinder01";
          }
          d[j].ShiftNum = parseInt(d[j].ShiftNum);
          d[j].ProducedLength = d[j].ProducedLength * 1;
          d[j].ProducedLength_aeq = d[j].ProducedLength / 8900;
        }
        vm.data = d;
        vm.load = false;
        console.log(vm.data);
      });
    }

    function target(shiftnum) {
      var target = 0;
      var dayaeq = 0;
      var daymeter = 0;
      if (vm.meteraeq == "aeq") {
        for (var i = 0; i < vm.allplans.length; i++) {
          if (vm.allplans[i].startdate <= vm.date && vm.allplans[i].enddate >= vm.date) {
            dayaeq = vm.allplans[i].aeq;
          }
        }

        if (vm.edate == vm.date) {
          var num = new Date().getHours() * 60 + new Date().getMinutes();
          if (shiftnum == 1 && num >= 350 && num <= 1070) {
            target = (dayaeq / 1440) * (num - 350);
          }
          else if (shiftnum == 3 && num > 1070) {
            target = (dayaeq / 1440) * (num - 1070);
          }
          else if (shiftnum == 3 && num < 350) {
            target = (dayaeq / 1440) * (num + 370);
          }
          else if (shiftnum == 0 && num >= 350 && num <= 1070) {
            target = (dayaeq / 1440) * (num - 350);
          }
          else if (shiftnum == 0 && num > 1070) {
            target = (dayaeq / 1440) * (num - 350);
          }
          else if (shiftnum == 0 && num < 350) {
            target = (dayaeq / 1440) * (num + 1090);
          }
        }
        else {
          if (shiftnum == 1 || shiftnum == 3) {
            target = dayaeq / 2;
          }
          else {
            target = dayaeq;
          }
        }
      }
      else {
        for (var i = 0; i < vm.allplans.length; i++) {
          if (vm.allplans[i].startdate <= vm.date && vm.allplans[i].enddate >= vm.date) {
            daymeter = vm.allplans[i].amount;
          }
        }

        if (vm.edate == vm.date) {
          var num = new Date().getHours() * 60 + new Date().getMinutes();
          if (shiftnum == 1 && num >= 350 && num <= 1070) {
            target = (daymeter / 1440) * (num - 350);
          }
          else if (shiftnum == 3 && num > 1070) {
            target = (daymeter / 1440) * (num - 1070);
          }
          else if (shiftnum == 3 && num < 350) {
            target = (daymeter / 1440) * (num + 370);
          }
          else if (shiftnum == 0 && num >= 350 && num <= 1070) {
            target = (daymeter / 1440) * (num - 350);
          }
          else if (shiftnum == 0 && num > 1070) {
            target = (daymeter / 1440) * (num - 350);
          }
          else if (shiftnum == 0 && num < 350) {
            target = (daymeter / 1440) * (num + 1090);
          }
        }
        else {
          if (shiftnum == 1 || shiftnum == 3) {
            target = daymeter / 2;
          }
          else {
            target = daymeter;
          }
        }
      }
      return target;
    }

    function iconize(number, shiftnum) {
      var target = 0;
      var dayaeq = 0;
      var daymeter = 0;

      if (vm.meteraeq == "aeq") {
        for (var i = 0; i < vm.allplans.length; i++) {
          if (vm.allplans[i].startdate <= vm.date && vm.allplans[i].enddate >= vm.date) {
            dayaeq = vm.allplans[i].aeq;
          }
        }

        if (vm.edate == vm.date) {
          var num = new Date().getHours() * 60 + new Date().getMinutes();
          if (shiftnum == 1 && num >= 350 && num <= 1070) {
            target = (dayaeq / 1440) * (num - 350);
          }
          else if (shiftnum == 3 && num > 1070) {
            target = (dayaeq / 1440) * (num - 1070);
          }
          else if (shiftnum == 3 && num < 350) {
            target = (dayaeq / 1440) * (num + 370);
          }
          else if (shiftnum == 0 && num >= 350 && num <= 1070) {
            target = (dayaeq / 1440) * (num - 350);
          }
          else if (shiftnum == 0 && num > 1070) {
            target = (dayaeq / 1440) * (num - 350);
          }
          else if (shiftnum == 0 && num < 350) {
            target = (dayaeq / 1440) * (num + 1090);
          }
        }
        else {
          if (shiftnum == 1 || shiftnum == 3) {
            target = dayaeq / 2;
          }
          else {
            target = dayaeq;
          }
        }
      }
      else {
        for (var i = 0; i < vm.allplans.length; i++) {
          if (vm.allplans[i].startdate <= vm.date && vm.allplans[i].enddate >= vm.date) {
            daymeter = vm.allplans[i].amount;
          }
        }

        if (vm.edate == vm.date) {
          var num = new Date().getHours() * 60 + new Date().getMinutes();
          if (shiftnum == 1 && num >= 350 && num <= 1070) {
            target = (daymeter / 1440) * (num - 350);
          }
          else if (shiftnum == 3 && num > 1070) {
            target = (daymeter / 1440) * (num - 1070);
          }
          else if (shiftnum == 3 && num < 350) {
            target = (daymeter / 1440) * (num + 370);
          }
          else if (shiftnum == 0 && num >= 350 && num <= 1070) {
            target = (daymeter / 1440) * (num - 350);
          }
          else if (shiftnum == 0 && num > 1070) {
            target = (daymeter / 1440) * (num - 350);
          }
          else if (shiftnum == 0 && num < 350) {
            target = (daymeter / 1440) * (num + 1090);
          }
        }
        else {
          if (shiftnum == 1 || shiftnum == 3) {
            target = daymeter / 2;
          }
          else {
            target = daymeter;
          }
        }
      }

      if (number > 0) {
        return number < target ? 'red' : 'green';
      }

    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      create_rewinders();
      getplans();
      getrewinder();
    }
  }
  Controller.$inject = ['dayService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});