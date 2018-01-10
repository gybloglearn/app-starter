define([], function () {
  'use strict';
  function Controller(mapService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.moduls = [];
    vm.startdatum = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.startdatumszam = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddatum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.enddatumszam = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.tanks = ["Bubble point tank1", "Bubble point tank2", "Bubble point tank3", "Bubble point tank4", "Bubble point tank5", "Bubble point tank6", "Bubble point tank7", "Bubble point tank12", "Bubble point tank13", "Bubble point tank14", "Bubble point tank15", "Bubble point tank21", "Bubble point tank22", "Bubble point tank23", "Bubble point tank25", "Bubble point tank26"];
    vm.pottings = ["Potting3", "Potting4"];
    vm.sheetmakers = ['SheetMaker1', 'SheetMaker2', 'SheetMaker4', 'SheetMaker5', 'SheetMaker6', 'SheetMaker7', 'SheetMaker8', 'SheetMaker9'];
    vm.beilleszt = beilleszt;
    vm.load = load;
    vm.bokeshatar = 35;
    vm.mtfload = false;

    function beilleszt() {
      vm.startdatumszam = $filter('date')(new Date(vm.startdatum).getTime(), 'yyyy-MM-dd');
      vm.enddatumszam = $filter('date')(new Date(vm.enddatum).getTime(), 'yyyy-MM-dd');
    }

    function loadPartnumbers() {
      vm.partnumbers = [];
      mapService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
      load();
    }

    function load() {
      vm.mtfload = true;
      vm.data = [];
      var counter = 0;


      for (var i = 0; i < vm.tanks.length; i++) {
        mapService.get(vm.startdatum, vm.enddatum, vm.tanks[i]).then(function (response) {
          counter++;
          if (counter == vm.tanks.length) {
            vm.downloadenable = true;
          }

          for (var j = 0; j < response.data.length; j++) {
            response.data[j].aeq = getAEQ(vm.partnumbers, response.data[j].modul_id1)
            response.data[j].modtype = getModulname(vm.partnumbers, response.data[j].modul_id1)
            response.data[j].tipus = $filter('addtype')(response.data[j].modtype);
            response.data[j].shift = addShift(response.data[j].bt_datetime);
            if (response.data[j].bt_kat_db1 == "") {
              response.data[j].bt_kat_db1 = 0;
            } else {
              response.data[j].bt_kat_db1 = parseFloat(response.data[j].bt_kat_db1);
            }
            if (response.data[j].modtype != "") {
              vm.data.push(response.data[j]);
            }
          }

          if (counter == vm.tanks.length) {
            var stdate = $filter('date')(new Date(vm.startdatum).getTime() - (4 * 24 * 3600 * 1000), 'yyyy-MM-dd');
            var enddate = $filter('date')(new Date(vm.enddatum).getTime() - (1 * 24 * 3600 * 1000), 'yyyy-MM-dd');

            angular.forEach(vm.pottings, function (v, k) {
              mapService.getpotting(stdate, enddate, v).then(function (rp) {
                for (var b = 0; b < rp.data.length; b++) {
                  for (var c = 0; c < vm.data.length; c++) {
                    if (vm.data[c].modul_id1 == rp.data[b].JobID) {
                      vm.data[c].sheetmaker = rp.data[b].sm_machinename;
                      vm.data[c].potting = rp.data[b].PT_IN_M;
                      vm.data[c].kenesid = rp.data[b].kenesid;
                      vm.data[c].smop = rp.data[b].sm_op1;
                      vm.data[c].rot = rp.data[b].PT_ROT_OP;
                      vm.data[c].rotdate = rp.data[b].PT_ROT_DT;
                      vm.data[c].rotshift = rp.data[b].PT_ROT_S;
                      vm.data[c].gelprep = rp.data[b].PT_GEL_Prep_OP;
                      vm.data[c].geldate = rp.data[b].PT_GEL_PREP_DT;
                      vm.data[c].gelshift = rp.data[b].PT_GEL_PREP_S;
                    }
                  }
                }
                //console.log(vm.data);
                summodulbokes(vm.data);
                vm.mtfload = false;
              });
            });
          }
        });
      }
    }

    function addShift(it) {
      var num = new Date(it).getHours() * 60 + new Date(it).getMinutes();
      var shiftnum = 0;

      if (num >= 350 && num < 1070) {
        shiftnum = 1;
      }
      else {
        shiftnum = 3;
      }
      var shift = $filter('shift')(shiftnum, $filter('date')(new Date(it).getTime(), 'yyyy-MM-dd'));

      return shift;
    }

    function getAEQ(tomb, azon) {
      var aeq = 0;
      var szam = azon.substring(2, 9);
      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].id == szam) {
          aeq = parseFloat(tomb[i].aeq);
        }
      }
      return aeq;
    }

    function getModulname(tomb, azon) {
      var name = "";
      var szam = azon.substring(2, 9);
      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].id == szam) {
          name = tomb[i].name;
        }
      }
      return name;
    }

    function summodulbokes(t) {
      var mod = [];
      vm.moddate = [];
      mod = $filter('unique')(t, "modul_id1");
      for (var i = 0; i < mod.length; i++) {
        var modname = mod[i].modul_id1;
        var interdata = [];
        interdata = $filter('filter')(t, { modul_id1: modname });
        mod[i].amount = parseInt($filter('sumField')(interdata, "bt_kat_db1"));
        vm.moddate.push(mod[i]);
      }
      console.log(vm.moddate);
    }

    vm.greater = function (field, value) {
      return function (item) {
        return item[field] > value;
      }
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadPartnumbers();
      vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    }
  }
  Controller.$inject = ['mapService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
