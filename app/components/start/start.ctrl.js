define([], function () {
  'use strict';
  function Controller(PottingService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.potting4 = [];
    vm.potting3 = [];
    vm.potting2 = [];
    vm.szakok = [];
    vm.actszak = "";
    vm.actshiftnum = null;
    vm.allpotting = ["Potting4", "Potting3", "Potting2"];
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.szakok[0] = $filter('shift')(1, vm.datum);
    vm.szakok[1] = $filter('shift')(2, vm.datum);
    vm.szakok[2] = $filter('shift')(3, vm.datum);

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      choose();
      load();
    }

    function load() {
      PottingService.get(vm.allpotting[0], vm.datum).then(function (response) {
        vm.potting4 = response.data;
        var be4 = 0;
        var ford4 = 0;
        var ki4 = 0;
        for (var i = 0; i < vm.potting4.length; i++) {
          var mystring = vm.potting4[i].name;
          var substring1 = "_IN-IN";
          var substring2 = "_P3-P3";
          var substring3 = "_OUT-OUT";
          if (vm.potting4[i].shiftnum == vm.actshiftnum && mystring.includes(substring1)) {
            be4 = be4 + vm.potting4[i].amount;
          }
          else if (vm.potting4[i].shiftnum == vm.actshiftnum && mystring.includes(substring2)) {
            ford4 = ford4 + vm.potting4[i].amount;
          }
          else if (vm.potting4[i].shiftnum == vm.actshiftnum && mystring.includes(substring3)) {
            ki4 = ki4 + vm.potting4[i].amount;
          }
        }

        vm.chartconfig4 = {
          chart: {
            type: 'column',
            width: 400,
            height: 300
          },
          title: { text: vm.allpotting[0] },
          series: [
            {
              name: 'Be',
              color: "#0033cc",
              data: [be4]
            },
            {
              name: 'Fordít',
              color: "#ff9900",
              data: [ford4]
            },
            {
              name: 'Ki',
              color: "#00b300",
              data: [ki4]
            }],

          xAxis: [
            { categories: feltolt_x() },
          ],
          yAxis: {
            title: {
              text: "Darab"
            }
          },
        };
      });
      PottingService.get(vm.allpotting[1], vm.datum).then(function (response) {
        vm.potting3 = response.data;
        var be3 = 0;
        var ford3 = 0;
        var ki3 = 0;
        for (var i = 0; i < vm.potting3.length; i++) {
          var mystring = vm.potting3[i].name;
          var substring1 = "_IN-IN";
          var substring2 = "_P3-P3";
          var substring3 = "_OUT-OUT";
          if (vm.potting3[i].shiftnum == vm.actshiftnum && mystring.includes(substring1)) {
            be3 = be3 + vm.potting3[i].amount;
          }
          else if (vm.potting3[i].shiftnum == vm.actshiftnum && mystring.includes(substring2)) {
            ford3 = ford3 + vm.potting3[i].amount;
          }
          else if (vm.potting3[i].shiftnum == vm.actshiftnum && mystring.includes(substring3)) {
            ki3 = ki3 + vm.potting3[i].amount;
          }
        }

        vm.chartconfig3 = {
          chart: {
            type: 'column',
            width: 400,
            height: 300
          },
          title: { text: vm.allpotting[1] },
          series: [
            {
              name: 'Be',
              color: "#0033cc",
              data: [be3]
            },
            {
              name: 'Fordít',
              color: "#ff9900",
              data: [ford3]
            },
            {
              name: 'Ki',
              color: "#00b300",
              data: [ki3]
            }],

          xAxis: [
            { categories: feltolt_x() },
          ],
          yAxis: {
            title: {
              text: "Darab"
            }
          },
        };
      });
      PottingService.get(vm.allpotting[2], vm.datum).then(function (response) {
        vm.potting2 = response.data;
        var be2 = 0;
        var ford2 = 0;
        var ki2 = 0;
        for (var i = 0; i < vm.potting2.length; i++) {
          var mystring = vm.potting2[i].name;
          var substring1 = "_IN-IN";
          var substring2 = "_P3-P3";
          var substring3 = "_OUT-OUT";
          if (vm.potting2[i].shiftnum == vm.actshiftnum && mystring.includes(substring1)) {
            be2 = be2 + vm.potting2[i].amount;
          }
          else if (vm.potting2[i].shiftnum == vm.actshiftnum && mystring.includes(substring2)) {
            ford2 = ford2 + vm.potting2[i].amount;
          }
          else if (vm.potting2[i].shiftnum == vm.actshiftnum && mystring.includes(substring3)) {
            ki2 = ki2 + vm.potting2[i].amount;
          }
        }

        vm.chartconfig2 = {
          chart: {
            type: 'column',
            width: 400,
            height: 300
          },
          title: { text: vm.allpotting[2] },
          series: [
            {
              name: 'Be',
              color: "#0033cc",
              data: [be2]
            },
            {
              name: 'Fordít',
              color: "#ff9900",
              data: [ford2]
            },
            {
              name: 'Ki',
              color: "#00b300",
              data: [ki2]
            }],

          xAxis: [
            { categories: feltolt_x() },
          ],
          yAxis: {
            title: {
              text: "Darab"
            }
          },
        };
      });
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
      else if ((hour == 21 && minute >= 50) || (hour < 5) || (hour == 5 && minute < 50)) {
        vm.actszak = vm.szakok[2];
        vm.actshiftnum = 3;
      }
    }

    function feltolt_x() {
      var szoveg = ["Be/Fordít/Ki"];
      return szoveg;
    }
  }

  Controller.$inject = ['PottingService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
