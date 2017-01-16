define([], function () {
  'use strict';
  function Controller(PottingService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.p = [];
    vm.moredays = [];
    vm.shiftid = null;
    vm.inpotting_de = [];
    vm.p3potting_de = [];
    vm.outpotting_de = [];
    vm.suminpotting_de = 0;
    vm.suminpotting_de_aeq = 0;
    vm.sump3potting_de = 0;
    vm.sump3potting_de_aeq = 0;
    vm.sumoutpotting_de = 0;
    vm.sumoutpotting_de_aeq = 0;
    vm.inpotting_du = [];
    vm.p3potting_du = [];
    vm.outpotting_du = [];
    vm.suminpotting_du = 0;
    vm.suminpotting_du_aeq = 0;
    vm.sump3potting_du = 0;
    vm.sump3potting_du_aeq = 0;
    vm.sumoutpotting_du = 0;
    vm.sumoutpotting_du_aeq = 0;
    vm.inpotting_ej = [];
    vm.p3potting_ej = [];
    vm.outpotting_ej = [];
    vm.suminpotting_ej = 0;
    vm.suminpotting_ej_aeq = 0;
    vm.sump3potting_ej = 0;
    vm.sump3potting_ej_aeq = 0;
    vm.sumoutpotting_ej = 0;
    vm.sumoutpotting_ej_aeq = 0;
    vm.mch = "Potting4"
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.allpotting = ["Potting4", "Potting3", "Potting2"];
    vm.szak_de=$filter('shift')(1,vm.datum);
    vm.szak_du=$filter('shift')(2,vm.datum);
    vm.szak_ej=$filter('shift')(3,vm.datum);
    vm.load = load;
    vm.load_more=load_more;
    vm.datumszam = vm.datum;

    vm.datszam = csere;
    function csere() {
      vm.szam = new Date(vm.datum);
      vm.datumszam = $filter('date')(vm.szam, 'yyyy-MM-dd');
      vm.szak_de=$filter('shift')(1,vm.datumszam);
      vm.szak_du=$filter('shift')(2,vm.datumszam);
      vm.szak_ej=$filter('shift')(3,vm.datumszam);
    }


    function load(mch, datum) {
      vm.dis=true;
      vm.shiftid = null;
      vm.p = [];
      vm.inpotting_de = [];
      vm.p3potting_de = [];
      vm.outpotting_de = [];
      vm.suminpotting_de = 0;
      vm.suminpotting_de_aeq = 0;
      vm.sump3potting_de = 0;
      vm.sump3potting_de_aeq = 0;
      vm.sumoutpotting_de = 0;
      vm.sumoutpotting_de_aeq = 0;
      vm.inpotting_du = [];
      vm.p3potting_du = [];
      vm.outpotting_du = [];
      vm.suminpotting_du = 0;
      vm.suminpotting_du_aeq = 0;
      vm.sump3potting_du = 0;
      vm.sump3potting_du_aeq = 0;
      vm.sumoutpotting_du = 0;
      vm.sumoutpotting_du_aeq = 0;
      vm.inpotting_ej = [];
      vm.p3potting_ej = [];
      vm.outpotting_ej = [];
      vm.suminpotting_ej = 0;
      vm.suminpotting_ej_aeq = 0;
      vm.sump3potting_ej = 0;
      vm.sump3potting_ej_aeq = 0;
      vm.sumoutpotting_ej = 0;
      vm.sumoutpotting_ej_aeq = 0;

      PottingService.get(mch, datum).then(function (response) {
        vm.p = response.data;
        vm.dis=false;
        var j = 0;
        var k = 0;
        var l = 0;
        var m = 0;
        var n = 0;
        var o = 0;
        var p = 0;
        var q = 0;
        var r = 0;
        for (var i = 0; i < vm.p.length; i++) {
          var mystring = vm.p[i].name;
          var substring1 = "_IN-IN";
          var substring2 = "_P3-P3";
          var substring3 = "_OUT-OUT";
          if (mystring.includes(substring1) && vm.p[i].shiftnum == 1) {
            vm.inpotting_de[j] = vm.p[i];
            vm.inpotting_de[j].name = mystring.substr(0, mystring.length - 6);
            for (var a = 0; a < vm.aeqs.length; a++) {
              if (vm.inpotting_de[j].name == vm.aeqs[a].name) {
                vm.inpotting_de[j].aeq = vm.inpotting_de[j].amount * vm.aeqs[a].amount;
              }
            }
            j++;
          }
          else if (mystring.includes(substring2) && vm.p[i].shiftnum == 1) {
            vm.p3potting_de[k] = vm.p[i];
            vm.p3potting_de[k].name = mystring.substr(0, mystring.length - 6);
            for (var a = 0; a < vm.aeqs.length; a++) {
              if (vm.p3potting_de[k].name == vm.aeqs[a].name) {
                vm.p3potting_de[k].aeq = vm.p3potting_de[k].amount * vm.aeqs[a].amount;
              }
            }
            k++;
          }
          else if (mystring.includes(substring3) && vm.p[i].shiftnum == 1) {
            vm.outpotting_de[l] = vm.p[i];
            vm.outpotting_de[l].name = mystring.substr(0, mystring.length - 8);
            for (var a = 0; a < vm.aeqs.length; a++) {
              if (vm.outpotting_de[l].name == vm.aeqs[a].name) {
                vm.outpotting_de[l].aeq = vm.outpotting_de[l].amount * vm.aeqs[a].amount;
              }
            }
            l++;
          }
          else if (mystring.includes(substring1) && vm.p[i].shiftnum == 2) {
            vm.inpotting_du[m] = vm.p[i];
            vm.inpotting_du[m].name = mystring.substr(0, mystring.length - 6);
            for (var a = 0; a < vm.aeqs.length; a++) {
              if (vm.inpotting_du[m].name == vm.aeqs[a].name) {
                vm.inpotting_du[m].aeq = vm.inpotting_du[m].amount * vm.aeqs[a].amount;
              }
            }
            m++;
          }
          else if (mystring.includes(substring2) && vm.p[i].shiftnum == 2) {
            vm.p3potting_du[n] = vm.p[i];
            vm.p3potting_du[n].name = mystring.substr(0, mystring.length - 6);
            for (var a = 0; a < vm.aeqs.length; a++) {
              if (vm.p3potting_du[n].name == vm.aeqs[a].name) {
                vm.p3potting_du[n].aeq = vm.p3potting_du[n].amount * vm.aeqs[a].amount;
              }
            }
            n++;
          }
          else if (mystring.includes(substring3) && vm.p[i].shiftnum == 2) {
            vm.outpotting_du[o] = vm.p[i];
            vm.outpotting_du[o].name = mystring.substr(0, mystring.length - 8);
            for (var a = 0; a < vm.aeqs.length; a++) {
              if (vm.outpotting_du[o].name == vm.aeqs[a].name) {
                vm.outpotting_du[o].aeq = vm.outpotting_du[o].amount * vm.aeqs[a].amount;
              }
            }
            o++;
          }
          else if (mystring.includes(substring1) && vm.p[i].shiftnum == 3) {
            vm.inpotting_ej[p] = vm.p[i];
            vm.inpotting_ej[p].name = mystring.substr(0, mystring.length - 6);
            for (var a = 0; a < vm.aeqs.length; a++) {
              if (vm.inpotting_ej[p].name == vm.aeqs[a].name) {
                vm.inpotting_ej[p].aeq = vm.inpotting_ej[p].amount * vm.aeqs[a].amount;
              }
            }
            p++;
          }
          else if (mystring.includes(substring2) && vm.p[i].shiftnum == 3) {
            vm.p3potting_ej[q] = vm.p[i];
            vm.p3potting_ej[q].name = mystring.substr(0, mystring.length - 6);
            for (var a = 0; a < vm.aeqs.length; a++) {
              if (vm.p3potting_ej[q].name == vm.aeqs[a].name) {
                vm.p3potting_ej[q].aeq = vm.p3potting_ej[q].amount * vm.aeqs[a].amount;
              }
            }
            q++;
          }
          else if (mystring.includes(substring3) && vm.p[i].shiftnum == 3) {
            vm.outpotting_ej[r] = vm.p[i];
            vm.outpotting_ej[r].name = mystring.substr(0, mystring.length - 8);
            for (var a = 0; a < vm.aeqs.length; a++) {
              if (vm.outpotting_ej[r].name == vm.aeqs[a].name) {
                vm.outpotting_ej[r].aeq = vm.outpotting_ej[r].amount * vm.aeqs[a].amount;
              }
            }
            r++;
          }
        }
        vm.suminpotting_de = $filter('sumdb')(vm.inpotting_de);
        vm.suminpotting_de_aeq = $filter('sumaeq')(vm.inpotting_de);
        vm.sump3potting_de = $filter('sumdb')(vm.p3potting_de);
        vm.sump3potting_de_aeq = $filter('sumaeq')(vm.p3potting_de);
        vm.sumoutpotting_de = $filter('sumdb')(vm.outpotting_de);
        vm.sumoutpotting_de_aeq = $filter('sumaeq')(vm.outpotting_de);
        vm.suminpotting_du = $filter('sumdb')(vm.inpotting_du);
        vm.suminpotting_du_aeq = $filter('sumaeq')(vm.inpotting_du);
        vm.sump3potting_du = $filter('sumdb')(vm.p3potting_du);
        vm.sump3potting_du_aeq = $filter('sumaeq')(vm.p3potting_du);
        vm.sumoutpotting_du = $filter('sumdb')(vm.outpotting_du);
        vm.sumoutpotting_du_aeq = $filter('sumaeq')(vm.outpotting_du);
        vm.suminpotting_ej = $filter('sumdb')(vm.inpotting_ej);
        vm.suminpotting_ej_aeq = $filter('sumaeq')(vm.inpotting_ej);
        vm.sump3potting_ej = $filter('sumdb')(vm.p3potting_ej);
        vm.sump3potting_ej_aeq = $filter('sumaeq')(vm.p3potting_ej);
        vm.sumoutpotting_ej = $filter('sumdb')(vm.outpotting_ej);
        vm.sumoutpotting_ej_aeq = $filter('sumaeq')(vm.outpotting_ej);
      });
    }

     function load_more(mch, kezdodatum, vegdatum)
     {
       PottingService.getdays(mch, kezdodatum, vegdatum).then(function (response) {
        vm.moredays = response.data;
       });
     }


    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load(vm.mch, vm.datum);
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
