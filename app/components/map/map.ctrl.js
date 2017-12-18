define([], function () {
  'use strict';
  function Controller(mapService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.moduls = [];
    vm.oszlopok = ['A', 'B', 'C', 'D', 'E'];
    vm.sorok = ['1', '2', '3', '4', '5', '6', '7', '8'];
    vm.startdatum = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.startdatumszam = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddatum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.enddatumszam = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.tanks = ["Bubble point tank1", "Bubble point tank2", "Bubble point tank3", "Bubble point tank4", "Bubble point tank5", "Bubble point tank6", "Bubble point tank7", "Bubble point tank12", "Bubble point tank13", "Bubble point tank14", "Bubble point tank15", "Bubble point tank21", "Bubble point tank22", "Bubble point tank23", "Bubble point tank25", "Bubble point tank26"];
    vm.pottings = ["Potting3", "Potting4"];
    vm.beilleszt = beilleszt;
    vm.load = load;
    vm.mtfload = false;
    vm.tableload = false;

    function beilleszt() {
      vm.startdatumszam = $filter('date')(new Date(vm.startdatum).getTime(), 'yyyy-MM-dd');
      vm.enddatumszam = $filter('date')(new Date(vm.enddatum).getTime(), 'yyyy-MM-dd');
    }

    vm.greater = function (field, value) {
      return function (item) {
        return item[field] > value;
      }
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
      vm.tableload = true;
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
                    }
                  }
                }
                vm.tableload = false;
                console.log(vm.data);
              });
            });
            vm.mtfload = false;
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

    /*function updateModuls(arr){
      //console.log(arr);
      vm.moduls=[];
      var t=[];
      t=$filter('unique')(arr,'modul_id1');
      for(var i=0;i<t.length;i++){
        var obj={};
        obj={
          modul:t[i].modul_id1,
          name:t[i].modtype,
          sheetmaker:t[i].sheetmaker,
          smop:t[i].smop,
          potting:t[i].potting,
          kenesid:t[i].kenesid,
          tipus:t[i].tipus,
          tank:t[i].tank,
          shift:t[i].shift,          
          bokes:0
        };
        vm.moduls.push(obj)
      }
      for(var i=0;i<vm.moduls.length;i++){
        for(var j=0;j<arr.length;j++){
          if(vm.moduls[i].modul==arr[j].modul_id1){
            vm.moduls[i].bokes+=arr[j].bt_kat_db1;
          }
        }
      }
      console.log(vm.moduls);
    }*/

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadPartnumbers();
      vm.bokeshatar = 35;
    }
  }
  Controller.$inject = ['mapService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
