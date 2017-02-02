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
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.szakok[0] = $filter('shift')(1, vm.datum);
    vm.szakok[1] = $filter('shift')(2, vm.datum);
    vm.szakok[2] = $filter('shift')(3, new Date().getTime() - ((5 * 60 + 50) * 60 * 1000));

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      choose();
      load();
    }

    function load() {
      PottingService.get(vm.allpotting[0], vm.datum).then(function (response) {
        vm.potting4 = response.data;
        var dbbe4 = 0;
        var dbford4 = 0;
        var dbki4 = 0;
        var aeqbe4 = 0;
        var aeqford4 = 0;
        var aeqki4 = 0;
        for (var i = 0; i < vm.potting4.length; i++) {
          var mystring = vm.potting4[i].name;
          var substring1 = "_IN-IN";
          var substring2 = "_P3-P3";
          var substring3 = "_OUT-OUT";
          if (vm.potting4[i].shiftnum == vm.actshiftnum && mystring.includes(substring1)) {
            mystring = mystring.substr(0, mystring.length - 6);
            for (var j = 0; j < vm.aeqs.length; j++) {
              if (mystring == vm.aeqs[j].name) {
                vm.potting4[i].aeq = vm.potting4[i].amount * vm.aeqs[j].amount;
              }
            }
            dbbe4 = dbbe4 + vm.potting4[i].amount;
            aeqbe4 = aeqbe4 + vm.potting4[i].aeq;
          }
          else if (vm.potting4[i].shiftnum == vm.actshiftnum && mystring.includes(substring2)) {
            mystring = mystring.substr(0, mystring.length - 6);
            for (var j = 0; j < vm.aeqs.length; j++) {
              if (mystring == vm.aeqs[j].name) {
                vm.potting4[i].aeq = vm.potting4[i].amount * vm.aeqs[j].amount;
              }
            }
            dbford4 = dbford4 + vm.potting4[i].amount;
            aeqford4 = aeqford4 + vm.potting4[i].aeq;
          }
          else if (vm.potting4[i].shiftnum == vm.actshiftnum && mystring.includes(substring3)) {
            mystring = mystring.substr(0, mystring.length - 8);
            for (var j = 0; j < vm.aeqs.length; j++) {
              if (mystring == vm.aeqs[j].name) {
                vm.potting4[i].aeq = vm.potting4[i].amount * vm.aeqs[j].amount;
              }
            }
            dbki4 = dbki4 + vm.potting4[i].amount;
            aeqki4 = aeqki4 + vm.potting4[i].aeq;
          }
        }
        aeqbe4.toFixed(2);
        aeqford4.toFixed(2);
        aeqki4.toFixed(2);

        vm.dbchartconfig4 = {
          chart: {
            type: 'column',
            width: 400,
            height: 300
          },
          title: { text: vm.allpotting[0] + "-Darab" },
          series: [
            {
              name: 'Be',
              color: "#0033cc",
              data: [dbbe4]
            },
            {
              name: 'Fordít',
              color: "#ff9900",
              data: [dbford4]
            },
            {
              name: 'Ki',
              color: "#00b300",
              data: [dbki4]
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
        vm.chartconfig4 = {
          chart: {
            type: 'column',
            width: 400,
            height: 300
          },
          title: { text: vm.allpotting[0] + "-AEQ" },
          series: [
            {
              name: 'Be',
              color: "#0033cc",
              data: [aeqbe4]
            },
            {
              name: 'Fordít',
              color: "#ff9900",
              data: [aeqford4]
            },
            {
              name: 'Ki',
              color: "#00b300",
              data: [aeqki4]
            }],

          xAxis: [
            { categories: feltolt_x() },
          ],
          yAxis: {
            title: {
              text: "AEQ"
            }
          },
        };
      });
      PottingService.get(vm.allpotting[1], vm.datum).then(function (response) {
        vm.potting3 = response.data;
        var dbbe3 = 0;
        var dbford3 = 0;
        var dbki3 = 0;
        var aeqbe3 = 0;
        var aeqford3 = 0;
        var aeqki3 = 0;
        for (var i = 0; i < vm.potting3.length; i++) {
          var mystring = vm.potting3[i].name;
          var substring1 = "_IN-IN";
          var substring2 = "_P3-P3";
          var substring3 = "_OUT-OUT";
          if (vm.potting3[i].shiftnum == vm.actshiftnum && mystring.includes(substring1)) {
            mystring = mystring.substr(0, mystring.length - 6);
            for (var j = 0; j < vm.aeqs.length; j++) {
              if (mystring == vm.aeqs[j].name) {
                vm.potting3[i].aeq = vm.potting3[i].amount * vm.aeqs[j].amount;
              }
            }
            dbbe3 = dbbe3 + vm.potting3[i].amount;
            aeqbe3 = aeqbe3 + vm.potting3[i].aeq;
          }
          else if (vm.potting3[i].shiftnum == vm.actshiftnum && mystring.includes(substring2)) {
            mystring = mystring.substr(0, mystring.length - 6);
            for (var j = 0; j < vm.aeqs.length; j++) {
              if (mystring == vm.aeqs[j].name) {
                vm.potting3[i].aeq = vm.potting3[i].amount * vm.aeqs[j].amount;
              }
            }
            dbford3 = dbford3 + vm.potting3[i].amount;
            aeqford3 = aeqford3 + vm.potting3[i].aeq;
          }
          else if (vm.potting3[i].shiftnum == vm.actshiftnum && mystring.includes(substring3)) {
            mystring = mystring.substr(0, mystring.length - 8);
            for (var j = 0; j < vm.aeqs.length; j++) {
              if (mystring == vm.aeqs[j].name) {
                vm.potting3[i].aeq = vm.potting3[i].amount * vm.aeqs[j].amount;
              }
            }
            dbki3 = dbki3 + vm.potting3[i].amount;
            aeqki3 = aeqki3 + vm.potting3[i].aeq;
          }
        }
        aeqbe3.toFixed(2);
        aeqford3.toFixed(2);
        aeqki3.toFixed(2);

        vm.dbchartconfig3 = {
          chart: {
            type: 'column',
            width: 400,
            height: 300
          },
          title: { text: vm.allpotting[1] + "-Darab" },
          series: [
            {
              name: 'Be',
              color: "#0033cc",
              data: [dbbe3]
            },
            {
              name: 'Fordít',
              color: "#ff9900",
              data: [dbford3]
            },
            {
              name: 'Ki',
              color: "#00b300",
              data: [dbki3]
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
        vm.chartconfig3 = {
          chart: {
            type: 'column',
            width: 400,
            height: 300
          },
          title: { text: vm.allpotting[1] + "-AEQ" },
          series: [
            {
              name: 'Be',
              color: "#0033cc",
              data: [aeqbe3]
            },
            {
              name: 'Fordít',
              color: "#ff9900",
              data: [aeqford3]
            },
            {
              name: 'Ki',
              color: "#00b300",
              data: [aeqki3]
            }],

          xAxis: [
            { categories: feltolt_x() },
          ],
          yAxis: {
            title: {
              text: "AEQ"
            }
          },
        };
      });
      PottingService.get(vm.allpotting[2], vm.datum).then(function (response) {
        vm.potting2 = response.data;
        var dbbe2 = 0;
        var dbford2 = 0;
        var dbki2 = 0;
        var aeqbe2 = 0;
        var aeqford2 = 0;
        var aeqki2 = 0;
        for (var i = 0; i < vm.potting2.length; i++) {
          var mystring = vm.potting2[i].name;
          var substring1 = "_IN-IN";
          var substring2 = "_P3-P3";
          var substring3 = "_OUT-OUT";
          if (vm.potting2[i].shiftnum == vm.actshiftnum && mystring.includes(substring1)) {
            mystring = mystring.substr(0, mystring.length - 6);
            for (var j = 0; j < vm.aeqs.length; j++) {
              if (mystring == vm.aeqs[j].name) {
                vm.potting2[i].aeq = vm.potting2[i].amount * vm.aeqs[j].amount;
              }
            }
            dbbe2 = dbbe2 + vm.potting2[i].amount;
            aeqbe2 = aeqbe2 + vm.potting2[i].aeq;
          }
          else if (vm.potting2[i].shiftnum == vm.actshiftnum && mystring.includes(substring2)) {
            mystring = mystring.substr(0, mystring.length - 6);
            for (var j = 0; j < vm.aeqs.length; j++) {
              if (mystring == vm.aeqs[j].name) {
                vm.potting2[i].aeq = vm.potting2[i].amount * vm.aeqs[j].amount;
              }
            }
            dbford2 = dbford2 + vm.potting2[i].amount;
            aeqford2 = aeqford2 + vm.potting2[i].aeq;
          }
          else if (vm.potting2[i].shiftnum == vm.actshiftnum && mystring.includes(substring3)) {
            mystring = mystring.substr(0, mystring.length - 8);
            for (var j = 0; j < vm.aeqs.length; j++) {
              if (mystring == vm.aeqs[j].name) {
                vm.potting2[i].aeq = vm.potting2[i].amount * vm.aeqs[j].amount;
              }
            }
            dbki2 = dbki2 + vm.potting2[i].amount;
            aeqki2 = aeqki2 + vm.potting2[i].aeq;
          }
        }
        aeqbe2.toFixed(2);
        aeqford2.toFixed(2);
        aeqki2.toFixed(2);

        vm.dbchartconfig2 = {
          chart: {
            type: 'column',
            width: 400,
            height: 300
          },
          title: { text: vm.allpotting[2] + "-Darab" },
          series: [
            {
              name: 'Be',
              color: "#0033cc",
              data: [dbbe2]
            },
            {
              name: 'Fordít',
              color: "#ff9900",
              data: [dbford2]
            },
            {
              name: 'Ki',
              color: "#00b300",
              data: [dbki2]
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
        vm.chartconfig2 = {
          chart: {
            type: 'column',
            width: 400,
            height: 300
          },
          title: { text: vm.allpotting[2] + "-AEQ" },
          series: [
            {
              name: 'Be',
              color: "#0033cc",
              data: [aeqbe2]
            },
            {
              name: 'Fordít',
              color: "#ff9900",
              data: [aeqford2]
            },
            {
              name: 'Ki',
              color: "#00b300",
              data: [aeqki2]
            }],

          xAxis: [
            { categories: feltolt_x() },
          ],
          yAxis: {
            title: {
              text: "AEQ"
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
      else if ((hour == 21 && minute >= 50) || (hour > 21) || (hour < 5) || (hour == 5 && minute < 50)) {
        vm.actszak = vm.szakok[2];
        vm.actshiftnum = 3;
      }
    }

    function feltolt_x() {
      var szoveg = ["Be/Fordít/Ki"];
      return szoveg;
    }

    vm.aeqs = [
      { name: "Ds12 FLOW", amount: 0.6 },
      { name: "DS-D12 FLOW", amount: 0.6 },
      { name: "ZW220 CP5", amount: 0.44 },
      { name: "ZW220 FLOW", amount: 0.44 },
      { name: "ZW230 FLOW", amount: 0.46 },
      { name: "ZW230 CP5", amount: 0.46 },
      { name: "C11CP5", amount: 0.5 },
      { name: "C11 CP5", amount: 0.5 },
      { name: "C11FLOW", amount: 0.5 },
      { name: "C11 FLOW", amount: 0.5 },
      { name: "D11 CP5", amount: 0.68 },
      { name: "D13 CP5", amount: 0.88 },
      { name: "D13 CP", amount: 0.88 },
      { name: "D12 FLOW", amount: 0.74 },
      { name: "D11 FLOW", amount: 0.68 },
      { name: "A27 CP5", amount: 1 },
      { name: "A27_CP5", amount: 1 },
      { name: "A27 FLOW", amount: 1 },
      { name: "A27_FLOW", amount: 1 },
      { name: "B32 CP5", amount: 1.3 },
      { name: "B32_CP5", amount: 1.3 },
      { name: "B32 FLOW", amount: 1.3 },
      { name: "B32_FLOW", amount: 1.3 },
      { name: "DS- D13 CP5", amount: 0.7 },
      { name: "DS-D11 FLOW", amount: 0 },
      { name: "DS-D11 CP5", amount: 0 },
      { name: "DS-D13 CP5", amount: 0.7 },
      { name: "ZB500S", amount: 0.6 },
      { name: "D11 K", amount: 0 }
    ];
  }

  Controller.$inject = ['PottingService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
