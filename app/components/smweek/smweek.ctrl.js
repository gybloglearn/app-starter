define([], function () {
  'use strict';
  function Controller(weeklyService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.partnumbers = [];
    vm.dates = [];
    vm.filedatas = [];
    vm.sm = [];
    vm.smcards = [];
    vm.startdate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate  = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.createdates=createdates;

    function loadPartnumbers() {
      vm.partnumbers = [];
      weeklyService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }

    function createdates(){
      vm.dates = [];
      var differencedate = 0;
      differencedate = (new Date(vm.enddate ).getTime() - new Date(vm.startdate).getTime()) / (24 * 3600 * 1000);
      for(var i = 0; i <= differencedate; i++){
        vm.dates[i] = $filter('date')(new Date(vm.enddate ).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyyMMdd');
      }
      callsm();
    }

    function callsm() {
      for (var i = 0; i < 8; i++) {
        vm.sm[i] = {}
        if (i == 2) {
          vm.sm[i].id = "SM" + 9;
        }
        else {
          vm.sm[i].id = "SM" + (i + 1);
        }
        vm.sm[i].musz = 0;
        vm.sm[i].szerv = 0;
        vm.sm[i].terv = 0;
        vm.sm[i].jo = 0;
        vm.sm[i].jaeq = 0;
        vm.sm[i].ossz = 0;
        vm.sm[i].oaeq = 0;
      }
      vm.sm[8] = {}
      vm.sm[8].id = "SMS";
      vm.sm[8].musz = 0;
      vm.sm[8].szerv = 0;
      vm.sm[8].terv = 0;
      vm.sm[8].jo = 0;
      vm.sm[8].jaeq = 0;
      vm.sm[8].ossz = 0;
      vm.sm[8].oaeq = 0;
     
      loadsmfile();
    }

    function loadsmfile() {
      vm.filedatas = [];

      for (var i = 0; i < vm.dates.length; i++) {
        weeklyService.getsmfile(vm.dates[i]).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            vm.filedatas.push(response.data[j]);
            updatedowntime(response.data[j]);
          }
          
        });
      }
      lodsm();
    }

    function updatedowntime(tmb) {
      for (var j = 0; j < vm.sm.length - 1; j++) {
        if (vm.sm[j].id == tmb.Machine && tmb.Ev_Group == "Tervezett veszteseg") {
          vm.sm[j].terv += tmb.Event_time;
          vm.sm[8].terv += tmb.Event_time;
        }
        else if (vm.sm[j].id == tmb.Machine && tmb.Ev_Group == "Szervezesi veszteseg") {
          vm.sm[j].szerv += tmb.Event_time;
          vm.sm[8].szerv += tmb.Event_time;
        }
        else if (vm.sm[j].id == tmb.Machine && tmb.Ev_Group == "Muszaki technikai okok") {
          vm.sm[j].musz += tmb.Event_time;
          vm.sm[8].musz += tmb.Event_time;
        }
      }
      
    }

    function lodsm() {
      for (var i = 0; i < vm.sheetmakers.length; i++) {
        weeklyService.getsm(vm.startdate, vm.enddate, vm.sheetmakers[i]).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].aeq = getAEQ(vm.partnumbers, response.data[j].type, response.data[j].amount);

            for (var k = 0; k < vm.sm.length - 1; k++) {
              if (response.data[j].shortname == vm.sm[k].id && response.data[j].category == "GOOD") {
                vm.sm[k].jo += response.data[j].amount;
                vm.sm[k].jaeq += response.data[j].aeq;
                vm.sm[8].jo += response.data[j].amount;
                vm.sm[8].jaeq += response.data[j].aeq;
              }
              else if (response.data[j].shortname == vm.sm[k].id && response.data[j].category == "TOTAL") {
                vm.sm[k].ossz += response.data[j].amount;
                vm.sm[k].oaeq += response.data[j].aeq;
                vm.sm[8].ossz += response.data[j].amount;
                vm.sm[8].oaeq += response.data[j].aeq;
              }
            }
          }
          console.log(vm.sm);
          updatecard(vm.sm);
        });
      }
    }

    function updatecard(smarr) {
      vm.smcards = [];
      var smskap = 0;
      var smstime = 0;
      for (var i = 0; i < smarr.length - 1; i++) {
        smskap += (vm.dates.length * 1440 * 60 / 91 / 12 * 0.74) * ((vm.dates.length * 1440 - ((smarr[i].musz + smarr[i].szerv + smarr[i].terv) / 60)) / (vm.dates.length * 1440));
        smstime += vm.dates.length * 1440;
        vm.smcards.push({
          sm: smarr[i].id,
          osszlap: smarr[i].ossz,
          osszaeq: smarr[i].oaeq,
          jolap: smarr[i].jo,
          joaeq: smarr[i].jaeq,
          alltime: vm.dates.length * 1440,
          downtime: (smarr[i].musz + smarr[i].szerv + smarr[i].terv) / 60,
          muszaki: smarr[i].musz / 60,
          szervezesi: smarr[i].szerv / 60,
          tervezesi: smarr[i].terv / 60,
          kap: (vm.dates.length * 1440 * 60 / 91 / 12 * 0.74) * ((vm.dates.length * 1440 - ((smarr[i].musz + smarr[i].szerv + smarr[i].terv) / 60)) / (vm.dates.length * 1440))
        })
      }
      var obj = {}
      obj = {
        sm: smarr[8].id,
        osszlap: smarr[8].ossz,
        osszaeq: smarr[8].oaeq,
        jolap: smarr[8].jo,
        joaeq: smarr[8].jaeq,
        alltime: smstime,
        downtime: (smarr[8].musz + smarr[8].szerv + smarr[8].terv) / 60,
        muszaki: smarr[8].musz / 60,
        szervezesi: smarr[8].szerv / 60,
        tervezesi: smarr[8].terv / 60,
        kap: smskap
      }
      vm.smcards.push(obj);
    }

    function getAEQ(tomb, azon, am) {
      var aeq = 0;
      var substr = azon.substring(0, 3);
      if (substr.substring(0, 2) == "ZL")
        substr = "ZL";
      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].name.includes(substr)) {
          aeq = (am / parseInt(tomb[i].sheets)) * parseFloat(tomb[i].aeq);
        }
      }
      return aeq;
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.edate= $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      loadPartnumbers();
    }
  }
  Controller.$inject = ['weeklyService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});