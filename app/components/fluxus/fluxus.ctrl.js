define([], function () {
  'use strict';
  function Controller(fluxusService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.date = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.datenum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.beallit = beallit;
    vm.loading = false;

    function loadpartnumbers() {
      vm.partnumbers = [];
      fluxusService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }

    function beallit() {
      vm.datenum = $filter('date')(new Date(vm.date).getTime(), 'yyyy-MM-dd')
      createhours();
    }

    function createhours() {
      vm.cats = [];
      for (var i = 6; i < 24; i++) {
        vm.cats.push(i < 10 ? "0" + i : "" + i);
      }
      for (var j = 0; j < 6; j++) {
        vm.cats.push("0" + j);
      }
      loadfluxus()
    }

    function loadfluxus() {

      vm.loading = true;

      vm.data = [];
      vm.impdata = [];
      var sdate = $filter('date')(new Date(vm.date).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      var edate = $filter('date')(new Date(vm.date).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');

      fluxusService.getetf(sdate, edate).then(function (response) {

        for (var j = 0; j < response.data.length; j++) {
          for (var k = 0; k < vm.partnumbers.length; k++) {
            if (response.data[j].jobid.includes(vm.partnumbers[k].modul)) {
              response.data[j].aeq = vm.partnumbers[k].aeq;
              response.data[j].modulname = vm.partnumbers[k].name;
            }
          }
          response.data[j].Perm_gep = response.data[j].Perm_gép;

          var minutes = new Date(response.data[j].Perm_test).getMinutes();
          var impminutes = new Date(response.data[j].Impregnation_end).getMinutes();

          if (minutes >= 50) {
            response.data[j].fluxus_hour = new Date(response.data[j].Perm_test).getHours() + 1;
          }
          else {
            response.data[j].fluxus_hour = new Date(response.data[j].Perm_test).getHours()
          }
          if (response.data[j].Perm_test_shiftday == vm.date) {
            vm.data.push(response.data[j]);
          }

          if (impminutes >= 50) {
            response.data[j].impregnation_hour = new Date(response.data[j].Impregnation_end).getHours() + 1;
          }
          else {
            response.data[j].impregnation_hour = new Date(response.data[j].Impregnation_end).getHours()
          }
          if (response.data[j].Impregnation_end_shiftday == vm.date) {
            vm.impdata.push(response.data[j]);
          }
        }
        create_chart()
        vm.loading = false;
      });
    }

    function create_chart() {
      vm.chartdata =
        [
          { name: 'Fluxus', color: 'rgb(0,0,255)', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Impregnálás', color: 'rgb(102, 0, 102)', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Cél', color: 'rgb(255,0,0)', type: 'line', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
        ];

      for (var i = 0; i < vm.data.length; i++) {
        for (var j = 0; j < vm.cats.length; j++) {
          if (vm.data[i].fluxus_hour == parseInt(vm.cats[j])) {
            vm.chartdata[0].data[j] += vm.data[i].aeq;
          }

        }
      }
      for (var i = 0; i < vm.impdata.length; i++) {
        for (var j = 0; j < vm.cats.length; j++) {
          if (vm.impdata[i].impregnation_hour == parseInt(vm.cats[j])) {
            vm.chartdata[1].data[j] += vm.impdata[i].aeq;
          }

        }
        for (var k = 0; k < 24; k++) {
          vm.chartdata[2].data[k] = 4.4;
        }
      }
      vm.chartconfig = {
        chart: {
          type: 'column',
          height: 360
        },
        title: { text: "Fluxus és impregnálás adatok órai lebontása" },
        tooltip: {
          valueDecimals: 2
        },
        xAxis: { type: 'category', categories: vm.cats },
        yAxis: { title:{text:'AEQ'}},
        series: vm.chartdata
      };
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadpartnumbers();
      createhours();
    }
  }
  Controller.$inject = ['fluxusService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
