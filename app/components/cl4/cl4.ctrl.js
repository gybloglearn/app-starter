define([], function () {
  'use strict';
  function Controller(cl4Service, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.alldata = [];
    vm.selectday = [];
    vm.charlist = [];
    vm.chartstate = "A keretet elvitték (nyugtázás a fénykapunál)"
    vm.startdate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.datumszam = vm.startdate;
    vm.beilleszt = beilleszt;
    vm.load = load;
    vm.loadall = loadall;
    vm.selectchart = selectchart;

    function update_selectday() {
      for (var i = 0; i < 24; i++) {
        vm.selectday[i] = {}
        if (i < 18) {
          vm.selectday[i].hour = i + 6;
        }
        else {
          vm.selectday[i].hour = i - 18;
        }
        vm.selectday[i].cases = [
          {state: "Klórozó robot a keretet berakta a klórozó kádba", db: 0},
          {state: "A keret belépett az X3 cellába a V43 megállítóhoz", db: 0},
          {state: " A mosószárak felmentek", db: 0},
          {state: "A gél kimosó robot kihúzta a dugót", db: 0},
          {state: " A gél kimosó robot felvette a keretet", db: 0},
          {state: "Az 1-es kádba rakott modulon az áramlás felépült", db: 0},
          {state: "A klórozó robot a keretet berakta az 1-es öblítő kádba", db: 0},
          {state: "A keret elvihető (jelzés)", db: 0},
          {state: "Adapter felszerelve", db: 0},
          {state: "Adapter leszerelve", db: 0},
          {state: "A 2-es kádba helyezett modulon az áramlás felépült", db: 0},
          {state: " Keret az átrakó asztalon", db: 0},
          {state: "A klórozó robot a keretet berakta a 2-es öblítő kádba", db: 0},
          {state: "Keret kirakva a kihordó asztalra", db: 0},
          {state: "A keretet elvitték (nyugtázás a fénykapunál)", db: 0},
          {state: "A klórozó kádba helyezett modulon az áramlás felépült", db: 0},
          {state: "Potting3-ban keret kiadási engedély", db: 0}
        ];
      }
    }

    function beilleszt() {
      var szam = new Date(vm.startdate);
      vm.datumszam = $filter('date')(szam, 'yyyy-MM-dd');
    }

    function load() {
      vm.mtfld = true;
      update_selectday();
      vm.data = [];


      cl4Service.get(vm.startdate).then(function (response) {
        vm.data = response.data;
        for (var i = 0; i < vm.data.length; i++) {
          var actstate = vm.data[i].Status_name1;
          var acthour = new Date(vm.data[i].PLC_Timestamp).getHours();
          var actminute = new Date(vm.data[i].PLC_Timestamp).getMinutes();
          vm.charlist.push(actstate);
          if (actminute < 50) {
            if (acthour < 6) {
              for (var j = 0; j < vm.selectday[acthour + 17].cases.length; j++) {
                if (vm.selectday[acthour + 17].cases[j].state == actstate) {
                  vm.selectday[acthour + 17].cases[j].db++;
                }
              }
            }
            else {
              for (var j = 0; j < vm.selectday[acthour - 6].cases.length; j++) {
                if (vm.selectday[acthour - 6].cases[j].state == actstate) {
                  vm.selectday[acthour - 6].cases[j].db++;
                }
              }
            }
          }
          else {
            if (acthour < 6) {
              for (var j = 0; j < vm.selectday[acthour + 18].cases.length; j++) {
                if (vm.selectday[acthour + 18].cases[j].state == actstate) {
                  vm.selectday[acthour + 18].cases[j].db++;
                }
              }
             
            }
            else {
              for (var j = 0; j < vm.selectday[acthour - 5].cases.length; j++) {
                if (vm.selectday[acthour - 5].cases[j].state == actstate) {
                  vm.selectday[acthour - 5].cases[j].db++;
                }
              }
            }
          }
        }
        selectchart(vm.selectday);
        vm.mtfld = false;
      });
    }

    function loadall() {
      vm.alldata = [];

      cl4Service.getall(vm.startdate).then(function (response) {
        vm.alldata = response.data;
      });
    }

    function selectchart(tomb) {
      var resault = [];
      for (var i = 0; i < 24; i++) {
        for (var j = 0; j < tomb[i].cases.length; j++) {
          if (tomb[i].cases[j].state == vm.chartstate) {
              resault.push(tomb[i].cases[j].db);
          }
        }
      }
      setChart(resault);
    }

    function setChart(re) {
      vm.chartconfig = {
        chart: {
          type: 'column',
        },
        title: { text: vm.chartstate },
        series: [
          {
            name: 'Termelt mennyiség',
            color: "#00b300",
            data: re
          }
        ],


        xAxis: [
          { categories: feltolt_hour() },
        ],
        yAxis: {
          title: {
            text: "Keret"
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

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
      loadall();
    }
  }
  Controller.$inject = ['cl4Service', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
