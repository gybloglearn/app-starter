define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $stateParams, $rootScope, $filter) {
    var vm = this;
    vm.today = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.places = ["SM", "Potting"];
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.pottings = ["Potting1-1", "Potting1-2", "Potting2", "Potting3", "Potting4"];
    vm.actplace = "SM";
    vm.partnumbers = [];
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

      if (vm.actplace == "SM") {
        loadsm(vm.actdate, vm.actdateend);
      }
      else if (vm.actplace == "Potting") {
        loadpott(vm.actdate, vm.actdateend);
      }
    }

    function loadsm(st, ed) {
      vm.smdata = [];
      vm.smcards = [];

      angular.forEach(vm.sheetmakers, function (v, k) {
        var ossz = 0;
        var osszaeq = 0;
        var jo = 0;
        var joaeq = 0;
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
            obj.downtime = szam / 60;
            obj.szervezesi = szerv / 60;
            obj.tervezesi = terv / 60;
            obj.muszaki = musz / 60;
            obj.kap = kapc;
            vm.smcards.push(obj);
          });
        });
      });
    }

    function loadpott(st, ed) {
      vm.pottdata = [];
      vm.pottcards = [];

      angular.forEach(vm.pottings, function (v, k) {
        dataService.getpotting(st, ed, v).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].aeq = addAEQ(vm.partnumbers, response.data[j].type, response.data[j].amount);
            response.data[j].days = response.data[j].days.substring(0, 10);

          }
          if (v == "Potting1-1" || (v == "Potting1-2")) {
            var pottname = v[0] + v.substring(v.length - 3, v.length);
          }
          else {
            var pottname = v[0] + v[v.length - 1];
          }
          var bedb = $filter('sumField')($filter('filter')(response.data, { 'category': "IN" }), 'amount');
          var beaeq = $filter('sumField')($filter('filter')(response.data, { 'category': "IN" }), 'aeq');
          var p3db = $filter('sumField')($filter('filter')(response.data, { 'category': "P3" }), 'amount');
          var p3aeq = $filter('sumField')($filter('filter')(response.data, { 'category': "P3" }), 'aeq');
          var kidb = $filter('sumField')($filter('filter')(response.data, { 'category': "OUT" }), 'amount');
          var kiaeq = $filter('sumField')($filter('filter')(response.data, { 'category': "OUT" }), 'aeq');

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
      if ($stateParams.datum && $stateParams.place == "SM") {
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
        loadsm(vm.actdate, vm.actdateend);
      }
    }
  }
  Controller.$inject = ['Data', '$cookies', '$stateParams', '$rootScope', '$filter'];
  return Controller;
});