define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (7 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.startdatumszam = $filter('date')(new Date().getTime() - (7 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.enddatumszam = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.sheetmakers = ["SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.zbsheetmakers = ["SM1", "SM2"];
    vm.pottings = ["Potting2", "Potting3", "Potting4"];
    vm.zbpottings = ["Potting1-1", "Potting1-2"];
    vm.AEQ1000 = [0.9, 1.1, 1, 1.4];
    vm.AEQ1500 = [0.6, 1.2];
    vm.partnumbers = [];
    vm.dates = [];
    vm.mtfdates = [];
    vm.sumdata500 = [];
    vm.sumdata1000 = [];
    vm.sumdata1500 = [];
    vm.sumdatazb = [];
    vm.differencedate = 0;
    vm.loadall = loadall;
    vm.addSLDate = addSLDate;
    vm.addSMDate = addSMDate;
    vm.addPottDate = addPottDate;
    vm.addMTFDate = addMTFDate;

    function loadPartnumbers() {
      vm.partnumbers = [];
      dataService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
        var obj = {};
        obj = {
          id: "0000000",
          name: "ZB500",
          aeq: "0.6",
          sheets: "16"
        };
        vm.partnumbers.push(obj);
        //console.log(vm.partnumbers);
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
      vm.mtfdates = [];
      vm.sumdata500 = [];
      vm.sumdata1000 = [];
      vm.sumdata1500 = [];
      vm.sumdatazb = [];
      vm.differencedate = (new Date(vm.enddatumszam).getTime() - new Date(vm.startdatumszam).getTime()) / (24 * 3600 * 1000);
      for (var i = 0; i <= vm.differencedate; i++) {
        vm.dates[i] = $filter('date')(new Date(vm.enddatumszam).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.mtfdates[i] = $filter('date')(new Date(vm.enddatumszam).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyyMMdd');
        vm.sumdata500[i] = {}
        vm.sumdata500[i].date = $filter('date')(new Date(vm.enddatumszam).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.sumdata500[i].slaeq = 0;
        vm.sumdata500[i].smaeq = 0;
        vm.sumdata500[i].pottbeaeq = 0;
        vm.sumdata500[i].pottfordaeq = 0;
        vm.sumdata500[i].pottkiaeq = 0;
        vm.sumdata500[i].bpaeq = 0;
        vm.sumdata500[i].claeq = 0;
        vm.sumdata500[i].bokes = 0;
        vm.sumdata500[i].min = 0;

        vm.sumdata1000[i] = {}
        vm.sumdata1000[i].date = $filter('date')(new Date(vm.enddatumszam).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.sumdata1000[i].sumgoodaeq = 0;
        vm.sumdata1000[i].sumscrapaeq = 0;

        vm.sumdata1500[i] = {}
        vm.sumdata1500[i].date = $filter('date')(new Date(vm.enddatumszam).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.sumdata1500[i].sumgoodaeq = 0;
        vm.sumdata1500[i].sumscrapaeq = 0;

        vm.sumdatazb[i] = {}
        vm.sumdatazb[i].date = $filter('date')(new Date(vm.enddatumszam).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.sumdatazb[i].smaeq = 0;
        vm.sumdatazb[i].pottbeaeq = 0;
        vm.sumdatazb[i].pottmodbeaeq = 0;
        vm.sumdatazb[i].pottkiaeq = 0;
        vm.sumdatazb[i].bpaeq = 0;
        vm.sumdatazb[i].claeq = 0;
        vm.sumdatazb[i].bokes = 0;
        vm.sumdatazb[i].min = 0;
      }
    }


    function loadsl() {
      dataService.getsl(vm.startdate, vm.enddate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          for (var k = 0; k < vm.sumdata500.length; k++) {
            if (vm.sumdata500[k].date == response.data[j].item1) {
              vm.sumdata500[k].slaeq += response.data[j].textbox2 * 1;
            }
          }
        }
      });
    }

    function loadsm() {
      vm.smloading = true;
      for (var i = 0; i < vm.sheetmakers.length; i++) {
        dataService.getsm(vm.startdate, vm.enddate, vm.sheetmakers[i]).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].aeq = getAEQ(vm.partnumbers, response.data[j].type, response.data[j].amount);
            response.data[j].days = response.data[j].days.substring(0, 10);
            for (var k = 0; k < vm.sumdata500.length; k++) {
              if (vm.sumdata500[k].date == response.data[j].days && response.data[j].category == "GOOD") {
                vm.sumdata500[k].smaeq += response.data[j].aeq;
              }
            }
          }
          vm.smloading = false;
        });
      }
    }

    function loadzbsm() {
      //vm.smloading = true;
      for (var i = 0; i < vm.zbsheetmakers.length; i++) {
        dataService.getsm(vm.startdate, vm.enddate, vm.zbsheetmakers[i]).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].aeq = getAEQ(vm.partnumbers, response.data[j].type, response.data[j].amount);
            response.data[j].days = response.data[j].days.substring(0, 10);
            for (var k = 0; k < vm.sumdatazb.length; k++) {
              if (vm.sumdatazb[k].date == response.data[j].days && response.data[j].category == "GOOD") {
                vm.sumdatazb[k].smaeq += response.data[j].aeq;
              }
            }
          }
          //vm.smloading = false;
        });
      }
    }

    function loadpotting() {
      vm.pottloading = true;
      for (var i = 0; i < vm.pottings.length; i++) {
        dataService.getpotting(vm.startdate, vm.enddate, vm.pottings[i]).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].aeq = addAEQ(vm.aeqs, response.data[j].type, response.data[j].amount);
            response.data[j].days = response.data[j].days.substring(0, 10);
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
          vm.pottloading = false;
        });
      }
      loadzbpotting1();
      loadzbpotting2();
    }

    function loadzbpotting1() {
      dataService.getpotting(vm.startdate, vm.enddate, "Potting1-1").then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          response.data[j].aeq = (response.data[j].amount / 4) * 0.6;
          response.data[j].days = response.data[j].days.substring(0, 10);
          for (var k = 0; k < vm.sumdatazb.length; k++) {
            if (vm.sumdatazb[k].date == response.data[j].days && response.data[j].category == "IN") {
              vm.sumdatazb[k].pottbeaeq += response.data[j].aeq;
            }
          }
        }
      });
    }

    function loadzbpotting2() {
      dataService.getpotting(vm.startdate, vm.enddate, "Potting1-2").then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          response.data[j].aeq = (response.data[j].amount) * 0.6;
          response.data[j].days = response.data[j].days.substring(0, 10);
          for (var k = 0; k < vm.sumdatazb.length; k++) {
            if (vm.sumdatazb[k].date == response.data[j].days && response.data[j].category == "IN") {
              vm.sumdatazb[k].pottmodbeaeq += response.data[j].aeq;
            }
            else if (vm.sumdatazb[k].date == response.data[j].days && response.data[j].category == "OUT") {
              vm.sumdatazb[k].pottkiaeq += response.data[j].aeq;
            }
          }
        }
      });
    }


    function loadmtf() {
      vm.mtfloading = true;
      for (var i = 0; i < vm.mtfdates.length; i++) {
        dataService.getmtf(vm.mtfdates[i]).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].days = response.data[j].days.substring(0, 10);
            for (var l = 0; l < vm.aeqs.length; l++) {
              if (response.data[j].type.indexOf(vm.aeqs[l].name) > -1)
                response.data[j].aeq = response.data[j].amount * vm.aeqs[l].amount;
              else if (response.data[j].place.indexOf(vm.aeqs[l].name) > -1)
                response.data[j].aeq = response.data[j].amount * vm.aeqs[l].amount;
            }
            for (var k = 0; k < vm.sumdata500.length; k++) {
              if (vm.sumdata500[k].date == response.data[j].days && response.data[j].category == "BP-OUT" && response.data[j].type != "ZB500S")
                vm.sumdata500[k].bpaeq += response.data[j].aeq;
              if (vm.sumdata500[k].date == response.data[j].days && response.data[j].category == "CH-OUT" && response.data[j].type != "ZB500S")
                vm.sumdata500[k].claeq += response.data[j].aeq;
              if (vm.sumdata500[k].date == response.data[j].days && response.data[j].category == "BOK-BOKES" && response.data[j].type != "ZB500S")
                vm.sumdata500[k].bokes += response.data[j].amount;
              if (vm.sumdata500[k].date == response.data[j].days && response.data[j].category == "MIN-AMOUNT" && response.data[j].place != "ZB500S_MIN")
                vm.sumdata500[k].min += response.data[j].aeq;
            }
            for (var k = 0; k < vm.sumdata500.length; k++) {
              if (vm.sumdatazb[k].date == response.data[j].days && response.data[j].category == "BP-OUT" && response.data[j].type == "ZB500S")
                vm.sumdatazb[k].bpaeq += response.data[j].aeq;
              if (vm.sumdatazb[k].date == response.data[j].days && response.data[j].category == "CH-OUT" && response.data[j].type == "ZB500S")
                vm.sumdatazb[k].claeq += response.data[j].aeq;
              if (vm.sumdatazb[k].date == response.data[j].days && response.data[j].category == "BOK-BOKES" && response.data[j].type == "ZB500S")
                vm.sumdatazb[k].bokes += response.data[j].amount;
              if (vm.sumdatazb[k].date == response.data[j].days && response.data[j].category == "MIN-AMOUNT" && response.data[j].place == "ZB500S_MIN")
                vm.sumdatazb[k].min += response.data[j].aeq;
            }
          }

          vm.mtfloading = false;
        });
      }
    }

    function loadgrade1000() {
      vm.ZW1000loading = true;
      dataService.getgradebyd1000(vm.startdate, vm.enddate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          if (response.data[j].descr.includes("450")) {
            response.data[j].aeq = response.data[j].cnt * vm.AEQ1000[0];
          }
          else if (response.data[j].descr.includes("Junior")) {
            response.data[j].aeq = response.data[j].cnt * 0;
          }
          else if (response.data[j].descr.includes("550")) {
            response.data[j].aeq = response.data[j].cnt * vm.AEQ1000[1];
          }
          else if (response.data[j].descr.includes("500")) {
            response.data[j].aeq = response.data[j].cnt * vm.AEQ1000[2];
          }
          else if (response.data[j].descr.includes("700")) {
            response.data[j].aeq = response.data[j].cnt * vm.AEQ1000[3];
          }
          for (var k = 0; k < vm.sumdata1000.length; k++) {
            if (vm.sumdata1000[k].date == response.data[j].gradeday && response.data[j].MCSGrade == "Scrap") {
              vm.sumdata1000[k].sumscrapaeq += response.data[j].aeq;
            }
            else if (vm.sumdata1000[k].date == response.data[j].gradeday && response.data[j].MCSGrade != "Scrap") {
              vm.sumdata1000[k].sumgoodaeq += response.data[j].aeq;
            }
          }
        }
        vm.ZW1000loading = false;
      });

    }
    function loadgrade1500() {
      vm.ZW1500loading = true;
      dataService.getgradebyd1500(vm.startdate, vm.enddate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          if (response.data[j].descr.includes("short")) {
            response.data[j].aeq = response.data[j].cnt * vm.AEQ1500[0];
          }
          else {
            response.data[j].aeq = response.data[j].cnt * vm.AEQ1500[1];
          }
          for (var k = 0; k < vm.sumdata1500.length; k++) {
            if (vm.sumdata1500[k].date == response.data[j].gradeday && response.data[j].MCSGrade == "Scrap") {
              vm.sumdata1500[k].sumscrapaeq += response.data[j].aeq;
            }
            else if (vm.sumdata1500[k].date == response.data[j].gradeday && response.data[j].MCSGrade != "Scrap") {
              vm.sumdata1500[k].sumgoodaeq += response.data[j].aeq;
            }
          }
        }
        vm.ZW1500loading = false;
      });

    }

    function loadall() {
      beallit();
      loadsl();
      loadsm();
      loadzbsm();
      loadpotting();
      loadmtf();
      loadgrade1000();
      loadgrade1500();
      vm.enddate = vm.enddatumszam;
    }

    function getAEQ(tomb, azon, am) {
      var aeq = 0;

      var substr = azon.indexOf(' ') == -1 ? azon.substring(0, 3) : azon.substring(0, azon.indexOf(' '));

      if (substr.substring(0, 2) == "ZL")
        substr = "ZL";
      if (azon.indexOf('DS -D13') > -1) {
        substr = 'Ds13'
      }
      if (azon.indexOf('DS12') > -1) {
        substr = "Ds12";
      }
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
      if (azon.indexOf('DS -D13') > -1) {
        substr = "Ds13";
      }
      if (azon.indexOf('DS12') > -1) {
        substr = "Ds12";
      }
      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].name.includes(substr)) {
          aeq = am * parseFloat(tomb[i].amount);
        }
      }
      return aeq;
    }

    function addSLDate(datum) {
      $state.go('dayreport', { datum: datum, place: "SL" });
    }

    function addSMDate(datum) {
      $state.go('dayreport', { datum: datum, place: "SM" });
    }

    function addPottDate(datum) {
      $state.go('dayreport', { datum: datum, place: "Potting" });
    }

    function addMTFDate(datum) {
      $state.go('dayreport', { datum: datum, place: "MTF" });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.edate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      datediff();
      loadPartnumbers();
      loadsl();
      loadsm();
      loadzbsm();
      loadpotting();
      loadmtf();
      loadgrade1000();
      loadgrade1500();
    }

    vm.aeqs = [
      { name: "Ds12 FLOW", amount: 0.6 },
      { name: "DS12FLOW", amount: 0.6 },
      { name: "ZW220 CP5", amount: 0.44 },
      { name: "ZW230 FLOW", amount: 0.46 },
      { name: "ZW230 CP5", amount: 0.46 },
      { name: "C11CP5", amount: 0.5 },
      { name: "C11 CP5", amount: 0.5 },
      { name: "C11FLOW", amount: 0.5 },
      { name: "C11 FLOW", amount: 0.5 },
      { name: "D11 CP5", amount: 0.68 },
      { name: "D13 CP5", amount: 0.88 },
      { name: "D12 FLOW", amount: 0.74 },
      { name: "DX", amount: 0.74 },
      { name: "D11 FLOW", amount: 0.68 },
      { name: "A27 CP5", amount: 1 },
      { name: "A27 FLOW", amount: 1 },
      { name: "B32 CP5", amount: 1.3 },
      { name: "B32 FLOW", amount: 1.3 },
      { name: "DS- D13 CP5", amount: 0.7 },
      { name: " D13 CP5", amount: 0.7 },
      { name: "D13 CP5", amount: 0.7 },
      { name: "DS13CP5", amount: 0.7 },
      { name: "ZB500S", amount: 0.6 }
    ];
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});