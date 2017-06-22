define([], function () {
  'use strict';
  function Controller(weeklyService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.yesterday = $filter('date')(new Date().getTime() - 24 * 3600 * 1000, 'yyyy-MM-dd');
    vm.monday = $filter('date')(new Date(), 'yyyy-MM-dd');
    var sheets = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.sheets = sheets;
    vm.data = [];
    vm.fault = [];
    vm.a = 0;

    function create_monday() {
      vm.a = new Date().getDay();
      if (vm.a != 1) {
        vm.monday = $filter('date')(new Date().getTime() - (vm.a - 1) * 24 * 3600 * 1000, 'yyyy-MM-dd');
      }
      else {
        vm.monday = $filter('date')(new Date(), 'yyyy-MM-dd');
      }
    }

    function load() {
      vm.data = [];
      vm.fault = [];
      vm.loading = true;
      var val = 0;
      var b = 0;
      var talalt = 0;

      angular.forEach(sheets, function (v, k) {
        weeklyService.get(vm.monday, vm.yesterday, v).then(function (response) {
          val++;
          vm.data = vm.data.concat(response.data);
          if (val == 8) {
            vm.loading = false;
            for (var i = 0; i < vm.data.length; i++) {
              for (var j = 0; j < vm.fault.length; j++) {
                if (vm.data[i].Event_SubGroup == vm.fault[j].code) {
                  vm.fault[j].time += vm.data[i].Event_time;
                  talalt++;
                }
              }
              if (talalt == 0) {
                vm.fault[b] = {}
                vm.fault[b].code = vm.data[i].Event_SubGroup;
                vm.fault[b].group = vm.data[i].Ev_Group;
                vm.fault[b].time = vm.data[i].Event_time;
                b++;
              }
              else {
                talalt = 0;
              }
            }
            setfaultChart(vm.fault);
            setChart(vm.data);
          }
        });
      });
    }

    function setfaultChart(fa) {
      var fau = $filter('limitTo')($filter('orderBy')(fa, 'time', true), 10);
      var fdata = [];

      for (var i = 0; i < fau.length; i++) {
        fdata[i] = {
          name: fau[i].code,
          y: Math.round(fau[i].time/60)
        }
      }

      vm.faultChartconfig = {
        chart: {
          type: 'column',
        },
        title: { text: "TOP 10 hiba" },
        series: [{
          name: 'Hibák',
          colorByPoint: true,
          data: fdata
        }],
        xAxis: {
          type: "category"
        },
        yAxis: [
          { title: { text: 'Perc' } }
        ],
      }
    }

    function setChart(dt) {
      vm.Chartconfig = {
        chart: {
          type: 'column',
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        tooltip: {
          valueDecimals: 2
        },
        title: { text: "SM1-SM9 chart" },
        series: [
          {
            name: 'Műszaki technikai okok',
            color: "#ff0000",
            data: feltolt_Muszaki(dt),
            stack: 'Összes'
          },
          {
            name: 'Szervezési veszteség',
            color: "#dddddd",
            data: feltolt_Szervezesi(dt),
            stack: 'Összes'
          },
          {
            name: 'Tervezett veszteség',
            color: "#0066dd",
            data: feltolt_Tervezett(dt),
            stack: 'Összes'
          },
          {
            name: 'Jó',
            color: "#00ff00",
            data: feltolt_Jo(dt),
            stack: 'Összes'
          },
        ],
        xAxis: [
          { categories: feltolt_x() },
        ],
        yAxis: {
          title: {
            text: "Százalék"
          },
          tickInterval: 20,
          max: 100
        },
      }
    }

    function feltolt_x() {
      var szoveg = ["Hibák százalékos aránya"];
      return szoveg;
    }

    function feltolt_Muszaki(tomb) {
      var hiba = 0;
      var hb = [];

      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].Ev_Group == "Muszaki technikai okok") {
          hiba += (tomb[i].Event_time) / 60;
        }
      }
      hb[0] = (hiba / ((vm.a - 1) * 1440 * 7)) * 100;
      return hb;
    }

    function feltolt_Szervezesi(tomb) {
      var hiba = 0;
      var hb = [];

      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].Ev_Group == "Szervezesi veszteseg") {
          hiba += (tomb[i].Event_time) / 60;
        }
      }
      hb[0] = (hiba / ((vm.a - 1) * 1440 * 7)) * 100;
      return hb;
    }

    function feltolt_Tervezett(tomb) {
      var hiba = 0;
      var hb = [];

      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].Ev_Group == "Tervezett veszteseg") {
          hiba += (tomb[i].Event_time) / 60;
        }
      }
      hb[0] = (hiba / ((vm.a - 1) * 1440 * 7)) * 100;
      return hb;
    }

    function feltolt_Jo(tomb) {
      var hiba = 0;
      var jo = (vm.a - 1) * 1440 * 7;
      var hb = [];

      for (var i = 0; i < tomb.length; i++) {
        {
          hiba += (tomb[i].Event_time) / 60;
        }
      }
      hb[0] = ((jo - hiba) / jo) * 100;
      return hb;
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      create_monday();
      load();
    }
  }
  Controller.$inject = ['weeklyService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
