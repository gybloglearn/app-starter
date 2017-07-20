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
    vm.AEQ1000 = [0.9, 1.1, 1.2, 1.4];
    vm.AEQ1500 = [0.6, 1.2];
    vm.partnumbers = [];
    vm.smdata = [];
    vm.pottingdata = [];
    vm.grade1000data = [];
    vm.grade1500data = [];
    vm.dates = [];
    vm.sumdata500 = [];
    vm.sumdata1000 = [];
    vm.sumdata1500 = [];
    vm.differencedate = 0;
    vm.loadall = loadall;

    function loadPartnumbers() {
      vm.partnumbers = [];
      dataService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }

    function beallit() {
      vm.startdatumszam = vm.startdate;
      vm.enddatumszam = vm.enddate;
      vm.enddate = $filter('date')(new Date(vm.enddate).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      datediff();
    }

    function datediff() {
      vm.differencedate = 0;
      vm.dates = [];
      vm.sumdata500 = [];
      vm.sumdata1000 = [];
      vm.sumdata1500 = [];
      vm.differencedate = (new Date(vm.enddatumszam).getTime() - new Date(vm.startdatumszam).getTime()) / (24 * 3600 * 1000);
      for (var i = 0; i <= vm.differencedate; i++) {
        vm.dates[i] = $filter('date')(new Date(vm.enddatumszam).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.sumdata500[i] = {}
        vm.sumdata500[i].date = $filter('date')(new Date(vm.enddatumszam).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.sumdata500[i].smaeq = 0;
        vm.sumdata500[i].pottbeaeq = 0;
        vm.sumdata500[i].pottfordaeq = 0;
        vm.sumdata500[i].pottkiaeq = 0;

        vm.sumdata1000[i] = {}
        vm.sumdata1000[i].date = $filter('date')(new Date(vm.enddatumszam).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.sumdata1000[i].sumgoodaeq = 0;
        vm.sumdata1000[i].sumscrapaeq = 0;

        vm.sumdata1500[i] = {}
        vm.sumdata1500[i].date = $filter('date')(new Date(vm.enddatumszam).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.sumdata1500[i].sumgoodaeq = 0;
        vm.sumdata1500[i].sumscrapaeq = 0;
      }
      console.log(vm.dates);
      console.log(vm.sumdata500);
      console.log(vm.sumdata1000);
      console.log(vm.sumdata1500);
    }


    function loadsm() {
      vm.smdata = [];
      for (var i = 0; i < vm.sheetmakers.length; i++) {
        dataService.getsm(vm.startdate, vm.enddate, vm.sheetmakers[i]).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].aeq = getAEQ(vm.partnumbers, response.data[j].type, response.data[j].amount);
            response.data[j].days = response.data[j].days.substring(0, 10);
            vm.smdata.push(response.data[j]);
            for (var k = 0; k < vm.sumdata500.length; k++) {
              if (vm.sumdata500[k].date == response.data[j].days && response.data[j].category == "GOOD") {
                vm.sumdata500[k].smaeq += response.data[j].aeq;
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
            for (var k = 0; k < vm.sumdata500.length; k++) {
              if (vm.sumdata500[k].date == response.data[j].days && response.data[j].category == "IN") {
                vm.sumdata500[k].pottbeaeq += response.data[j].aeq;
              }
              else if (vm.sumdata500[k].date == response.data[j].days && response.data[j].category == "P3") {
                vm.sumdata500[k].pottfordaeq += response.data[j].aeq;
              }
              else if (vm.sumdata500[k].date == response.data[j].days && response.data[j].category == "OUT") {
                vm.sumdata500[k].pottkiaeq += response.data[j].aeq;
              }
            }
          }
        });
      }
    }

    function loadgrade1000() {
      vm.grade1000data = [];
      dataService.getgradebyd1000(vm.startdate, vm.enddate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          if (response.data[j].descr.includes("450")) {
            response.data[j].aeq = response.data[j].cnt * vm.AEQ1000[0];
          }
          else if (response.data[j].descr.includes("550")) {
            response.data[j].aeq = response.data[j].cnt * vm.AEQ1000[0];
          }
          else if (response.data[j].descr.includes("600")) {
            response.data[j].aeq = response.data[j].cnt * vm.AEQ1000[0];
          }
          else if (response.data[j].descr.includes("700")) {
            response.data[j].aeq = response.data[j].cnt * vm.AEQ1000[0];
          }
          vm.grade1000data.push(response.data[j]);
          for (var k = 0; k < vm.sumdata1000.length; k++) {
            if (vm.sumdata1000[k].date == response.data[j].gradeday && response.data[j].MCSGrade == "Scrap") {
              vm.sumdata1000[k].sumscrapaeq += response.data[j].aeq;
            }
            else if (vm.sumdata1000[k].date == response.data[j].gradeday && response.data[j].MCSGrade != "Scrap") {
              vm.sumdata1000[k].sumgoodaeq += response.data[j].aeq;
            }
          }
        }
      });

    }
    function loadgrade1500() {
      vm.grade1500data = [];
      dataService.getgradebyd1500(vm.startdate, vm.enddate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          if (response.data[j].descr.includes("short")) {
            response.data[j].aeq = response.data[j].cnt * vm.AEQ1500[0];
          }
          else {
            response.data[j].aeq = response.data[j].cnt * vm.AEQ1500[1];
          }
          vm.grade1500data.push(response.data[j]);
          for (var k = 0; k < vm.sumdata1500.length; k++) {
            if (vm.sumdata1500[k].date == response.data[j].gradeday && response.data[j].MCSGrade == "Scrap") {
              vm.sumdata1500[k].sumscrapaeq += response.data[j].aeq;
            }
            else if (vm.sumdata1500[k].date == response.data[j].gradeday && response.data[j].MCSGrade != "Scrap") {
              vm.sumdata1500[k].sumgoodaeq += response.data[j].aeq;
            }
          }
        }
      });

    }

    function loadall() {
      beallit();
      loadsm();
      loadpotting();
      loadgrade1000();
      loadgrade1500();
      vm.enddate = vm.enddatumszam;
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
      vm.edate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      datediff();
      loadPartnumbers();
      loadsm();
      loadpotting();
      loadgrade1000();
      loadgrade1500();
    }
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
