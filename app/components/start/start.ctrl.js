define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.actsm = [];
    vm.allsmsum = [];
    vm.szakok = [];
    vm.actszak = "";
    vm.actshiftnum = null;
    vm.sheetmakers = ["SheetMaker4", "SheetMaker5", "SheetMaker6", "SheetMaker7", "SheetMaker8"];
    vm.loadsheetmakers = [];
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
    vm.szakok[0] = $filter('shift')(1, vm.datum);
    vm.szakok[1] = $filter('shift')(2, vm.datum);
    vm.szakok[2] = $filter('shift')(3, new Date().getTime() - ((5 * 60 + 50) * 60 * 1000));
    vm.load = load;



    function load() {
      selectsm();
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
                  data: [248]
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
  }
  Controller.$inject = ['dataService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
