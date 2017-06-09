define([], function () {
  'use strict';
  function Controller(mapService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.partnumbers = [];
    vm.data = [];
    vm.osszesmodulbokes = [];
    vm.soroszlopbokes = [];
    vm.startdatum = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.startdatumszam = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddatum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.enddatumszam = $filter('date')(new Date(), 'yyyy-MM-dd');
    var tanks = ["Bubble point tank5", "Bubble point tank6", "Bubble point tank7", "Bubble point tank15"];
    var betuk = ["A", "B", "C", "D", "E"];
    var szamok = ["1", "2", "3", "4", "5", "6", "8", "9"];
    vm.sorok = szamok;
    vm.oszlop = betuk;
    vm.load = load;
    vm.beilleszt = beilleszt;

    function beilleszt() {
      var startszam = new Date(vm.startdatum);
      var endszam = new Date(vm.enddatum);
      vm.startdatumszam = $filter('date')(startszam, 'yyyy-MM-dd');
      vm.enddatumszam = $filter('date')(endszam, 'yyyy-MM-dd');
    }

    function feltoltsoroszlop() {
      var a = 0;
      for (var i = 0; i < szamok.length; i++) {
        if (i == 0 || i == 6) {
          for (var j = 0; j < betuk.length; j++) {
            vm.soroszlopbokes[a] = {}
            vm.soroszlopbokes[a].azon = betuk[j] + szamok[i];
            vm.soroszlopbokes[a].bokes = 0;
            vm.soroszlopbokes[a].aeq = 0;
            vm.soroszlopbokes[a].moduls = [];
            a++;
          }
        }
        else {
          for (var j = 0; j < betuk.length - 1; j++) {
            vm.soroszlopbokes[a] = {}
            vm.soroszlopbokes[a].azon = betuk[j] + szamok[i];
            vm.soroszlopbokes[a].bokes = 0;
            vm.soroszlopbokes[a].aeq = 0;
            vm.soroszlopbokes[a].moduls = [];
            a++;
          }
        }
      }
    }

    function getAEQ(tomb, azon) {
      var aeq = 0;
      var szam = azon.substring(2, 9);
      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].id == szam) {
          aeq = parseFloat(tomb[i].aeq);
        }
      }
      return aeq;
    }

    function loadPartnumbers() {
      vm.partnumbers = [];
      mapService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data; 
        console.log(vm.partnumbers);
      });
    }

    function load() {
      vm.data = [];
      vm.osszesmodulbokes = [];
      vm.soroszlopbokes = [];
      feltoltsoroszlop()
      var talalat = 0;
      var a = 0;
      
      for (var i = 0; i < tanks.length; i++) {
        mapService.get(vm.startdatum, vm.enddatum, tanks[i]).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].aeq = getAEQ(vm.partnumbers, response.data[j].modul_id1)
            vm.data.push(response.data[j]);
            for (var k = 0; k < vm.osszesmodulbokes.length; k++) {
              if (response.data[j].modul_id1 == vm.osszesmodulbokes[k].modul) {
                vm.osszesmodulbokes[k].bokes += response.data[j].bt_kat_db1 * 1;
                talalat++;
              }
            }
            if (talalat == 0) {
              vm.osszesmodulbokes[a] = {}
              vm.osszesmodulbokes[a].modul = response.data[j].modul_id1;
              vm.osszesmodulbokes[a].bokes = response.data[j].bt_kat_db1 * 1;
              a++;
            }
            else {
              talalat = 0;
            }
            var actkom = response.data[j].Oszlop + response.data[j].Sor;
            for (var l = 0; l < vm.soroszlopbokes.length; l++) {
              if (actkom == vm.soroszlopbokes[l].azon) {
                var hossz = vm.soroszlopbokes[l].moduls.length;
                var szamvaltozo = new Date(response.data[j].bt_datetime).getHours() * 60 + new Date(response.data[j].bt_datetime).getMinutes();
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

                vm.soroszlopbokes[l].bokes += response.data[j].bt_kat_db1 * 1;
                vm.soroszlopbokes[l].aeq += response.data[j].aeq;
                vm.soroszlopbokes[l].moduls[hossz] = {}
                vm.soroszlopbokes[l].moduls[hossz].modulazon = response.data[j].modul_id1;
                vm.soroszlopbokes[l].moduls[hossz].modulaeq = response.data[j].aeq;
                vm.soroszlopbokes[l].moduls[hossz].modulbokes = response.data[j].bt_kat_db1 * 1;
                vm.soroszlopbokes[l].moduls[hossz].modulbokeshiba = response.data[j].KatName1;
                vm.soroszlopbokes[l].moduls[hossz].moduldatum = $filter('date')(new Date(response.data[j].bt_datetime).getTime(), 'yyyy-MM-dd HH:mm');
                vm.soroszlopbokes[l].moduls[hossz].modulszak = $filter('shift')(szakszam, new Date(response.data[j].bt_datetime).getTime() - (5 * 60 + 50) * 60 * 1000, 'yyyy-MM-dd');
              }
            }
          }
          //console.log(vm.data); 
          console.log(vm.soroszlopbokes);
          //console.log(vm.osszesmodulbokes);
        });
      }
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadPartnumbers();
      load();
      vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    }
  }
  Controller.$inject = ['mapService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});