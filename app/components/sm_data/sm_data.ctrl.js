define([], function () {
  'use strict';
  function Controller(smdataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.sm_datas = [];
    vm.sm = "SM4";
    vm.sheetmakers = ["SM1", "SM2", "SM3", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.datumszam = vm.datum;
    vm.load = load;
    vm.datszam = beallit;

    function beallit() {
      vm.szam = new Date(vm.datum);
      vm.datumszam = $filter('date')(vm.szam, 'yyyy-MM-dd');
    }

    function load() {
      vm.dis = true;
      vm.sm_datas = [];
      smdataService.get(vm.datum, vm.sm).then(function (response) {
        vm.sm_datas = response.data;
        vm.dis = false;
        var nowsm="SM4";
        setChart(nowsm);
      });

    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }

    function setChart(nowsm)
    {
      vm.darab=[];
      vm.sm = nowsm;
      feltolt_zero(vm.darab);
      vm.chartconfig = {
          chart: {
            type: 'column',
            width: 900,
            height: 360
          },
          series: [{
            name: 'Termelt lap',
            data: vm.darab
          }],

          xAxis: [
            { categories: feltolt_hour() },
          ],
          yAxis: {
            title: {
              text: "Darab"
            }
          },
        };
    }

    function feltolt_hour() {
      var szamok = [];
      for (var i = 6; i < 24; i++) {
        szamok.push(i < 10 ? "0" + i : "" + i);
      }
      for (var j = 0; j < 6; j++) {
        szamok.push("0" + j);
      }
      return szamok;
    }

    function feltolt_zero(darab){
      for(var i=0;i<24;i++)
      {
        darab.push(1);
      }
    }

  }
  Controller.$inject = ['smdataService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
