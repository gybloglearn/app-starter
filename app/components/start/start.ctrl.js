define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    //vm.tanks = ["Bubble point tank1", "Bubble point tank2", "Bubble point tank3", "Bubble point tank4", "Bubble point tank5", "Bubble point tank6", "Bubble point tank7", "Bubble point tank12", "Bubble point tank13", "Bubble point tank14", "Bubble point tank15", "Bubble point tank21", "Bubble point tank22", "Bubble point tank23", "Bubble point tank25", "Bubble point tank26"];
    vm.partnumbers = [];
    vm.data = [];
    vm.bokesdata = [];
    vm.uniquedata = [];
    vm.actshiftnum = 0;
    vm.actplan = 0;
    vm.totalaeq = 113;
    vm.mtfloading = false;

    function loadpartnumber() {
      vm.mtfloading = true;
      dataService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
        loadrework();
        loadbokes();
      });
    }

    function createshiftnum() {
      var num = new Date().getHours() * 60 + new Date().getMinutes();
      if (num >= 350 && num < 1070) {
        vm.actshiftnum = 1;
        vm.actplan = (vm.totalaeq / 720) * (num - 350);
      }
      else {
        vm.actshiftnum = 3;
        if (num >= 1070) {
          vm.actplan = (vm.totalaeq / 720) * (num - 1070);
        }
        else {
          vm.actplan = (vm.totalaeq / 720) * (num + 370);
        }
      }
      console.log(vm.actplan);
    }

    function loadrework() {
      vm.data = [];
      vm.uniquedata = [];
      var num = new Date().getHours() * 60 + new Date().getMinutes();
      if (num < 350) {
        var startdate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
        var enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
      }
      else {
        var startdate = $filter('date')(new Date(), 'yyyy-MM-dd');
        var enddate = $filter('date')(new Date().getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      }
      dataService.getrework(startdate, enddate).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          var datenum = new Date(response.data[i].BPstart).getHours() * 60 + new Date(response.data[i].BPstart).getMinutes();
          for (var j = 0; j < vm.partnumbers.length; j++) {
            if (response.data[i].BaaNCode == vm.partnumbers[j].id) {
              response.data[i].aeq = vm.partnumbers[j].aeq * 1;
              if (datenum >= 350 && datenum < 1070) {
                response.data[i].shiftnum = 1;
              }
              else {
                response.data[i].shiftnum = 3;
              }
              vm.data.push(response.data[i]);
            }
          }
        }
        vm.uniquedata = $filter('unique')(vm.data, 'Type');
        console.log(vm.data);
      });
    }

    function loadbokes() {
      vm.bokesdata = [];
      var num = new Date().getHours() * 60 + new Date().getMinutes();
      if (num < 350) {
        var startdate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
        var enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
      }
      else {
        var startdate = $filter('date')(new Date(), 'yyyy-MM-dd');
        var enddate = $filter('date')(new Date().getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      }
      dataService.get(startdate, enddate).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].shiftnum = response.data[i].shiftnum * 1;
          response.data[i].BOKES = response.data[i].BOKES * 1;
          response.data[i].BPOUT = response.data[i].BPOUT * 1;
          for (var j = 0; j < vm.partnumbers.length; j++) {
            if (response.data[i].type == vm.partnumbers[j].id) {
              response.data[i].aeq = response.data[i].BPOUT * vm.partnumbers[j].aeq;
            }
          }
          if (response.data[i].type[0] == "3" && response.data[i].PartGroup_Name!="") {
            vm.bokesdata.push(response.data[i]);
          }
        }
        console.log(vm.bokesdata);
        vm.mtfloading = false;
      });
    }

    var refresshiftnum = setInterval(createshiftnum, 15 * 60 * 1000);
    var refrespartnumber = setInterval(loadpartnumber, 15 * 60 * 1000);

    activate();

    function activate() {
      createshiftnum();
      loadpartnumber();
    }
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
