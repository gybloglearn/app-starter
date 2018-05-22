define([], function () {
  'use strict';
  function Controller($cookies, $state, $rootScope, bokesgroupService, $filter) {
    var vm = this;
    vm.tanks = ["Bubble point tank1", "Bubble point tank2", "Bubble point tank3", "Bubble point tank4", "Bubble point tank5", "Bubble point tank6", "Bubble point tank7", "Bubble point tank12", "Bubble point tank13", "Bubble point tank14", "Bubble point tank15", "Bubble point tank21", "Bubble point tank22", "Bubble point tank23", "Bubble point tank25", "Bubble point tank26"];
    vm.pottings = ["Potting3", "Potting4"];
    vm.sheetmakers = ['SheetMaker1', 'SheetMaker2', 'SheetMaker4', 'SheetMaker5', 'SheetMaker6', 'SheetMaker7', 'SheetMaker8', 'SheetMaker9'];
    vm.startdatum = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.startdatumszam = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd HH:mm:ss');
    vm.enddatum = $filter('date')(new Date().getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddatumszam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
    vm.mtfload = false;
    vm.load = load;

    activate();

    function loadPartnumbers() {
      vm.partnumbers = [];
      bokesgroupService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
      load();
    }

    function load() {
      vm.mtfload = true;
      vm.data = [];
      var counter = 0;

      for (var i = 0; i < vm.tanks.length; i++) {
        bokesgroupService.get(vm.startdatum, vm.enddatum, vm.tanks[i]).then(function (response) {
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
              response.data[j].sheetmaker = "";
              response.data[j].potting = "";
              response.data[j].kenesid = "";
              response.data[j].smop = "";
              response.data[j].rot = "";
              response.data[j].rotdate = "";
              response.data[j].rotshift = "";
              response.data[j].gelprep = "";
              response.data[j].geldate = "";
              response.data[j].gelshift = "";
            } else {
              response.data[j].bt_kat_db1 = parseFloat(response.data[j].bt_kat_db1);
              response.data[j].sheetmaker = "";
              response.data[j].potting = "";
              response.data[j].kenesid = "";
              response.data[j].smop = "";
              response.data[j].rot = "";
              response.data[j].rotdate = "";
              response.data[j].rotshift = "";
              response.data[j].gelprep = "";
              response.data[j].geldate = "";
              response.data[j].gelshift = "";
            }
            if (response.data[j].modtype != "") {
              vm.data.push(response.data[j]);
            }
          }

          if (counter == vm.tanks.length) {
            var stdate = $filter('date')(new Date(vm.startdatum).getTime() - (4 * 24 * 3600 * 1000), 'yyyy-MM-dd');
            var enddate = $filter('date')(new Date(vm.enddatum).getTime() - (1 * 24 * 3600 * 1000), 'yyyy-MM-dd');

            angular.forEach(vm.pottings, function (v, k) {
              bokesgroupService.getpotting(stdate, enddate, v).then(function (rp) {
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
                select(vm.data);
                vm.mtfload = false;
              });
            });
          }
        });
      }
    }

    function select(arr) {
      vm.selectdata = [];

      for (var i = 0; i < arr.length; i++) {
        if (arr[i].sheetmaker != "" && arr[i].potting != "" && arr[i].kenesid != "") {
          vm.selectdata.push(arr[i]);
        }
      }
      summodulbokes(vm.selectdata);
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
      vm.kenesum = [
        { name: "Sor-1", amount: 0, db: 0, data: [] },
        { name: "Sor-2", amount: 0, db: 0, data: [] },
      ]
      vm.sumsm = [
        { name: "SheetMaker4", amount: 0, db: 0, data: [] },
        { name: "SheetMaker5", amount: 0, db: 0, data: [] },
        { name: "SheetMaker6", amount: 0, db: 0, data: [] },
        { name: "SheetMaker7", amount: 0, db: 0, data: [] },
        { name: "SheetMaker8", amount: 0, db: 0, data: [] },
        { name: "SheetMaker9", amount: 0, db: 0, data: [] }
      ];
      vm.sumpotting = [
        { name: "Potting3", amount: 0, db: 0, data: [] },
        { name: "Potting4", amount: 0, db: 0, data: [] },
      ];
      mod = $filter('unique')(t, "modul_id1");
      console.log(mod);
      for (var i = 0; i < mod.length; i++) {
        var modname = mod[i].modul_id1;
        var interdata = [];
        interdata = $filter('filter')(t, { modul_id1: modname });
        mod[i].amount = parseInt($filter('sumField')(interdata, "bt_kat_db1"));
        vm.moddate.push(mod[i]);

        if (mod[i].kenesid.includes("-1")) {
          vm.kenesum[0].data.push({ modul: mod[i].modul_id1, am: mod[i].amount, dt: new Date(mod[i].bt_datetime).getTime() });
          vm.kenesum[0].amount += mod[i].amount;
          vm.kenesum[0].db++;
        }
        else if (mod[i].kenesid.includes("-2")) {
          vm.kenesum[1].data.push({ modul: mod[i].modul_id1, am: mod[i].amount, dt: new Date(mod[i].bt_datetime).getTime() });
          vm.kenesum[1].amount += mod[i].amount;
          vm.kenesum[1].db++;
        }

        if (mod[i].sheetmaker == "SheetMaker4") {
          vm.sumsm[0].data.push({ modul: mod[i].modul_id1, am: mod[i].amount, dt: new Date(mod[i].bt_datetime).getTime() });
          vm.sumsm[0].amount += mod[i].amount;
          vm.sumsm[0].db++;
        }
        else if (mod[i].sheetmaker == "SheetMaker5") {
          vm.sumsm[1].data.push({ modul: mod[i].modul_id1, am: mod[i].amount, dt: new Date(mod[i].bt_datetime).getTime() });
          vm.sumsm[1].amount += mod[i].amount;
          vm.sumsm[1].db++;
        }
        else if (mod[i].sheetmaker == "SheetMaker6") {
          vm.sumsm[2].data.push({ modul: mod[i].modul_id1, am: mod[i].amount, dt: new Date(mod[i].bt_datetime).getTime() });
          vm.sumsm[2].amount += mod[i].amount;
          vm.sumsm[2].db++;
        }
        else if (mod[i].sheetmaker == "SheetMaker7") {
          vm.sumsm[3].data.push({ modul: mod[i].modul_id1, am: mod[i].amount, dt: new Date(mod[i].bt_datetime).getTime() });
          vm.sumsm[3].amount += mod[i].amount;
          vm.sumsm[3].db++;
        }
        else if (mod[i].sheetmaker == "SheetMaker8") {
          vm.sumsm[4].data.push({ modul: mod[i].modul_id1, am: mod[i].amount, dt: new Date(mod[i].bt_datetime).getTime() });
          vm.sumsm[4].amount += mod[i].amount;
          vm.sumsm[4].db++;
        }
        else if (mod[i].sheetmaker == "SheetMaker9") {
          vm.sumsm[5].data.push({ modul: mod[i].modul_id1, am: mod[i].amount, dt: new Date(mod[i].bt_datetime).getTime() });
          vm.sumsm[5].amount += mod[i].amount;
          vm.sumsm[5].db++;
        }

        if (mod[i].potting == "Potting3") {
          vm.sumpotting[0].data.push({ modul: mod[i].modul_id1, am: mod[i].amount, dt: new Date(mod[i].bt_datetime).getTime() });
          vm.sumpotting[0].amount += mod[i].amount;
          vm.sumpotting[0].db++;
        }
        else if (mod[i].potting == "Potting4") {
          vm.sumpotting[1].data.push({ modul: mod[i].modul_id1, am: mod[i].amount, dt: new Date(mod[i].bt_datetime).getTime() });
          vm.sumpotting[1].amount += mod[i].amount;
          vm.sumpotting[1].db++;
        }
      }
      //console.log(vm.sumsm);
      console.log(vm.kenesum);
    }

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadPartnumbers();
    }
  }
  Controller.$inject = ['$cookies', '$state', '$rootScope', 'bokesgroupService', '$filter'];
  return Controller;
});
