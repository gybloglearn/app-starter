define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.szakok = [];
    vm.mtfday = [];
    vm.flow = [];
    vm.cp5 = [];
    vm.sumdb = [];
    vm.sumaeq = [];
    vm.sumbokes = [];
    vm.actszak = "";
    vm.actshiftnum = null;
    vm.mtfloading = true;
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
    vm.frissites_ideje = $filter('date')(new Date().getTime()+15*60*1000, 'yyyy-MM-dd HH:mm');
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.szakok[0] = $filter('shift')(1, vm.datum);
    vm.szakok[1] = $filter('shift')(2, vm.datum);
    vm.szakok[2] = $filter('shift')(3, new Date().getTime() - ((5 * 60 + 50) * 60 * 1000));

    function load() {
      vm.mtfloading = true;
      vm.mtfday = [];
      vm.flow = [];
      vm.cp5 = [];
      vm.sumdb = [0, 0];
      vm.sumaeq = [0, 0];
      vm.sumbokes = [0, 0];
      var k = 0;
      var l = 0;

      dataService.get(vm.datum).then(function (response) {
        vm.mtfday = response.data;

        for (var i = 0; i < vm.mtfday.length; i++) {
          var mystring = vm.mtfday[i].name;
          var substring1 = "_BP-OUT";

          if (mystring.includes(substring1)) {
            for (var j = 0; j < vm.aeqs.length; j++) {
              var actstring = vm.aeqs[j].name;
              if (mystring.includes(actstring)) {
                vm.mtfday[i].aeq = vm.mtfday[i].amount * vm.aeqs[j].amount;
              }
            }
          }
        }

        for (var i = 0; i < vm.mtfday.length; i++) {
          var mystring = vm.mtfday[i].name;
          var substring1 = "FLOW";
          var substring2 = "CP5";
          var substring3 = "ZB500";
          if ((mystring.includes(substring1) || mystring.includes(substring3)) && vm.mtfday[i].shiftnum == vm.actshiftnum && vm.mtfday[i].amount > 0) {
            vm.flow[k] = vm.mtfday[i];
            k++
          }
          else if (mystring.includes(substring2) && vm.mtfday[i].shiftnum == vm.actshiftnum && vm.mtfday[i].amount > 0) {
            vm.cp5[l] = vm.mtfday[i];
            l++
          }
        }

        for (var i = 0; i < vm.flow.length; i++) {
          var mystring = vm.flow[i].name;
          var substring1 = "_BP-OUT";
          var substring2 = "_BOK-BOKES";

          if (mystring.includes(substring1) && vm.flow[i].shiftnum == vm.actshiftnum) {
            vm.sumdb[0] = vm.sumdb[0] + vm.flow[i].amount;
            vm.sumaeq[0] = vm.sumaeq[0] + vm.flow[i].aeq;
          }
          else if (mystring.includes(substring2) && vm.flow[i].shiftnum == vm.actshiftnum) {
            vm.sumbokes[0] = vm.sumbokes[0] + vm.flow[i].amount;
          }
        }
        for (var i = 0; i < vm.cp5.length; i++) {
          var mystring = vm.cp5[i].name;
          var substring1 = "_BP-OUT";
          var substring2 = "_BOK-BOKES";

          if (mystring.includes(substring1) && vm.cp5[i].shiftnum == vm.actshiftnum) {
            vm.sumdb[1] = vm.sumdb[1] + vm.cp5[i].amount;
            vm.sumaeq[1] = vm.sumaeq[1] + vm.cp5[i].aeq;
          }
          else if (mystring.includes(substring2) && vm.cp5[i].shiftnum == vm.actshiftnum) {
            vm.sumbokes[1] = vm.sumbokes[1] + vm.cp5[i].amount;
          }
        }
        vm.mtfloading = false;
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      choose();
      load();
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

    function date_refresh()
    {
      vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
      vm.frissites_ideje = $filter('date')(new Date().getTime()+15*60*1000, 'yyyy-MM-dd HH:mm');
    }

    var refreshload = setInterval(load, 15*60*1000);
    var refreshchoose = setInterval(choose, 15*60*1000);
    var refreshdate = setInterval(date_refresh, 15*60*1000);

    vm.aeqs = [
      { name: "Ds12 FLOW", amount: 0.6 },
      { name: "DS12FLOW", amount: 0.6 },
      { name: "ZW220 CP5", amount: 0.44 },
      { name: "ZW230 FLOW", amount: 0.46 },
      { name: "ZW230 CP5", amount: 0.46 },
      { name: "C11CP5", amount: 0.5 },
      { name: "C11 CP5", amount: 0.5 },
      { name: "C11FLOW", amount: 0.5 },
      { name: "C11 FLOW", amount: 0.5 },
      { name: "D11 CP5", amount: 0.68 },
      { name: "D13 CP5", amount: 0.88 },
      { name: "D12 FLOW", amount: 0.74 },
      { name: "D11 FLOW", amount: 0.68 },
      { name: "A27 CP5", amount: 1 },
      { name: "A27 FLOW", amount: 1 },
      { name: "B32 CP5", amount: 1.3 },
      { name: "B32 FLOW", amount: 1.3 },
      { name: "DS- D13 CP5", amount: 0.7 },
      { name: "DS13CP5", amount: 0.7 },
      { name: "ZB500S", amount: 0.6 }
    ];
  }
  Controller.$inject = ['dataService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
