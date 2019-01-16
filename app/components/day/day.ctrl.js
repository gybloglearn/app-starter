define([], function () {
  'use strict';
  function Controller(dayService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.date = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.load = false;
    vm.getrewinder = getrewinder;
    vm.target = target;
    vm.iconize=iconize;

    function getplans() {
      vm.allplans = [];
      dayService.getplan().then(function (resp) {
        vm.allplans = resp.data;
      });
    }

    function getrewinder() {
      vm.data = [];
      vm.load = true;
      dayService.get(vm.date).then(function (response) {
        var d = response.data;
        for (var j = 0; j < d.length; j++) {
          d[j].ShiftNum = parseInt(d[j].ShiftNum);
          d[j].ProducedLength_aeq = d[j].ProducedLength / 8900;
        }
        vm.data = d;
        vm.load = false;
      });
    }

    function target(shiftnum) {
      var target = 0;
      var dayaeq = 0;
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
        else if(shiftnum==3 && num<350){
          target = (dayaeq / 1440) * (num + 370);
        }
        else if (shiftnum == 0 && num >= 350 && num <= 1070) {
          target = (dayaeq / 1440) * (num - 350);
        }
        else if (shiftnum == 0 && num > 1070) {
          target = (dayaeq / 1440) * (num - 350);
        }
        else if(shiftnum==0 && num<350){
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
      return target;
    }

    function iconize(number,shiftnum){
      var target = 0;
      var dayaeq = 0;
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
        else if(shiftnum==3 && num<350){
          target = (dayaeq / 1440) * (num + 370);
        }
        else if (shiftnum == 0 && num >= 350 && num <= 1070) {
          target = (dayaeq / 1440) * (num - 350);
        }
        else if (shiftnum == 0 && num > 1070) {
          target = (dayaeq / 1440) * (num - 350);
        }
        else if(shiftnum==0 && num<350){
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

      if (number > 0) {
        return number < target ? 'red' : 'green';
      }
      
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      getplans();
      getrewinder();
    }
  }
  Controller.$inject = ['dayService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
