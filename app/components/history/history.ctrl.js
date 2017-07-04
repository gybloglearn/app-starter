define([], function () {
  'use strict';
  function Controller(eventService, historyService, $cookies, $state, $rootScope, $filter, $timeout, $stateParams) {
    var vm = this;
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    var code_part;
    vm.beviheto = false;
    vm.code = '';
    vm.partnumbers = [];
    vm.moduldata = [];
    vm.planlist = [];
    vm.map = [];
    vm.soroszlopbokes = [];
    var betuk = ["A", "B", "C", "D", "E"];
    var szamok = ["1", "2", "3", "4", "5", "6", "8", "9"];
    vm.alleventtype = ["SM", "Potting", "MTF"];
    vm.eventtype = "SM";
    vm.create_code = create_code;
    vm.save = save;
    vm.check = check;
    vm.loading = false;
    vm.sorok = szamok;
    vm.oszlop = betuk;
    vm.tablesave = tablesave

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
      load(new_code);
      loadplan(new_code);
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
      historyService.getmodul(vm.datum, code).then(function (response) {
        vm.moduldata = response.data;

        vm.d = [];

        for (var property in vm.moduldata[0]) {
          if (vm.moduldata[0].hasOwnProperty(property)) {
            // do stuff
            vm.d.push({ "name": property, "value": vm.moduldata[0][property] });
          }
        }
        console.log(vm.d);
        vm.loading = false;
        loadmap($filter('date')(new Date(vm.moduldata[0].bp_startdate).getTime(), 'yyyy-MM-dd'), $filter('date')(new Date(vm.moduldata[0].bp_enddate).getTime() + 24 * 3600 * 1000, 'yyyy-MM-dd'), vm.moduldata[0].bp_machine);
      });
    }

    function loadplan(modul) {
      vm.planlist = [];
      eventService.get(modul).then(function (response) {
        vm.planlist = response.data;
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

    function save() {
      vm.data = {};
      vm.data.id = new Date().getTime();
      vm.data.date = vm.datum;
      vm.data.eventtype = vm.eventtype;
      vm.data.modul = vm.code;
      vm.data.description = vm.description;
      vm.data.sso = $rootScope.user.username;
      vm.data.name = $rootScope.user.displayname;
      eventService.post(vm.data).then(function (resp) {
        vm.showmessage = true;
        vm.data = {};
        $timeout(function () {
          vm.showmessage = false;
          vm.showtitle = '';
          loadplan(vm.code)
        }, 5000);
      });
    }

    activate();

    function tablesave() {
      var doc = new jsPDF('p', 'pt', 'a4', true);
      var specialElementHandlers = {
        'exportTable': function (element, renderer) {
          return true;
        }
      };


      doc.fromHTML($('#exportTable').get(0), 15, 15, {
        'width': 170,
        'elementHandlers': specialElementHandlers
      });
      doc.save(vm.code + '.pdf');

    }

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadPartnumber();
      if ($stateParams.modulid) {
        var modid = $stateParams.modulid;
        vm.code = modid;
        vm.part = modid.substr(2, 7);
        vm.valid = modid.substr(9, 18);
        load(modid);
        loadplan(modid);
      }
    }

  }
  Controller.$inject = ['eventService', 'historyService', '$cookies', '$state', '$rootScope', '$filter', '$timeout', '$stateParams'];
  return Controller;
});
