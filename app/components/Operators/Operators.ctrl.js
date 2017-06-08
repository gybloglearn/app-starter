define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.operators = [];
    vm.OP = [];
    vm.data = [];
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.actmachine = "Potting4";
    vm.phasenumbers = [0, 1, 2, 3, 4, 5, 6, 7];
    vm.Pottings = ["Potting3", "Potting4"];
    vm.hely = ["Potting be", "Előkészítés alsó", "Gélberakás alsó", "Esztétika alsó", "Forgatás", "Gélberakás felső", "Esztétika felső", "Potting ki"];
    vm.szakok = [1, 2, 3]
    vm.load = load;
    vm.beallit = beallit;
    vm.actshiftnum = 1;
    //vm.dis = false;

    function beallit() {
      vm.datumszam = $filter('date')(new Date(vm.datum).getTime(), 'yyyy-MM-dd');
    }

    function load() {
      vm.dis = true;
      vm.OP = [];
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

          for (var l = 0; l < vm.data[v].length; l++) {
            var szam = new Date(vm.data[v][l].startdate);
            var szamvaltozo=szam.getHours()*60+szam.getMinutes();
            var seged = $filter('date')(szam.getTime()-(5 * 60 + 50) * 60 * 1000, 'yyyy-MM-dd');
            console.log(seged);
            var szakszam = 0;
            if (szamvaltozo >= 350 && szamvaltozo < 830) {
              szakszam = 1;
            }
            else if (szamvaltozo >= 830 && szamvaltozo < 1310) {
              szakszam = 2;
            }
            else {
              szakszam = 3;
            }

            vm.data[v][l].shift = $filter('shift')(szakszam, seged);
            vm.data[v][l].shiftnumber = szakszam;
          }
          
          vm.operators[v] = {}
          vm.operators[v].name = vm.hely[v];
          vm.operators[v].operator = [];
          var talalat = 0;
          var a = 0;

          for (var i = 0; i < vm.data[v].length; i++) {
            if (vm.actshiftnum == vm.data[v][i].shiftnumber) {
              var actoperator = vm.data[v][i].operator;
              for (var j = 0; j < vm.operators[v].operator.length; j++) {
                if (actoperator == vm.operators[v].operator[j].id) {
                  vm.operators[v].operator[j].db++;
                  talalat++;
                }
              }
              if (talalat == 0) {
                vm.operators[v].operator[a] = {}
                vm.operators[v].operator[a].shift = vm.data[v][i].shift;
                vm.operators[v].operator[a].id = actoperator;
                vm.operators[v].operator[a].db = 1;
                a++;
              }
              else {
                talalat = 0;
              }
            }
          }
          vm.OP.push({
            sor: v,
            place: vm.operators[v].name,
            operatorok: feltoltopazonosito(vm.operators[v].operator)
          });
          vm.dis = false;
        });
      });
    }


    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }

    function feltoltopazonosito(tomb) {
      var a = 0;
      var opk = [];
      for (var i = 0; i < tomb.length; i++) {
        opk[a] = "Operátor:" + tomb[i].id + " - " + tomb[i].db + "db";
        a++;
      }
      return opk;
    }

  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
