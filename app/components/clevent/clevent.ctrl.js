define([], function () {
  'use strict';
  function Controller(cleventService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.startdatumszam = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.enddatumszam = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.data = [];
    vm.selectclor = [];
    vm.actclor = "";
    vm.beilleszt = beilleszt;
    vm.setChart = setChart;

    function beilleszt() {
      vm.startdatumszam = $filter('date')(new Date(vm.startdate).getTime(), 'yyyy-MM-dd');
      vm.enddatumszam = $filter('date')(new Date(vm.enddate).getTime(), 'yyyy-MM-dd');
      load();
    }

    function load() {
      vm.data = [];
      vm.actclor = "";
      cleventService.get(vm.startdate, vm.enddate).then(function (response) {
        vm.data = response.data;
        for (var i = 0; i < vm.data.length; i++) {
          var numstart = new Date(vm.data[i].CL_Start).getHours() * 60 + new Date(vm.data[i].CL_Start).getMinutes();
          var numend = new Date(vm.data[i].CL_End).getHours() * 60 + new Date(vm.data[i].CL_End).getMinutes();

          if (numstart < 350) {
            vm.data[i].CL_Start = $filter('date')(new Date(vm.data[i].CL_Start).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            vm.data[i].CL_Start = $filter('date')(new Date(vm.data[i].CL_Start).getTime(), 'yyyy-MM-dd');
          }

          if (numend < 350) {
            vm.data[i].CL_End = $filter('date')(new Date(vm.data[i].CL_End).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else if (vm.data[i].CL_End != "") {
            vm.data[i].CL_End = $filter('date')(new Date(vm.data[i].CL_End).getTime(), 'yyyy-MM-dd');
          }
        }
        setChart(vm.data, vm.actclor);
      });
    }

    function setChart(arr, cl) {
      vm.selectclor = [];
      vm.selectclor = $filter('unique')(arr, 'MachineName');

      vm.chartconfig = {
        chart: {
          type: 'column',
        },
        title: { text: "Összesítő " + vm.actclor },
        series: [
          {
            name: 'Klórozó be',
            color: "#009999",
            data: setIn(arr, cl),

          },
          {
            name: 'Klórozó ki',
            color: "#3366ff",
            data: setOut(arr, cl),

          }],
        xAxis: {
          type: 'category',
        },
        yAxis: {
          title: {
            text: "Darab"
          }
        }
      }
    }

    function setIn(t, c) {
      var selectdata = [];
      var days = $filter('unique')(t, 'CL_Start');
      days = $filter('orderBy')(days, 'CL_Start');

      if (c == "") {
        for (var i = 0; i < days.length; i++) {
          var db = 0;
          for (var j = 0; j < t.length; j++) {
            if (days[i].CL_Start == t[j].CL_Start) {
              db++;
            }
          }
          selectdata.push({ name: days[i].CL_Start, y: db });
        }
      }
      else {
        for (var i = 0; i < days.length; i++) {
          var db = 0;
          for (var j = 0; j < t.length; j++) {
            if (days[i].CL_Start == t[j].CL_Start && t[j].MachineName == c) {
              db++;
            }
          }
          selectdata.push({ name: days[i].CL_Start, y: db });
        }
      }
      return selectdata;
    }

    function setOut(t, c) {
      var selectdata = [];
      var days = $filter('unique')(t, 'CL_End');
      days = $filter('orderBy')(days, 'CL_End');
      days.shift();
      console.log(days);

      if (c == "") {
        for (var i = 0; i < days.length-1; i++) {
          var db = 0;
          for (var j = 0; j < t.length; j++) {
            if (days[i].CL_End == t[j].CL_End) {
              db++;
            }
          }
          selectdata.push({ name: days[i].CL_End, y: db });
        }
      }
      else {
        for (var i = 0; i < days.length-1; i++) {
          var db = 0;
          for (var j = 0; j < t.length; j++) {
            if (days[i].CL_End == t[j].CL_End && t[j].MachineName == c) {
              db++;
            }
          }
          selectdata.push({ name: days[i].CL_End, y: db });
        }
      }
      return selectdata;
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.edate = $filter('date')(new Date(), 'yyyy-MM-dd');
      load();
    }
  }
  Controller.$inject = ['cleventService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
