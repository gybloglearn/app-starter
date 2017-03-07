define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.actsm = [];
    vm.allsmsum = [];
    vm.allplan = [];
    vm.szakok = [];
    vm.plans = [];
    vm.actszak = "";
    vm.tervezett_darab = 0;
    vm.actshiftnum = null;
    vm.smloading = false;
    vm.sheetmakers = ["SheetMaker4", "SheetMaker5", "SheetMaker6", "SheetMaker7", "SheetMaker8"];
    vm.loadsheetmakers = [];
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
    vm.frissites_ideje = $filter('date')(new Date().getTime() + 15 * 60 * 1000, 'yyyy-MM-dd HH:mm');
    vm.szakok[0] = $filter('shift')(1, vm.datum);
    vm.szakok[1] = $filter('shift')(2, vm.datum);
    vm.szakok[2] = $filter('shift')(3, new Date().getTime() - ((5 * 60 + 50) * 60 * 1000));
    vm.load = load;

    function load() {
      selectsm();
      plan();
      vm.smloading = true;
      vm.allsmsum = [];
      var substring1 = "TOTAL";
      var substring2 = "GOOD-GOOD";
      var i = 0;

      angular.forEach(vm.loadsheetmakers, function (v, k) {
        dataService.get(v, vm.datum).then(function (response) {
          var ossz = $filter('sumdb')($filter('filter')(response.data, { 'name': substring1, 'shiftnum': vm.actshiftnum }));
          var jo = $filter('sumdb')($filter('filter')(response.data, { 'name': substring2, 'shiftnum': vm.actshiftnum }));
          vm.allsmsum.push({
            sm: v,
            terv: angular.isUndefined($filter('filter')(vm.plans, { "sm": v })[0])==false?$filter('filter')(vm.plans, { "sm": v })[0].plan:0,
            osszlap: ossz,
            jolap: jo,
            id: "SMchart" + v.substring(11, 10),
            chartconfig: {
              chart: {
                type: 'column',
                width: 300,
                height: 300
              },
              plotOptions: {
                column: {
                  stacking: 'normal'
                }
              },
              title: { text: v },
              series: [
                {
                  name: 'Selejt lap',
                  color: "#990000",
                  data: [ossz - jo],
                  stack: 'Összes lap'
                },
                {
                  name: 'Jó lap',
                  color: "#00b300",
                  data: [jo],
                  stack: 'Összes lap'
                },
                {
                  name: 'Terv',
                  color: "#0033cc",
                  data: [angular.isUndefined($filter('filter')(vm.plans, { "sm": v })[0])==false?$filter('filter')(vm.plans, { "sm": v })[0].plan:0]
                }],

              xAxis: [
                { categories: feltolt_x() },
              ],
              yAxis: {
                title: {
                  text: "Darab"
                }
              }
            }
          });
          vm.smloading = false;
        });
      });


      vm.loadsheetmakers = [];
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      choose();
    }

    function choose() {
      var hour = new Date().getHours();
      var minute = new Date().getMinutes();

      if ((hour == 5 && minute >= 50) || (hour < 13) || (hour == 13 && minute < 50)) {
        vm.actszak = vm.szakok[0];
        vm.actshiftnum = 1;
      }
      else if ((hour == 13 && minute >= 50) || (hour < 21) || (hour == 21 && minute < 50)) {
        vm.actszak = vm.szakok[1];
        vm.actshiftnum = 2;
      }
      else if ((hour == 21 && minute >= 50) || (hour > 21) || (hour < 5) || (hour == 5 && minute < 50)) {
        vm.actszak = vm.szakok[2];
        vm.actshiftnum = 3;
      }
    }

    function feltolt_x() {
      var szoveg = ["Tény/Terv"];
      return szoveg;
    }

    function date_refresh() {
      vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
      vm.frissites_ideje = $filter('date')(new Date().getTime() + 15 * 60 * 1000, 'yyyy-MM-dd HH:mm');
    }

    var refreshload = setInterval(load, 15 * 60 * 1000);
    var refreshchoose = setInterval(choose, 15 * 60 * 1000);
    var refreshdate = setInterval(date_refresh, 15 * 60 * 1000);
    var refreshpeace = setInterval(plan, 15 * 60 * 1000);

    function selectsm() {
      var a = 0;
      if (vm.oksm4 == true) {
        vm.loadsheetmakers[a] = vm.sheetmakers[0];
        a++;
      }
      if (vm.oksm5 == true) {
        vm.loadsheetmakers[a] = vm.sheetmakers[1];
        a++;
      }
      if (vm.oksm6 == true) {
        vm.loadsheetmakers[a] = vm.sheetmakers[2];
        a++;
      }
      if (vm.oksm7 == true) {
        vm.loadsheetmakers[a] = vm.sheetmakers[3];
        a++;
      }
      if (vm.oksm8 == true) {
        vm.loadsheetmakers[a] = vm.sheetmakers[4];
        a++;
      }
    }

    function plan() {
      selectsm();
      var frissites = $filter('date')(new Date().getTime(), 'yyyy-MM-dd HH:mm');
      vm.plans = [];

      angular.forEach(vm.loadsheetmakers, function (v, k) {
        dataService.getplan(v, vm.datum).then(function (response) {
          vm.allplan = response.data;
          var szorzo = new Date(frissites).getHours() * 60 + new Date(frissites).getMinutes();
          for (var i = 0; i < vm.allplan.length; i++) {
            vm.tervezett = 0;
            var szam = 0;
            vm.tervezett_darab = 0;

            if (vm.actshiftnum == 1) {
              var szorzo = new Date(frissites).getHours() * 60 + new Date(frissites).getMinutes();
              vm.tervezett = vm.tervezett + (parseInt(vm.allplan[i].amountshift1) * parseInt(vm.allplan[i].sheetnumber));
              szorzo = szorzo - (350);
              szam = (vm.tervezett / 480) * szorzo;
              vm.tervezett_darab = Math.round(szam);
            }
            else if (vm.actshiftnum == 2) {
              var szorzo = new Date(frissites).getHours() * 60 + new Date(frissites).getMinutes();
              vm.tervezett = vm.tervezett + (parseInt(vm.allplan[i].amountshift2) * parseInt(vm.allplan[i].sheetnumber));
              szorzo = szorzo - (830);
              szam = (vm.tervezett / 480) * szorzo;
              vm.tervezett_darab = Math.round(szam);
            }
            else if (vm.actshiftnum == 3) {
              var szorzo = new Date(frissites).getHours() * 60 + new Date(frissites).getMinutes();
              vm.tervezett = vm.tervezett + (parseInt(vm.allplan[i].amountshift3) * parseInt(vm.allplan[i].sheetnumber));
              if (szorzo >= 1310) {
                szorzo = szorzo - (1310);
                szam = (vm.tervezett / 480) * szorzo;
                vm.tervezett_darab = Math.round(szam);
                if (vm.tervezett_darab > vm.tervezett) {
                  vm.tervezett_darab = vm.tervezett;
                }
              }
              else {
                var plus = 130;
                szorzo = szorzo + plus;
                szam = (vm.tervezett / 480) * szorzo;
                vm.tervezett_darab = Math.round(szam);
                if (vm.tervezett_darab > vm.tervezett) {
                  vm.tervezett_darab = vm.tervezett;
                }
              }
            }
            vm.plans.push({ "sm": vm.allplan[i].sm, "plan": 0 });

            for (var j = 0; j < vm.plans.length; j++) {
              if (vm.allplan[i].sm == vm.plans[j].sm) {
                vm.plans[j].plan = vm.plans[j].plan + vm.tervezett_darab;
              }
            }
            console.log(vm.plans);
          }
        });
      });

    }
  }
  Controller.$inject = ['dataService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
