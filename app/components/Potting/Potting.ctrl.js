define([], function () {
  'use strict';
  function Controller(PottingService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.p = "";
    vm.egyedi = [];
    vm.inpotting = [];
    vm.p3potting = [];
    vm.outpotting = [];
    vm.suminpotting = 0;
    vm.suminpotting_aeq = 0;
    vm.sump3potting = 0;
    vm.sump3potting_aeq = 0;
    vm.sumoutpotting = 0;
    vm.sumoutpotting_aeq = 0;
    vm.mch = "Potting4"
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.allpotting = ["Potting4", "Potting3", "Potting2"];
    vm.load = load;


    function load(mch, datum) {
      vm.inpotting = [];
      vm.p3potting = [];
      vm.outpotting = [];
      vm.suminpotting = 0;
      vm.suminpotting_aeq = 0;
      vm.sump3potting = 0;
      vm.sump3potting_aeq = 0;
      vm.sumoutpotting = 0;
      vm.sumoutpotting_aeq = 0;
      vm.p = [];
      PottingService.get(mch, datum).then(function (response) {
        vm.p = response.data;
        vm.egyedi = $filter('unique')(vm.p, 'name');
        var j = 0;
        var k = 0;
        var l = 0;
        for (var i = 0; i < vm.egyedi.length; i++) {
          var mystring = vm.egyedi[i].name;
          var substring1 = "_IN-IN";
          var substring2 = "_P3-P3";
          var substring3 = "_OUT-OUT";
          if (mystring.includes(substring1)) {
            vm.inpotting[j] = vm.egyedi[i];
            vm.inpotting[j].name = mystring.substr(0, mystring.length - 6);
            for (var a = 0; a < vm.aeqs.length; a++) {
              if (vm.inpotting[j].name == vm.aeqs[a].name) {
                vm.inpotting[j].aeq = vm.inpotting[j].amount * vm.aeqs[a].amount;
              }
            }
            j++;
          }
          else if (mystring.includes(substring2)) {
            vm.p3potting[k] = vm.egyedi[i];
            vm.p3potting[k].name = mystring.substr(0, mystring.length - 6);
            for (var a = 0; a < vm.aeqs.length; a++) {
              if (vm.p3potting[k].name == vm.aeqs[a].name) {
                vm.p3potting[k].aeq = vm.p3potting[k].amount * vm.aeqs[a].amount;
              }
            }
            k++;
          }
          else if (mystring.includes(substring3)) {
            vm.outpotting[l] = vm.egyedi[i];
            vm.outpotting[l].name = mystring.substr(0, mystring.length - 8);
            for (var a = 0; a < vm.aeqs.length; a++) {
              if (vm.outpotting[l].name == vm.aeqs[a].name) {
                vm.outpotting[l].aeq = vm.outpotting[l].amount * vm.aeqs[a].amount;
              }
            }
            l++;
          }
        }
        vm.suminpotting = $filter('sumdb')(vm.inpotting);
        vm.suminpotting_aeq = $filter('sumaeq')(vm.inpotting);
        vm.sump3potting = $filter('sumdb')(vm.p3potting);
        vm.sump3potting_aeq = $filter('sumaeq')(vm.p3potting);
        vm.sumoutpotting = $filter('sumdb')(vm.outpotting);
        vm.sumoutpotting_aeq = $filter('sumaeq')(vm.outpotting);
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
