define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter, $q) {
    var vm = this;
    vm.data = [];
    vm.zbdata = [];
    vm.zw1000 = [];
    vm.zw1500 = [];
    vm.daystocover = [];
    vm.displaydata = [];
    vm.trendize = trendize;
    vm.trendizess = trendizess;
    vm.zwsm = ["SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.zbsm = ["SM1", "SM2"];
    vm.zwpo = ["Potting2", "Potting3", "Potting4"];
    vm.zbpo = ["Potting1-1", "Potting1-2"];

    vm.start = start;

    function loadPartnumbers() {
      vm.partnumbers = [];
      dataService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }
    function load1000Partnumbers() {
      vm.partnumbers1000 = [];
      dataService.get1000partnumber().then(function (response) {
        vm.partnumbers1000 = response.data;
      });
    }

    function trendize(index, field) {
      var act = $filter('filter')(vm.sapdata, { day: vm.displaydata[index].day })[0];
      var prev = $filter('filter')(vm.sapdata, { day: vm.displaydata[index - 1].day })[0];
      if (act && prev) {
        return act[field] > prev[field] ? false : true;
      }
    }

    function trendizess(index, field) {
      var act = $filter('filter')(vm.sapdata, { day: vm.daystocover[index] })[0];
      var prev = $filter('filter')(vm.sapdata, { day: vm.daystocover[index - 1] })[0];
      if (act && prev) {
        return act[field] > prev[field] ? false : true;
      }
    }

    function start() {
      vm.load = true;
      vm.data = [];
      vm.zbdata = [];
      vm.zw1000 = [];
      vm.zw1500 = [];
      vm.daystocover = [];
      vm.szamlalo = 0;
      var ds = (new Date(vm.enddate).getTime() + (24 * 1000 * 60 * 60) - new Date(vm.startdate).getTime()) / (1000 * 24 * 60 * 60);
      var dt = "";

      for (var i = 0; i < ds; i++) {
        dt = $filter('date')(new Date(vm.startdate).getTime() + i * 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
        vm.daystocover.push(dt);
      }


      //SAP
      vm.sapdata = [];
      vm.totalsapdata = [];
      dataService.getsapdata().then(function (response) {
        var dat = response.data.data;
        vm.totalsapdata = response.data.data;
        for(var k = 0; k < vm.totalsapdata.length; k++){
          var q = 1;
          switch ($filter('date')(new Date(vm.totalsapdata[k].NAP), "MM")){
            case "01": q = 1;break;
            case "02": q = 1;break;
            case "03": q = 1;break;
            case "04": q = 2;break;
            case "05": q = 2;break;
            case "06": q = 2;break;
            case "07": q = 3;break;
            case "08": q = 3;break;
            case "09": q = 3;break;
            case "10": q = 4;break;
            case "11": q = 4;break;
            case "12": q = 4;break;
          }
          vm.totalsapdata[k].q = q;
        }
        vm.sapdatacrdate = response.data.crdate;
        for (var i = 0; i < dat.length; i++) {
          if (new Date(dat[i].NAP).getTime() >= new Date(vm.startdate).getTime() && new Date(dat[i].NAP).getTime() <= new Date(vm.enddate).getTime()) {
            vm.sapdata.push({
              day: dat[i].NAP,
              zw500kdiff: parseFloat(dat[i].ZW0500kummDIFF),
              zw500p: parseFloat(dat[i].ZW0500Plan),
              zw500a: parseFloat(dat[i].ZW0500Actual),
              zw1000p: parseFloat(dat[i].ZW1000Plan),
              zw1000a: parseFloat(dat[i].ZW1000Actual),
              zw1000kdiff: parseFloat(dat[i].ZW1000kummDIFF),
              zw1500p: parseFloat(dat[i].ZW1500Plan),
              zw1500a: parseFloat(dat[i].ZW1500Actual),
              zw1500kdiff: parseFloat(dat[i].ZW1500kummDIFF),
              zba: parseFloat(dat[i].ZBActual),
              zbp: parseFloat(dat[i].ZBPlan),
              zbkdiff: parseFloat(dat[i].ZBkummDiff),
              zlkdiff: parseFloat(dat[i].ZLkummDiff)
            });
          }
        }
        //console.log(vm.sapdata);
        populate();
      });

      //ZW500
      /*for (var k = 0; k < vm.zwsm.length; k++) {
        dataService.getsm(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd'), vm.zwsm[k]).then(function (response) {
          for (var r = 0; r < response.data.length; r++) {
            response.data[r].aeq = aeqser(response.data[r].type, true);
            response.data[r].days = $filter('date')(new Date(response.data[r].days).getTime(), "yyyy-MM-dd");
            response.data[r].sumaeq = response.data[r].aeq * response.data[r].amount;
            vm.data.push(response.data[r]);
          }
          populate();
        });
      }
      for (var k = 0; k < vm.zwpo.length; k++) {
        dataService.getpotting(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd'), vm.zwpo[k]).then(function (response) {
          for (var r = 0; r < response.data.length; r++) {
            response.data[r].aeq = aeqser(response.data[r].type, false);
            response.data[r].days = $filter('date')(new Date(response.data[r].days).getTime(), "yyyy-MM-dd");
            response.data[r].sumaeq = response.data[r].aeq * response.data[r].amount;
            vm.data.push(response.data[r]);
          }
          populate();
        });
      }*/
      //ZB
      /*for (var k = 0; k < vm.zbsm.length; k++) {
        dataService.getsm(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd'), vm.zbsm[k]).then(function (response) {
          for (var r = 0; r < response.data.length; r++) {
            response.data[r].aeq = aeqser(response.data[r].type, true);
            response.data[r].days = $filter('date')(new Date(response.data[r].days).getTime(), "yyyy-MM-dd");
            response.data[r].sumaeq = response.data[r].aeq * response.data[r].amount;
            vm.zbdata.push(response.data[r]);
          }
          populate();
        });
      }
      for (var k = 0; k < vm.zbpo.length; k++) {
        dataService.getpotting(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd'), vm.zbpo[k]).then(function (response) {
          for (var r = 0; r < response.data.length; r++) {
            response.data[r].aeq = aeqser(response.data[r].type, false);
            response.data[r].days = $filter('date')(new Date(response.data[r].days).getTime(), "yyyy-MM-dd");
            response.data[r].sumaeq = response.data[r].aeq * response.data[r].amount;
            vm.zbdata.push(response.data[r]);
          }
          populate();
        });
      }*/

      loadPartnumbers();
      function aeqserloadpartnumbers(type, forsheet) {
        var aeq = 0;
        for (var x = 0; x < vm.partnumbers.length; x++) {
          if (vm.partnumbers[x].id === type) {
            if (forsheet) {
              aeq = vm.partnumbers[x].aeq / vm.partnumbers[x].sheets;
            } else {
              aeq = vm.partnumbers[x].aeq * 1;
            }
          } else {
          }

        }
        return aeq;
      }

      dataService.getsmtable(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd')).then(function (response) {
        for (var r = 0; r < response.data.length; r++) {

          response.data[r].machine = "Sheetmaker";
          response.data[r].partnumber = response.data[r].type;
          response.data[r].shiftnum = response.data[r].ShiftNum;
          response.data[r].aeq = aeqserloadpartnumbers(response.data[r].type, true);
          response.data[r].days = $filter('date')(new Date(response.data[r].Day).getTime(), "yyyy-MM-dd");
          response.data[r].Totalsheets = parseInt(response.data[r].Totalsheets);
          response.data[r].ScrapSheets = response.data[r].ScrapSheets ? parseInt(response.data[r].ScrapSheets) : 0;
          response.data[r].sumgoodaeq = response.data[r].aeq * (response.data[r].Totalsheets - response.data[r].ScrapSheets);
          //vm.data.push(response.data[r]);

          if (response.data[r].MachineName != "SheetMaker1" && response.data[r].MachineName != "SheetMaker2") {
            vm.data.push(response.data[r]);
          }
          else {
            vm.zbdata.push(response.data[r]);
          }
        }
        populate();
      });
      dataService.getpottingtable(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd')).then(function (response) {
        for (var r = 0; r < response.data.length; r++) {

          response.data[r].machine = "Potting";
          response.data[r].partnumber = response.data[r].type;
          response.data[r].aeq = aeqserloadpartnumbers(response.data[r].type, false);
          response.data[r].days = $filter('date')(new Date(response.data[r].Day).getTime(), "yyyy-MM-dd");
          response.data[r].In = response.data[r].In != "" ? parseInt(response.data[r].In) : 0;
          response.data[r].P3 = response.data[r].P3 != "" ? parseInt(response.data[r].P3) : 0;
          response.data[r].Out = response.data[r].Out != "" ? parseInt(response.data[r].Out) : 0;
          response.data[r].suminaeq = response.data[r].aeq * response.data[r].In;
          response.data[r].sump3aeq = response.data[r].aeq * response.data[r].P3;
          response.data[r].sumoutaeq = response.data[r].aeq * response.data[r].Out;
          //vm.data.push(response.data[r]);
          if (response.data[r].MachineName != "Potting" && response.data[r].MachineName != "Static Potting S1") {
            vm.data.push(response.data[r]);
          }
          else {
            vm.zbdata.push(response.data[r]);
          }
        }
        populate();
      });

      for (var k = 0; k < vm.daystocover.length; k++) {
        dataService.getmtf(vm.daystocover[k].replace(/-/g, '')).then(function (response) {
          for (var r = 0; r < response.data.length; r++) {
            if (response.data[r].category != 'BOK-BOKES') {
              if (response.data[r].category === 'MIN-AMOUNT') {
                if (response.data[r].type === 'A') {
                  response.data[r].aeq = aeqser(response.data[r].place.replace('_MIN', ''), false);
                } else {
                  response.data[r].aeq = aeqser(response.data[r].place + '-' + response.data[r].type, false);
                }
              } else {
                response.data[r].aeq = aeqser(response.data[r].type, false);
              }
              response.data[r].sumaeq = response.data[r].aeq * response.data[r].amount;
            }
            response.data[r].days = $filter('date')(new Date(response.data[r].days).getTime(), "yyyy-MM-dd");
            response.data[r].machine = "MTF";
            vm.data.push(response.data[r]);
          }
          populate();
        });
      }

      dataService.getetf1000($filter('date')(new Date(vm.startdate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd'), $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd')).then(function (response) {
        for (var r = 0; r < response.data.length; r++) {
          response.data[r].cnt = parseInt(response.data[r].cnt);
          var gradenum = new Date(response.data[r].Gradedate).getHours() * 60 + new Date(response.data[r].Gradedate).getMinutes();

          if (gradenum < 350) {
            response.data[r].gradeday = $filter('date')(new Date(response.data[r].Gradedate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[r].gradeday = $filter('date')(new Date(response.data[r].Gradedate).getTime(), 'yyyy-MM-dd');
          }
          for (var xx = 0; xx < vm.partnumbers1000.length; xx++) {
            if (response.data[r].jobid.includes(vm.partnumbers1000[xx].modul)) {
              response.data[r].aeq = vm.partnumbers1000[xx].aeq;
            }
          }
          if (response.data[r].gradeday >= vm.startdate && response.data[r].gradeday <= vm.enddate && response.data[r].Grade!="") {
            vm.zw1000.push(response.data[r]);
          }
        }
        console.log(vm.zw1000);
      });
      dataService.getgradebyd1500(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd')).then(function (response) {
        for (var r = 0; r < response.data.length; r++) {
          response.data[r].cnt = parseInt(response.data[r].cnt);
          if (response.data[r].descr.includes('short')) {
            response.data[r].aeq = response.data[r].cnt * 0.6;
          } else {
            response.data[r].aeq = response.data[r].cnt * 1.2;
          }
          vm.zw1500.push(response.data[r]);
        }
      });

      vm.rates = {
        smscrap: 0.8,
        modscrap: 0.5,
        bp: 240,
        min: 235,
        zbsmscrap: 5,
        zbmodscrap: 3,
        zbbp: 14.8,
        zbmin: 14.4,
        zw1000min: 80,
        zw1500min: 80
      }

      //console.log(vm.displaydata);
      vm.load=false;
    }

    function populate() {
      console.log(vm.data);
      vm.szamlalo++;
      if (vm.szamlalo >= 13 + vm.daystocover.length) {
        vm.load = false;
      }
      vm.displaydata = [];
      for (var k = 0; k < vm.daystocover.length; k++) {
        vm.displaydata.push({
          day: vm.daystocover[k],
          sm: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'Sheetmaker' }), 'sumgoodaeq'),
          pin: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'Potting' }), 'suminaeq'),
          pp3: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'Potting'}), 'sump3aeq'),
          pou: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'Potting'}), 'sumoutaeq'),
          ch: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'CH-OUT', type: '!ZB500S' }), 'sumaeq'),
          bp: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'BP-OUT', type: '!ZB500S' }), 'sumaeq'),
          bok: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'BOK-BOKES', type: '!ZB500S' }), 'amount') / $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'BP-OUT', type: '!ZB500S' }), 'sumaeq'),
          min: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'MIN-AMOUNT', place: '!ZB500S_MIN' }), 'sumaeq'),
          zbsm: $filter('sumField')($filter('filter')(vm.zbdata, { days: vm.daystocover[k], machine: 'Sheetmaker' }), 'sumgoodaeq'),
          zbpin: $filter('sumField')($filter('filter')(vm.zbdata, { days: vm.daystocover[k], machine: 'Potting'}, true), 'suminaeq'),
          zbpp3: $filter('sumField')($filter('filter')(vm.zbdata, { days: vm.daystocover[k], machine: 'Potting'}, true), 'sump3aeq'),
          zbpou: $filter('sumField')($filter('filter')(vm.zbdata, { days: vm.daystocover[k], machine: 'Potting'}, true), 'sumoutaeq'),
          zbmin: $filter('sumField')($filter('filter')(vm.zbdata, { days: vm.daystocover[k], machine: 'Static Potting S1'}, true), 'suminaeq'),
          zbmp3: $filter('sumField')($filter('filter')(vm.zbdata, { days: vm.daystocover[k], machine: 'Static Potting S1'}, true), 'sump3aeq'),
          zbmou: $filter('sumField')($filter('filter')(vm.zbdata, { days: vm.daystocover[k], machine: 'Static Potting S1'}, true), 'sumoutaeq'),
          zbch: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'CH-OUT', type: 'ZB500S' }), 'sumaeq'),
          zbbp: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'BP-OUT', type: 'ZB500S' }), 'sumaeq'),
          zbbok: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'BOK-BOKES', type: 'ZB500S' }), 'amount') / $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'BP-OUT', type: 'ZB500S' }), 'sumaeq'),
          zbmin: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'MIN-AMOUNT', place: 'ZB500S_MIN' }), 'sumaeq')
        });
      }
    }

    function aeqser(type, forsheet) {
      var aeq = 0;
      for (var x = 0; x < vm.aeqs.length; x++) {
        if (vm.aeqs[x].name === type) {
          if (forsheet) {
            aeq = vm.aeqs[x].amount / vm.aeqs[x].sheets;
          } else {
            aeq = vm.aeqs[x].amount;
          }
        } else {
        }

      }
      return aeq;
    }

    activate();

    function activate() {
      if (!$cookies.getObject('user')) {
        $state.go('login')
      } else {
        $rootScope.user = $cookies.getObject('user');
        vm.edate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.startdate = $filter('date')(new Date().getTime() - 7 * 24 * 1000 * 60 * 60, 'yyyy-MM-dd');
        vm.enddate = $filter('date')(new Date().getTime() - 24 * 1000 * 60 * 60, 'yyyy-MM-dd');

        //loadPartnumbers();
        vm.sh = true;
        vm.s5 = false;
        vm.s3 = false;
        load1000Partnumbers();
        start();
        vm.qs = false;

      }
    }

    vm.cpxaeqs = [
      { item: '450', aeq: 0.9 },
      { item: '550', aeq: 1.1 },
      { item: '500', aeq: 1 },
      { item: '700', aeq: 1.4 }
    ]

    vm.aeqs = [
      { name: "Ds12 FLOW", amount: 0.6, sheets: 12 },
      { name: "DS12FLOW", amount: 0.6, sheets: 12 },
      { name: "DS-D12 FLOW", amount: 0.6, sheets: 12 },
      { name: "ZW220 CP5", amount: 0.44, sheets: 28 },
      { name: "ZW230 FLOW", amount: 0.46, sheets: 28 },
      { name: "ZW230 CP5", amount: 0.46, sheets: 28 },
      { name: "C11CP5", amount: 0.5, sheets: 11 },
      { name: "C11 CP5", amount: 0.5, sheets: 11 },
				{ name: "C11 CP55", amount: 0.5, sheets: 11},
      { name: "C11FLOW", amount: 0.5, sheets: 11 },
      { name: "C11 FLOW", amount: 0.5, sheets: 11 },
      { name: "D11 CP5", amount: 0.68, sheets: 11 },
      { name: "D11 CP55", amount: 0.68, sheets: 11 },
      { name: "D13 CP5", amount: 0.88, sheets: 13 },
      { name: "D12 FLOW", amount: 0.74, sheets: 12 },
      { name: "DX", amount: 0.74, sheets: 12 },
      { name: "D11 FLOW", amount: 0.68, sheets: 11 },
      { name: "A27 CP5", amount: 1, sheets: 27 },
      { name: "A27 FLOW", amount: 1, sheets: 27 },
      { name: "B32 CP5", amount: 1.3, sheets: 32 },
      { name: "B32 FLOW", amount: 1.3, sheets: 32 },
      { name: "DS- D13 CP5", amount: 0.7, sheets: 13 },
      { name: "ZW500Ds13 old yarn CP5", amount: 0.7, sheets: 13 },
      { name: "ZW500Ds13 new yarn CP5", amount: 0.7, sheets: 13 },
      { name: "ZW500Ds12 old yarn FLOW", amount: 0.6, sheets: 12 },
      { name: "ZW500Ds12 new yarn FLOW", amount: 0.6, sheets: 12 },
      { name: " D13 CP5", amount: 0.88, sheets: 13 },
      { name: "DS13CP5", amount: 0.7, sheets: 13 },
      { name: "DS-D13 CP5", amount: 0.7, sheets: 13 },
      { name: "DS-D13 CP55", amount: 0.7, sheets: 13 },
      { name: "ZB500S", amount: 0.6, sheets: 16 },
      { name: "ZB500", amount: 0.6, sheets: 16 },
      { name: "UBB FLOW", amount: 0.6, sheets: 16 },
      { name: "UBB CP5", amount: 0.6, sheets: 16 },
      { name: "UBB Block", amount: 0.6 / 4, sheets: 4 }
    ];
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter', '$q'];
  return Controller;
});
