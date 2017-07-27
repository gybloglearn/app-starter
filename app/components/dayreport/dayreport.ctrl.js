define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $stateParams, $rootScope, $filter) {
    var vm = this;
    vm.today = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.places = ["SL", "SM", "Potting"];
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.pottings = ["Potting2", "Potting3", "Potting4"];
    vm.actplace = "SL";
    vm.partnumbers = [];
    vm.sldata = [];
    vm.slcards = [];
    vm.smdata = [];
    vm.smcards = [];
    vm.pottdata = [];
    vm.pottcards = [];
    vm.load = load;


    function loadPartnumbers() {
      vm.partnumbers = [];
      dataService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }

    function load() {
      vm.datumszam = $filter('date')(new Date(vm.actdate).getTime(), 'yyyy-MM-dd');
      vm.actdateend = $filter('date')(new Date(vm.actdate).getTime() + 24 * 3600 * 1000, 'yyyy-MM-dd');

      if (vm.actplace == "SL") {
        loadsl(vm.actdate, vm.actdateend);
      }
      else if (vm.actplace == "SM") {
        loadsm(vm.actdate, vm.actdateend);
      }
      else if (vm.actplace == "Potting") {
        loadpott(vm.actdate, vm.actdateend);
      }
    }

    function loadsl(st, ed) {
      st = $filter('date')(new Date(st).getTime() - 24 * 3600 * 1000, 'yyyy-MM-dd');
      vm.sldata = [];
      vm.slcards = [];

      vm.sldata[0] = {};
      vm.sldata[0].sl = "SLS";
      vm.sldata[0].aeq = 0;
      vm.sldata[0].meter = 0;

      dataService.getsl(st, ed).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          var slname = "";
          if (response.data[j].machine.includes("#3")) {
            slname = response.data[j].machine[0] + response.data[j].machine[4] + "3";
          }
          else if (response.data[j].machine.includes("#4")) {
            slname = response.data[j].machine[0] + response.data[j].machine[4] + "4";
          }
          else if (response.data[j].machine.includes("#136")) {
            slname = response.data[j].machine[0] + response.data[j].machine[4] + "136";
          }
          else if (response.data[j].machine.includes("#236")) {
            slname = response.data[j].machine[0] + response.data[j].machine[4] + "236";
          }

          var obj = {};
          obj = {
            sl: slname,
            aeq: response.data[j].textbox2,
            meter: response.data[j].val
          };
          if (vm.actdate == response.data[j].item1) {
            vm.sldata[0].aeq += response.data[j].textbox2 * 1;
            vm.sldata[0].meter += response.data[j].val * 1;
            vm.slcards.push(obj);
          }
        }
      });
    }

    function loadsm(st, ed) {
      vm.smdata = [];
      vm.smcards = [];
      vm.smloading = true;
      var load = 0;

      vm.smdata[0] = {};
      vm.smdata[0].sm = "SMS";
      vm.smdata[0].osszlap = 0;
      vm.smdata[0].osszaeq = 0;
      vm.smdata[0].jolap = 0;
      vm.smdata[0].joaeq = 0;
      vm.smdata[0].alltime = 0;
      vm.smdata[0].downtime = 0;
      vm.smdata[0].szervezesi = 0;
      vm.smdata[0].tervezesi = 0;
      vm.smdata[0].muszaki = 0;
      vm.smdata[0].kap = 0;

      angular.forEach(vm.sheetmakers, function (v, k) {
        var ossz = 0;
        var osszaeq = 0;
        var jo = 0;
        var joaeq = 0;
        load++;
        dataService.getsm(st, ed, v).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].aeq = getAEQ(vm.partnumbers, response.data[j].type, response.data[j].amount);
          }
          ossz = $filter('sumdb')($filter('filter')(response.data, { 'category': 'TOTAL' }));
          osszaeq = $filter('sumField')($filter('filter')(response.data, { 'category': 'TOTAL' }), 'aeq');
          jo = $filter('sumdb')($filter('filter')(response.data, { 'category': 'GOOD' }));
          joaeq = $filter('sumField')($filter('filter')(response.data, { 'category': 'GOOD' }), 'aeq');
          var time = 0;
          if (vm.today == st) {
            var szamom = new Date().getHours() * 60 + new Date().getMinutes();
            if (szamom >= 350) {
              time = szamom - 350;
            }
            else {
              time = 1440 - (350 - szamom);
            }
          }
          else {
            time = 1440;
          }

          vm.smdata[0].osszlap += ossz;
          vm.smdata[0].osszaeq += osszaeq * 1;
          vm.smdata[0].jolap += jo;
          vm.smdata[0].joaeq += joaeq * 1;
          vm.smdata[0].alltime += time;

          var obj = {};
          obj = {
            sm: v,
            osszlap: ossz,
            osszaeq: osszaeq,
            jolap: jo,
            joaeq: joaeq,
            alltime: time,
          };
          dataService.getsoesm(st, v).then(function (resp) {
            var szam = $filter('sumField')($filter('filter')(resp.data, { 'Event_type': "Downtime" }), 'Event_time');
            var szerv = $filter('sumField')($filter('filter')(resp.data, { 'Ev_Group': "Szervezesi veszteseg" }), 'Event_time');
            var terv = $filter('sumField')($filter('filter')(resp.data, { 'Ev_Group': "Tervezett veszteseg" }), 'Event_time');
            var musz = $filter('sumField')($filter('filter')(resp.data, { 'Ev_Group': "Muszaki technikai okok" }), 'Event_time');
            var kapc = (1440 * 60 / 91 / 12 * 0.74) * ((time - (szam / 60)) / 1440);

            vm.smdata[0].downtime += szam / 60;
            vm.smdata[0].szervezesi += szerv / 60;
            vm.smdata[0].tervezesi += terv / 60;
            vm.smdata[0].muszaki += musz / 60;
            vm.smdata[0].kap += kapc;

            obj.downtime = szam / 60;
            obj.szervezesi = szerv / 60;
            obj.tervezesi = terv / 60;
            obj.muszaki = musz / 60;
            obj.kap = kapc;
            vm.smcards.push(obj);
          });
          if (load > 7) {
            vm.smloading = false;
          }
        });
      });
    }

    function loadpott(st, ed) {
      vm.pottdata = [];
      vm.pottcards = [];
      vm.pottloading = true;
      var load = 0;

      vm.pottdata[0] = {};
      vm.pottdata[0].potting = "PS";
      vm.pottdata[0].bedb = 0;
      vm.pottdata[0].beaeq = 0;
      vm.pottdata[0].p3db = 0;
      vm.pottdata[0].p3aeq = 0;
      vm.pottdata[0].kidb = 0;
      vm.pottdata[0].kiaeq = 0;

      angular.forEach(vm.pottings, function (v, k) {
        load++;
        dataService.getpotting(st, ed, v).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].aeq = addAEQ(vm.partnumbers, response.data[j].type, response.data[j].amount);
            response.data[j].days = response.data[j].days.substring(0, 10);

          }

          var pottname = v[0] + v[v.length - 1];
          var bedb = $filter('sumField')($filter('filter')(response.data, { 'category': "IN" }), 'amount');
          var beaeq = $filter('sumField')($filter('filter')(response.data, { 'category': "IN" }), 'aeq');
          var p3db = $filter('sumField')($filter('filter')(response.data, { 'category': "P3" }), 'amount');
          var p3aeq = $filter('sumField')($filter('filter')(response.data, { 'category': "P3" }), 'aeq');
          var kidb = $filter('sumField')($filter('filter')(response.data, { 'category': "OUT" }), 'amount');
          var kiaeq = $filter('sumField')($filter('filter')(response.data, { 'category': "OUT" }), 'aeq');

          vm.pottdata[0].potting = "PS";
          vm.pottdata[0].bedb += bedb * 1;
          vm.pottdata[0].beaeq += beaeq * 1;
          vm.pottdata[0].p3db += p3db * 1;
          vm.pottdata[0].p3aeq += p3aeq * 1;
          vm.pottdata[0].kidb += kidb * 1;
          vm.pottdata[0].kiaeq += kiaeq * 1;

          var obj = {};
          obj = {
            potting: pottname,
            bedb: bedb,
            beaeq: beaeq,
            p3db: p3db,
            p3aeq: p3aeq,
            kidb: kidb,
            kiaeq: kiaeq,
          };
          vm.pottcards.push(obj);
          if (load > 2) {
            vm.pottloading = false;
          }
        });
      });
    }

    activate();

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

    function addAEQ(tomb, azon, am) {
      var aeq = 0;
      var substr = azon.substring(0, 3);
      if (substr.substring(0, 2) == "ZL")
        substr = "ZL";
      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].name.includes(substr)) {
          aeq = am * parseFloat(tomb[i].aeq);
        }
      }
      return aeq;
    }

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadPartnumbers();
      if ($stateParams.datum && $stateParams.place == "SL") {
        vm.actplace = $stateParams.place;
        vm.actdate = $stateParams.datum;
        vm.datumszam = $filter('date')(new Date($stateParams.datum).getTime(), 'yyyy-MM-dd');
        vm.actdateend = $filter('date')(new Date($stateParams.datum).getTime() + 24 * 3600 * 1000, 'yyyy-MM-dd');
        loadsl(vm.actdate, vm.actdateend);
      }
      else if ($stateParams.datum && $stateParams.place == "SM") {
        vm.actplace = $stateParams.place;
        vm.actdate = $stateParams.datum;
        vm.datumszam = $filter('date')(new Date($stateParams.datum).getTime(), 'yyyy-MM-dd');
        vm.actdateend = $filter('date')(new Date($stateParams.datum).getTime() + 24 * 3600 * 1000, 'yyyy-MM-dd');
        loadsm(vm.actdate, vm.actdateend);
      }
      else if ($stateParams.datum && $stateParams.place == "Potting") {
        vm.actplace = $stateParams.place;
        vm.actdate = $stateParams.datum;
        vm.datumszam = $filter('date')(new Date($stateParams.datum).getTime(), 'yyyy-MM-dd');
        vm.actdateend = $filter('date')(new Date($stateParams.datum).getTime() + 24 * 3600 * 1000, 'yyyy-MM-dd');
        loadpott(vm.actdate, vm.actdateend);
      }
      else {
        vm.actdate = $filter('date')(new Date(), 'yyyy-MM-dd');
        vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd');
        vm.actdateend = $filter('date')(new Date().getTime() + 24 * 3600 * 1000, 'yyyy-MM-dd');
        loadsl(vm.actdate, vm.actdateend);
      }
    }
  }
  Controller.$inject = ['Data', '$cookies', '$stateParams', '$rootScope', '$filter'];
  return Controller;
});