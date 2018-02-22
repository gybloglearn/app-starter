define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.zbdata = [];
    vm.zw1000 = [];
    vm.zw1500 = [];
    vm.daystocover = [];
    vm.displaydata = [];
    vm.iconize = iconize;
    vm.zwsm = ["SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.zbsm = ["SM1", "SM2"];
    vm.zwpo = ["Potting2", "Potting3", "Potting4"];
    vm.zbpo = ["Potting1-1", "Potting1-2"];

    vm.start = start;
    vm.filterSMs = filterSMs;

    function loadPartnumbers() {
      vm.partnumbers = [];
      dataService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }

    function iconize(number, field, shiftnum) {
      var target = 0;
      var div = shiftnum > 0 ? 2 : 1;
      switch (field) {
        case 'sm':
          //var number = $filter('sumField')($filter('filter')(vm.data, {machine: 'SheetMaker', shift: shiftnum}), 'sumaeq');
          target = (vm.rates.min / div) / (1 - vm.rates.modscrap / 100) / (1 - vm.rates.smscrap / 100) / (1440 / div) * vm.passedmins[shiftnum];
          //console.log(number + " - to - " + target);
          break;
        case 'potting':
          target = (vm.rates.min / div) / (1 - vm.rates.modscrap / 100) / (1440 / div) * vm.passedmins[shiftnum];
          //console.log(number + " - to - " + target);
          break;
        case 'bp':
          target = (vm.rates.bp / div) / (1440 / div) * vm.passedmins[shiftnum];
          //console.log(number + " - to - " + target);
          break;
        case 'min':
          target = (vm.rates.min / div) / (1440 / div) * vm.passedmins[shiftnum];
          //console.log(number + " - to - " + target);
          break;
      }
      if (number > 0) {
        return number < target ? 'red' : 'green';
      }

    }

    function filterSMs(sms){
      var result = [];
      var dt = $filter('filter')(vm.data, vm.search);
      for (var i = 0; i < dt.length; i++){
        if(sms.indexOf(dt[i].MachineName) > -1){
          result.push(dt[i]);
        }
      }
      return result;
    }

    function start() {
      vm.load = true;
      vm.data = [];
      vm.zbdata = [];
      vm.zw1000 = [];
      vm.zw1500 = [];
      vm.daystocover = [];
      vm.reworkobj=[
        {shiftnum:1,shift:$filter('shift')(1, vm.startdate)},
        {shiftnum:3,shift:$filter('shift')(3, vm.startdate)}
      ];
      vm.szamlalo = 0;
      //var ds = (new Date(vm.enddate).getTime() + (24 * 1000 * 60 * 60) - new Date(vm.startdate).getTime()) / (1000 * 24 * 60 * 60);
      var dt = "";
      var ds = 1;
      for (var i = 0; i < ds; i++) {
        dt = $filter('date')(new Date(vm.startdate).getTime() + i * 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
        vm.daystocover.push(dt);
      }
      vm.enddate = $filter('date')(new Date(vm.startdate) + 24 * 60 * 60 * 1000, 'yyyy-MM-dd');

      //ZW500
      dataService.getsmtable(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd')).then(function (response) {
        for (var r = 0; r < response.data.length; r++) {
          if (response.data[r].MachineName != "SheetMaker1" && response.data[r].MachineName != "SheetMaker2") {
            response.data[r].machine = "Sheetmaker";
            response.data[r].partnumber = response.data[r].type;
            response.data[r].shiftnum = response.data[r].ShiftNum;
            response.data[r].aeq = aeqserloadpartnumbers(response.data[r].type, true);
            response.data[r].days = $filter('date')(new Date(response.data[r].Day).getTime(), "yyyy-MM-dd");
            response.data[r].Totalsheets = parseInt(response.data[r].Totalsheets);
            response.data[r].ScrapSheets = response.data[r].ScrapSheets ? parseInt(response.data[r].ScrapSheets) : 0;
            response.data[r].sumgoodaeq = response.data[r].aeq * (response.data[r].Totalsheets - response.data[r].ScrapSheets);
            vm.data.push(response.data[r]);
          }
        }
        //populate();
      });
      dataService.getpottingtable(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd')).then(function (response) {
        for (var r = 0; r < response.data.length; r++) {
          if (response.data[r].MachineName != "Potting1-1" && response.data[r].MachineName != "Potting1-2") {
            response.data[r].machine = "Potting";
            response.data[r].partnumber = response.data[r].type;
            response.data[r].aeq = aeqserloadpartnumbers(response.data[r].type, false);
            response.data[r].days = $filter('date')(new Date(response.data[r].Day).getTime(), "yyyy-MM-dd");
            response.data[r].In = response.data[r].In!=""?parseInt(response.data[r].In):0;
            response.data[r].P3 = response.data[r].P3!=""?parseInt(response.data[r].P3):0;
            response.data[r].Out = response.data[r].Out!=""?parseInt(response.data[r].Out):0;
            response.data[r].suminaeq = response.data[r].aeq * response.data[r].In;
            response.data[r].sumoutaeq = response.data[r].aeq * response.data[r].Out;
            vm.data.push(response.data[r]);
          }
        }
        //populate();
      });
      //ZB
      /*dataService.getsmtable(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd')).then(function (response) {
        for (var r = 0; r < response.data.length; r++) {
          if (response.data[r].MachineName == "SheetMaker1" || response.data[r].MachineName == "SheetMaker2") {
            response.data[r].aeq = aeqser(response.data[r].type, true);
            response.data[r].days = $filter('date')(new Date(response.data[r].days).getTime(), "yyyy-MM-dd");
            response.data[r].sumaeq = response.data[r].aeq * response.data[r].amount;
            vm.zbdata.push(response.data[r]);
          }
        }
        //populate();
      });
      for (var k = 0; k < vm.zbpo.length; k++) {
        dataService.getpotting(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd'), vm.zbpo[k]).then(function (response) {
          for (var r = 0; r < response.data.length; r++) {
            response.data[r].aeq = aeqser(response.data[r].type, false);
            response.data[r].days = $filter('date')(new Date(response.data[r].days).getTime(), "yyyy-MM-dd");
            response.data[r].sumaeq = response.data[r].aeq * response.data[r].amount;
            vm.zbdata.push(response.data[r]);
          }
          //populate();
        });
      }*/

      dataService.getmtftable(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd')).then(function (response) {
        for (var r = 0; r < response.data.length; r++) {
          if(response.data[r].PartGroup_Name != "UBB FLOW") {
            response.data[r].machine = "MTF";
            response.data[r].partnumber = response.data[r].type;
            response.data[r].aeq = aeqserloadpartnumbers(response.data[r].type, false);
            response.data[r].days = $filter('date')(new Date(response.data[r].Day).getTime(), "yyyy-MM-dd");
            response.data[r].BOKES = response.data[r].BOKES * 1;
            response.data[r].CHOUT = response.data[r].CHOUT!=""?parseInt(response.data[r].CHOUT):0;
            response.data[r].BPOUT = response.data[r].BPOUT!=""?parseInt(response.data[r].BPOUT):0;
            response.data[r].GRADED = response.data[r].GRADED!=""?parseInt(response.data[r].GRADED):0;
            response.data[r].choutaeq = response.data[r].aeq * response.data[r].CHOUT;
            response.data[r].sumaeq = response.data[r].aeq * response.data[r].BPOUT;
            response.data[r].gradeaeq = response.data[r].aeq * response.data[r].GRADED;
            vm.data.push(response.data[r]);
          }
        }
      });

      dataService.getrework(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd')).then(function (response) {
        for (var r = 0; r < response.data.length; r++) {
          if(response.data[r].BaaNCode != "3149069") {
            response.data[r].machine = "Rework";
            response.data[r].partnumber = response.data[r].BaaNCode;
            response.data[r].aeq = aeqserloadpartnumbers(response.data[r].BaaNCode, false);
            for(var ob=0;ob<vm.reworkobj.length;ob++){
              if(response.data[r].shift==vm.reworkobj[ob].shift){
                response.data[r].shiftnum=vm.reworkobj[ob].shiftnum;
              }
            }
            vm.data.push(response.data[r]);
          }
        }
        vm.load = false;
      });


      vm.rates = {
        smscrap: 0.8,
        modscrap: 0.5,
        bp: 230,
        min: 226,
        zbsmscrap: 5,
        zbmodscrap: 3,
        zbbp: 0,
        zbmin: 0,
        zw1000min: 56,
        zw1500min: 60
      }

      vm.passedmins = [];
      if ((new Date().getTime() - new Date(vm.startdate + " 05:50:00").getTime()) / 1000 / 60 > 1440) {
        vm.passedmins[1] = 720;
        vm.passedmins[3] = 720;
        vm.passedmins[0] = 1440;
      } else {
        vm.pms = (new Date().getTime() - new Date(vm.startdate + " 05:50:00").getTime()) / 1000 / 60;
        if (vm.pms < 720) {
          vm.passedmins[1] = vm.pms;
          vm.passedmins[3] = 0;
          vm.passedmins[0] = vm.pms;
        } else {
          vm.passedmins[1] = 720;
          vm.passedmins[3] = vm.pms - 720;
          vm.passedmins[0] = vm.pms;
        }
      }
    }

    function populate() {
      vm.szamlalo++;
      if (vm.szamlalo >= 4 + vm.daystocover.length) {
        vm.load = false;
      }
      vm.displaydata = [];
      for (var k = 0; k < vm.daystocover.length; k++) {
        /*vm.displaydata.push({
          day: vm.daystocover[k],
          sm: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'Sheetmaker', category: 'GOOD' }), 'sumaeq'),
          pin: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'Potting', category: 'IN' }), 'sumaeq'),
          pp3: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'Potting', category: 'P3' }), 'sumaeq'),
          pou: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'Potting', category: 'OUT' }), 'sumaeq'),
          ch: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'CH-OUT', type: '!ZB500S' }), 'sumaeq'),
          bp: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'BP-OUT', type: '!ZB500S' }), 'sumaeq'),
          bok: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'BOK-BOKES', type: '!ZB500S' }), 'amount') / $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'BP-OUT', type: '!ZB500S' }), 'sumaeq'),
          min: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'MIN-AMOUNT', place: '!ZB500S_MIN' }), 'sumaeq'),
          zbsm: $filter('sumField')($filter('filter')(vm.zbdata, { days: vm.daystocover[k], machine: 'Sheetmaker', category: 'GOOD' }), 'sumaeq'),
          zbpin: $filter('sumField')($filter('filter')(vm.zbdata, { days: vm.daystocover[k], machine: 'Potting', machine: '!Static Potting S1', category: 'IN' }), 'sumaeq'),
          zbpp3: $filter('sumField')($filter('filter')(vm.zbdata, { days: vm.daystocover[k], machine: 'Potting', machine: '!Static Potting S1', category: 'P3' }), 'sumaeq'),
          zbpou: $filter('sumField')($filter('filter')(vm.zbdata, { days: vm.daystocover[k], machine: 'Static Potting S1', category: 'OUT' }), 'sumaeq'),
          zbch: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'CH-OUT', type: 'ZB500S' }), 'sumaeq'),
          zbbp: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'BP-OUT', type: 'ZB500S' }), 'sumaeq'),
          zbbok: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'BOK-BOKES', type: 'ZB500S' }), 'amount') / $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'BP-OUT', type: 'ZB500S' }), 'sumaeq'),
          zbmin: $filter('sumField')($filter('filter')(vm.data, { days: vm.daystocover[k], machine: 'MTF', category: 'MIN-AMOUNT', place: 'ZB500S_MIN' }), 'sumaeq')
        });*/
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

    activate();

    function activate() {
      if (!$cookies.getObject('user')) {
        $state.go('login')
      } else {
        $rootScope.user = $cookies.getObject('user');
        vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
        vm.startdate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
        vm.enddate = $filter('date')(new Date(vm.startdate).getTime(), 'yyyy-MM-dd');
        vm.search = {};
        loadPartnumbers();
        vm.sh = false;
        vm.s5 = false;
        vm.s3 = false;
        start();
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
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
