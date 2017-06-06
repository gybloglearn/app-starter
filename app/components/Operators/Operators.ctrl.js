define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.operators = [];
    vm.data = [];
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.actmachine = "Potting4";
    vm.phasenumbers = [0, 1, 2, 3, 4, 5, 6, 7];
    vm.Pottings = ["Potting3", "Potting4"];
    vm.hely = ['Potting be', 'Előkészítés alsó', 'Gélberakás alsó', 'Esztétika alsó', 'Forgatás', 'Gélberakás felső', 'Esztétika felső', 'Potting ki'];
    vm.load = load;
    vm.beallit=beallit;
    //vm.dis = false;

    function beallit(){
      vm.datumszam=$filter('date')(new Date(vm.datum).getTime(), 'yyyy-MM-dd');
    }

    function load() {
      vm.dis = true;
      vm.operators = [];
      vm.data = [];
      var a = 0;
      angular.forEach(vm.phasenumbers, function (v, k) {
        var talalat = 0;
        dataService.get(vm.datum, vm.actmachine, v).then(function (response) {
          vm.data[v] = [];
          for (var i = 0; i < response.data.length; i++) {
            response.data[i].machinename = vm.hely[v];
          }
          vm.data[v] = response.data;
          for (var j = 0; j < vm.data[v].length; j++) {
            for (var k = 0; k < vm.operators.length; k++) {
              if (vm.data[v][j].operator == vm.operators[k].id) {
                vm.operators[k].db++;
                talalat++;
              }
            }
            if (talalat > 0) {
              talalat = 0;
              a = a;
            }
            else {
              if (vm.data[v][j].operator != "0") {
                vm.operators[a] = {}
                vm.operators[a].id = vm.data[v][j].operator;
                vm.operators[a].db = 1;
                a++
              }
            }
          }
          setChart(vm.actmachine);
          vm.dis = false;
        });
      });
    }

    function setChart(nowpotting) {
      vm.chartconfig = {
        chart: {
          type: 'column',
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        title: { text: "Munkaidő/kieső idő arányok" },
        series: [
          {
            name: 'Kieső idő',
            color: "#ff9821",
            data: feltolt_x_kieso(vm.operators),
            stack: 'Összes idő'
          },
          {
            name: 'Munkaidő',
            color: "#005cb9",
            data: feltolt_x_hasznos(vm.operators),
            stack: 'Összes idő'
          }
        ],
        xAxis: [
          {
            categories: feltolt_y(vm.operators),
            title: { text: "Operátor" }
          },
        ],
        yAxis: {
          title: {
            text: "Idő(Perc)"
          }
        },
      }
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }

    function feltolt_x_hasznos(tomb) {
      var x_adatok = [];
      for (var i = 0; i < tomb.length; i++) {
        x_adatok[i] = tomb[i].db * 8.5;
      }
      return x_adatok;
    }

    function feltolt_x_kieso(tomb) {
      var x_adatok = [];
      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].db * 8.5 < 450) {
          x_adatok[i] = 450 - (tomb[i].db * 8.5);
        }
        else {
          x_adatok[i] = 0;
        }
      }
      return x_adatok;
    }

    function feltolt_y(tomb) {
      var y_adatok = [];
      for (var i = 0; i < tomb.length; i++) {
        y_adatok[i] = tomb[i].id;
      }
      return y_adatok;
    }
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
