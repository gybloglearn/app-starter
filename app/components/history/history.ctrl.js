define([], function () {
  'use strict';
  function Controller(historyService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    var datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    var code_part;
    vm.beviheto = false;
    vm.code = '';
    vm.partnumbers = [];
    vm.moduldata = [];
    vm.map = [];
    vm.soroszlopbokes = [];
    var betuk = ["A", "B", "C", "D", "E"];
    var szamok = ["1", "2", "3", "4", "5", "6", "8", "9"];
    vm.create_code = create_code;
    vm.load = load;
    vm.check = check;
    vm.loading = false;
    vm.sorok = szamok;
    vm.oszlop = betuk;

    function feltoltsoroszlop() {
      var a = 0;
      for (var i = 0; i < szamok.length; i++) {
        if (i == 0 || i == 6) {
          for (var j = 0; j < betuk.length; j++) {
            vm.soroszlopbokes[a] = {}
            vm.soroszlopbokes[a].azon = betuk[j] + szamok[i];
            vm.soroszlopbokes[a].bokes = 0;
            a++;
          }
        }
        else {
          for (var j = 0; j < betuk.length - 1; j++) {
            vm.soroszlopbokes[a] = {}
            vm.soroszlopbokes[a].azon = betuk[j] + szamok[i];
            vm.soroszlopbokes[a].bokes = 0;
            a++;
          }
        }
      }
    }

    function create_code() {
      var new_code = '99' + vm.part + code_part;
      vm.code = new_code;
      vm.load(new_code);
    }

    function check(input) {
      if (input.length == 10 && isFinite(input)) {
        vm.beviheto = true;
      }
      else {
        vm.beviheto = false;
      }
      if (vm.beviheto == true) {
        code_part = vm.valid;
      }
    }

    function load(code) {
      vm.loading = true;
      vm.moduldata = [];
      historyService.getmodul(datum, code).then(function (response) {
        vm.moduldata = response.data;
        console.log(vm.moduldata);
        vm.d = [];

        for (var property in vm.moduldata[0]) {
          if (vm.moduldata[0].hasOwnProperty(property)) {
            // do stuff
            vm.d.push({"name":property, "value":vm.moduldata[0][property]});
          }
        }
        console.log(vm.d);
        vm.loading = false;
        loadmap($filter('date')(new Date(vm.moduldata[0].bp_startdate).getTime(), 'yyyy-MM-dd'), $filter('date')(new Date(vm.moduldata[0].bp_enddate).getTime() + 24 * 3600 * 1000, 'yyyy-MM-dd'), vm.moduldata[0].bp_machine);
      });
    }

    function loadPartnumber() {
      historyService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }

    function loadmap(st, ed, tk) {
      feltoltsoroszlop();
      vm.map = [];

      historyService.getmap(st, ed, tk).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].modul_id1 == vm.code) {
            vm.map.push(response.data[i]);
          }
        }
        for (var j = 0; j < vm.map.length; j++) {
          var actkom = vm.map[j].Oszlop + vm.map[j].Sor;
          for (var k = 0; k < vm.soroszlopbokes.length; k++) {
            if (actkom == vm.soroszlopbokes[k].azon) {
              vm.soroszlopbokes[k].bokes += vm.map[j].bt_kat_db1 * 1;
            }
          }
        }
        console.log(vm.soroszlopbokes);
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadPartnumber();
    }
  }
  Controller.$inject = ['historyService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
