define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.today = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.actdate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.actdateend = $filter('date')(new Date().getTime() + 24 * 3600 * 1000, 'yyyy-MM-dd');
    vm.places = ["SM", "Potting"];
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.pottings = ["Potting1-1", "Potting1-2", "Potting2", "Potting3", "Potting4"];
    vm.actplace = "SM";
    vm.partnumbers = [];
    vm.smdata = [];
    vm.smcards = [];
    vm.load = load;

    function loadPartnumbers() {
      vm.partnumbers = [];
      dataService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }

    function load() {
      vm.datumszam = $filter('date')(new Date(vm.actdate).getTime(), 'yyyy-MM-dd');
      vm.actdateend=$filter('date')(new Date(vm.actdate).getTime() + 24 * 3600 * 1000, 'yyyy-MM-dd');

      if (vm.actplace == "SM") {
        loadsm();
      }
    }

    function loadsm() {
      vm.smdata = [];
      vm.smcards = [];

      angular.forEach(vm.sheetmakers, function (v, k) {
        var ossz = 0;
        var osszaeq = 0;
        var jo = 0;
        var joaeq = 0;
        dataService.getsm(vm.actdate, vm.actdateend, v).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].aeq = getAEQ(vm.partnumbers, response.data[j].type, response.data[j].amount);
          }
          ossz = $filter('sumdb')($filter('filter')(response.data, { 'category': 'TOTAL' }));
          osszaeq = $filter('sumField')($filter('filter')(response.data, { 'category': 'TOTAL' }), 'aeq');
          jo = $filter('sumdb')($filter('filter')(response.data, { 'category': 'GOOD' }));
          joaeq = $filter('sumField')($filter('filter')(response.data, { 'category': 'GOOD' }), 'aeq');
          var time = 0;
          if (vm.today == vm.actdate) {
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
          console.log(time);


          var obj = {};
          obj = {
            sm: v,
            osszlap: ossz,
            osszaeq: osszaeq,
            jolap: jo,
            joaeq: joaeq,
            alltime: time,
          };
          dataService.getsoesm(vm.actdate, v).then(function (resp) {
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

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadPartnumbers();
      loadsm();
    }
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});