define([], function () {
  'use strict';
  function Controller(shiftdayService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.date = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.allgroup = ["X1", "X2", "X3"];
    vm.actgroup="X1";
    vm.szak_de = $filter('shift')(1, vm.date);
    //vm.szak_du = $filter('shift')(2, vm.date);
    vm.szak_ej = $filter('shift')(3, vm.date);
    vm.beallit=beallit;
    vm.loading=false;

    function loadpartnumbers() {
      vm.partnumbers = [];
      shiftdayService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }


    function beallit() {
      vm.loading=true;
      vm.startdate = $filter('date')(new Date(vm.date).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      vm.enddate = $filter('date')(new Date(vm.date).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      load();
    }

    function load() {
      vm.data = [];
      shiftdayService.get(vm.startdate, vm.enddate).then(function (response) {
        var d = response.data;
        for (var i = 0; i < d.length; i++) {
          //ellenőrzés hogy a modul kijött-e
          //if (d[i].CL_End != "") {
            d[i].CL_End = $filter('date')(new Date(d[i].CL_End), 'yyyy-MM-dd HH:mm:ss');
            var startnum = new Date(d[i].CL_Start).getHours() * 60 + new Date(d[i].CL_Start).getMinutes();
            var endnum = new Date(d[i].CL_End).getHours() * 60 + new Date(d[i].CL_End).getMinutes();
            d[i].amount=1;

            //nap hozzáadás
            if (startnum < 350) {
              d[i].Start_Day = $filter('date')(new Date(d[i].CL_Start).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
            }
            else {
              d[i].Start_Day = $filter('date')(new Date(d[i].CL_Start).getTime(), 'yyyy-MM-dd');
            }
            if (endnum < 350) {
              d[i].End_Day = $filter('date')(new Date(d[i].CL_End).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
            }
            else {
              d[i].End_Day = $filter('date')(new Date(d[i].CL_End).getTime(), 'yyyy-MM-dd');
            }

            //szakszám megadása
            if (350 <= startnum && startnum < 1070) {
              d[i].Start_Shift = 1;
            }
            else {
              d[i].Start_Shift = 3;
            }
            if (350 <= endnum && endnum < 1070) {
              d[i].End_Shift = 1;
            }
            else {
              d[i].End_Shift = 3;
            }
            //aeq hozzáadása
            for (var j = 0; j < vm.partnumbers.length; j++) {
              if (d[i].JobID.includes(vm.partnumbers[j].id)) {
                d[i].aeq = vm.partnumbers[j].aeq * 1;
                d[i].cikk=vm.partnumbers[j].id;
              }
            }
            //csoportba osztás X1,X2,X3
            if (d[i].MachineName == "Chlorination Tank5" || d[i].MachineName == "Chlorination Tank6" || d[i].MachineName == "Chlorination Tank7" || d[i].MachineName == "Chlorination Tank8") {
              d[i].Group = "X1"
            }
            else if (d[i].MachineName == "Chlorination Tank11" || d[i].MachineName == "Chlorination Tank12" || d[i].MachineName == "Chlorination Tank13" || d[i].MachineName == "Chlorination Tank14") {
              d[i].Group = "X2"
            }
            else if (d[i].MachineName == "Chlorination 4") {
              d[i].Group = "X3"
            }
            vm.data.push(d[i]);
          //}
        }
        vm.loading=false;
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadpartnumbers();
      beallit();
    }
  }
  Controller.$inject = ['shiftdayService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
