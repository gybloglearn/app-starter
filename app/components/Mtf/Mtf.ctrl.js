define([], function () {
  'use strict';
  function Controller(MtfService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.mtf = [];
    vm.sumaeq = [];
    vm.sumbokes = [];
    vm.mtfaeqs=[];
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.linktoday = $filter('date')(new Date() - (1000 * 3600) + (15 * 60 * 1000), 'MMddHH');
    vm.linkoldday = $filter('date')(vm.datum, 'MMdd');
    vm.szak_de = $filter('shift')(1, vm.datum);
    vm.szak_du = $filter('shift')(2, vm.datum);
    vm.szak_ej = $filter('shift')(3, vm.datum);
    vm.datumszam = vm.datum;
    vm.load = load;
    vm.load_olddays = load_olddays;
    vm.datszam = beilleszt;

    function beilleszt() {
      vm.szam = new Date(vm.datum);
      vm.datumszam = $filter('date')(vm.szam, 'yyyy-MM-dd');
      vm.szak_de = $filter('shift')(1, vm.datumszam);
      vm.szak_du = $filter('shift')(2, vm.datumszam);
      vm.szak_ej = $filter('shift')(3, vm.datumszam);
    }

    function load() {
      vm.mtf = [];
      vm.mtfaeqs=[];
      vm.sumaeq = [0, 0, 0];
      vm.sumbokes = [0, 0, 0];
      var k=0;
      vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');

      MtfService.gettoday(vm.linktoday).then(function (response) {
        vm.mtf = response.data[0].data;

        for (var i = 0; i < vm.mtf.length; i++) {
          var mystring = vm.mtf[i].name;
          var substring1 = "_BP-OUT";
          var substring2 = "_BOK-BOKES";

          if (mystring.includes(substring1)) {
            mystring = mystring.substr(0, mystring.length - 7);
            for (var j = 0; j < vm.aeqs.length; j++) {
              if (mystring == vm.aeqs[j].name) {
                vm.mtf[i].aeq = vm.mtf[i].amount * vm.aeqs[j].amount;
                vm.mtfaeqs[k] = {};
                vm.mtfaeqs[k].name=mystring;
                vm.mtfaeqs[k].aeq=vm.mtf[i].aeq;
                k++;
              }
            }
            if (vm.mtf[i].shiftnum == 1) {
              vm.sumaeq[0] = vm.sumaeq[0] + vm.mtf[i].aeq;
            }
            else if (vm.mtf[i].shiftnum == 2) {
              vm.sumaeq[1] = vm.sumaeq[1] + vm.mtf[i].aeq;
            }
            else if (vm.mtf[i].shiftnum == 3) {
              vm.sumaeq[2] = vm.sumaeq[2] + vm.mtf[i].aeq;
            }
          }
          else if (mystring.includes(substring2)) {
            mystring = mystring.substr(0, mystring.length - 10);
            for(j=0;j<vm.mtfaeqs.length;j++)
            {
              if(mystring==vm.mtfaeqs[j].name)
              {
                vm.mtf[i].aeq=vm.mtfaeqs[j].aeq;
              }
            }
            if (vm.mtf[i].shiftnum == 1) {
              vm.sumbokes[0] = vm.sumbokes[0] + vm.mtf[i].amount;
            }
            else if (vm.mtf[i].shiftnum == 2) {
              vm.sumbokes[1] = vm.sumbokes[1] + vm.mtf[i].amount;
            }
            else if (vm.mtf[i].shiftnum == 3) {
              vm.sumbokes[2] = vm.sumbokes[2] + vm.mtf[i].amount;
            }
          }
          if (vm.mtf[i].shiftnum == 1) {
            vm.mtf[i].shiftname = $filter('shift')(vm.mtf[i].shiftnum, vm.mtf[i].days);
          }
          else if (vm.mtf[i].shiftnum == 2) {
            vm.mtf[i].shiftname = $filter('shift')(vm.mtf[i].shiftnum, vm.mtf[i].days);
          }
          else if (vm.mtf[i].shiftnum == 3) {
            vm.mtf[i].shiftname = $filter('shift')(vm.mtf[i].shiftnum, vm.mtf[i].days);
          }
          vm.mtf[i].name = $filter('change')(vm.mtf[i].name);
        }
        var tarolo = "";
        for (i = 0; i <= vm.mtf.length - 1; i++) {
          for (j = i + 1; j <= vm.mtf.length - 1; j++) {
            if (vm.mtf[i].amount < vm.mtf[j].amount) {
              tarolo = vm.mtf[i];
              vm.mtf[i] = vm.mtf[j];
              vm.mtf[j] = tarolo;
            }
          }
        }
        var hossz=vm.mtf.length;
        for(var i=0;i<vm.mtf.length;i++)
        {
          if(vm.mtf[i].amount==0)
          {
            vm.mtf.splice(i,hossz);
          }
        }
      });
    }

    function load_olddays() {
      vm.mtf = [];
      vm.mtfaeqs=[];
      vm.sumaeq = [0, 0, 0];
      vm.sumbokes = [0, 0, 0];
      vm.linkoldday = $filter('date')(new Date(vm.datum).getTime() + (24 * 3600 * 1000), 'MMdd');
      var k=0;

      MtfService.getoldday(vm.linkoldday).then(function (response) {
        vm.mtf = response.data[0].data;

        for (var i = 0; i < vm.mtf.length; i++) {
          var mystring = vm.mtf[i].name;
          var substring1 = "_BP-OUT";
          var substring2 = "_BOK-BOKES";

          if (mystring.includes(substring1)) {
            mystring = mystring.substr(0, mystring.length - 7);
            for (var j = 0; j < vm.aeqs.length; j++) {
              if (mystring == vm.aeqs[j].name) {
                vm.mtf[i].aeq = vm.mtf[i].amount * vm.aeqs[j].amount;
                 vm.mtfaeqs[k] = {};
                vm.mtfaeqs[k].name=mystring;
                vm.mtfaeqs[k].aeq=vm.mtf[i].aeq;
                k++;
              }
            }
            if (vm.mtf[i].shiftnum == 1) {
              vm.sumaeq[0] = vm.sumaeq[0] + vm.mtf[i].aeq;
            }
            else if (vm.mtf[i].shiftnum == 2) {
              vm.sumaeq[1] = vm.sumaeq[1] + vm.mtf[i].aeq;
            }
            else if (vm.mtf[i].shiftnum == 3) {
              vm.sumaeq[2] = vm.sumaeq[2] + vm.mtf[i].aeq;
            }
          }
          else if (mystring.includes(substring2)) {
            mystring = mystring.substr(0, mystring.length - 10);
            for(j=0;j<vm.mtfaeqs.length;j++)
            {
              if(mystring==vm.mtfaeqs[j].name)
              {
                vm.mtf[i].aeq=vm.mtfaeqs[j].aeq;
              }
            }
            if (vm.mtf[i].shiftnum == 1) {
              vm.sumbokes[0] = vm.sumbokes[0] + vm.mtf[i].amount;
            }
            else if (vm.mtf[i].shiftnum == 2) {
              vm.sumbokes[1] = vm.sumbokes[1] + vm.mtf[i].amount;
            }
            else if (vm.mtf[i].shiftnum == 3) {
              vm.sumbokes[2] = vm.sumbokes[2] + vm.mtf[i].amount;
            }
          }
          if (vm.mtf[i].shiftnum == 1) {
            vm.mtf[i].shiftname = $filter('shift')(vm.mtf[i].shiftnum, vm.mtf[i].days);
          }
          else if (vm.mtf[i].shiftnum == 2) {
            vm.mtf[i].shiftname = $filter('shift')(vm.mtf[i].shiftnum, vm.mtf[i].days);
          }
          else if (vm.mtf[i].shiftnum == 3) {
            vm.mtf[i].shiftname = $filter('shift')(vm.mtf[i].shiftnum, vm.mtf[i].days);
          }
          vm.mtf[i].name = $filter('change')(vm.mtf[i].name);
        }
        var tarolo = "";
        for (i = 0; i <= vm.mtf.length - 1; i++) {
          for (j = i + 1; j <= vm.mtf.length - 1; j++) {
            if (vm.mtf[i].amount < vm.mtf[j].amount) {
              tarolo = vm.mtf[i];
              vm.mtf[i] = vm.mtf[j];
              vm.mtf[j] = tarolo;
            }
          }
        }
        var hossz=vm.mtf.length;
        for(var i=0;i<vm.mtf.length;i++)
        {
          if(vm.mtf[i].amount==0)
          {
            vm.mtf.splice(i,hossz);
          }
        }
      });
    }
    vm.sdate=new Date().getFullYear() + "-01-01";

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }

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
  Controller.$inject = ['MtfService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
