define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (7 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.startdatumszam = $filter('date')(new Date().getTime() - (7 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.enddatumszam = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.pottings = ["Potting1-1", "Potting1-2", "Potting2", "Potting3", "Potting4"];
    vm.partnumbers = [];
    vm.smdata = [];
    vm.pottingdata = [];
    vm.dates = [];
    vm.sumdata = [];
    vm.differencedate = 0;
    vm.loadall = loadall;

    function loadPartnumbers() {
      vm.partnumbers = [];
      dataService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }

    function datediff() {
      vm.differencedate = 0;
      vm.dates = [];
      vm.sumdata = [];
      vm.differencedate = (new Date(vm.enddatumszam).getTime() - new Date(vm.startdatumszam).getTime()) / (24 * 3600 * 1000);
      for (var i = 0; i <= vm.differencedate; i++) {
        vm.dates[i] = $filter('date')(new Date().getTime() - ((7 - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.sumdata[i] = {}
        vm.sumdata[i].date = $filter('date')(new Date().getTime() - ((7 - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.sumdata[i].smaeq = 0;
        vm.sumdata[i].pottbeaeq = 0;
        vm.sumdata[i].pottfordaeq = 0;
        vm.sumdata[i].pottkiaeq = 0;
      }
    }


    function loadsm() {
      vm.smdata = [];
      for (var i = 0; i < vm.sheetmakers.length; i++) {
        dataService.getsm(vm.startdate, vm.enddate, vm.sheetmakers[i]).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].aeq = getAEQ(vm.partnumbers, response.data[j].type, response.data[j].amount);
            response.data[j].days = response.data[j].days.substring(0, 10);
            vm.smdata.push(response.data[j]);
            for (var k = 0; k < vm.sumdata.length; k++) {
              if (vm.sumdata[k].date == response.data[j].days && response.data[j].category == "GOOD") {
                vm.sumdata[k].smaeq += response.data[j].aeq;
              }
            }
          }
        });
      }
    }

    function loadpotting() {
      vm.pottingdata = [];
      for (var i = 0; i < vm.pottings.length; i++) {
        dataService.getpotting(vm.startdate, vm.enddate, vm.pottings[i]).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].aeq = addAEQ(vm.partnumbers, response.data[j].type, response.data[j].amount);
            response.data[j].days = response.data[j].days.substring(0, 10);
            vm.pottingdata.push(response.data[j]);
            for (var k = 0; k < vm.sumdata.length; k++) {
              if (vm.sumdata[k].date == response.data[j].days && response.data[j].category == "IN") {
                vm.sumdata[k].pottbeaeq += response.data[j].aeq;
              }
              else if (vm.sumdata[k].date == response.data[j].days && response.data[j].category == "P3") {
                vm.sumdata[k].pottfordaeq += response.data[j].aeq;
              }
              else if (vm.sumdata[k].date == response.data[j].days && response.data[j].category == "OUT") {
                vm.sumdata[k].pottkiaeq += response.data[j].aeq;
              }
            }
          }
        });
      }
    }

    function loadall() {
      loadsm();
      loadpotting();
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

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.edate=$filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      datediff();
      loadPartnumbers();
      loadsm();
      loadpotting();
    }
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
