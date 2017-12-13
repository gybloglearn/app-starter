define([], function () {
  'use strict';
  function Controller(mapService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.startdatum = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.startdatumszam = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddatum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.enddatumszam = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.tanks = ["Bubble point tank1", "Bubble point tank2", "Bubble point tank3", "Bubble point tank4", "Bubble point tank5", "Bubble point tank6", "Bubble point tank7", "Bubble point tank12", "Bubble point tank13", "Bubble point tank14", "Bubble point tank15", "Bubble point tank21", "Bubble point tank22", "Bubble point tank23", "Bubble point tank25", "Bubble point tank26"];
    vm.pottings = ["Potting3", "Potting4"];

    function loadPartnumbers() {
      vm.partnumbers = [];
      mapService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
      load();
    }

    function load() {
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
            if (response.data[j].bt_kat_db1 == "") {
              response.data[j].bt_kat_db1 = 0;
            } else {
              response.data[j].bt_kat_db1 = parseFloat(response.data[j].bt_kat_db1);
            }
            vm.data.push(response.data[j]);
          }

          if (counter == vm.tanks.length) {
            var stdate = $filter('date')(new Date(vm.startdatum, ).getTime() - (3 * 24 * 3600 * 1000), 'yyyy-MM-dd');
            var enddate = $filter('date')(new Date(vm.enddatum, ).getTime() - (3 * 24 * 3600 * 1000), 'yyyy-MM-dd');
            for (var a = 0; a < vm.pottings.length; a++) {
              mapService.getpotting(stdate, enddate, vm.pottings[a]).then(function (rp) {
                for (var b = 0; b < rp.data.length; b++) {
                  for (var c = 0; c < vm.data.length; c++) {
                    if (vm.data[c].modul_id1 == rp.data[b].JobID) {
                      vm.data[c].sheetmaker = rp.data[b].sm_machinename;
                      vm.data[c].potting = rp.data[b].PT_IN_M;
                      vm.data[c].kenesid = rp.data[b].kenesid;
                    }
                  }
                }
              });
            }
            console.log(vm.data);
          }
        });
      }
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

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadPartnumbers();
    }
  }
  Controller.$inject = ['mapService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
