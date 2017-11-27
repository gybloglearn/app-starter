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

    function loadPartnumbers() {
      vm.partnumbers = [];
      dataService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }

    function iconize(number, field, shiftnum) {
      var target = 0;
      var div = shiftnum>0?2:1;
      switch (field) {
        case 'sm':
          //var number = $filter('sumField')($filter('filter')(vm.data, {machine: 'SheetMaker', shift: shiftnum}), 'sumaeq');
          target = (vm.rates.min / div) / (1 - vm.rates.modscrap / 100) / (1 - vm.rates.smscrap / 100) / (1440/div) * vm.passedmins[shiftnum];
          console.log(number + " - to - " + target);
          break;
        case 'potting':
          target = (vm.rates.min / div) / (1 - vm.rates.modscrap / 100) / (1440/div) * vm.passedmins[shiftnum];
          console.log(number + " - to - " + target);
          break;
        case 'bp':
          target = (vm.rates.bp / div) / (1440/div) * vm.passedmins[shiftnum];
          console.log(number + " - to - " + target);
          break;
        case 'min':
          target = (vm.rates.min / div) / (1440/div) * vm.passedmins[shiftnum];
          console.log(number + " - to - " + target);
          break;
      }
      if(number > 0) {
        return number < target ? 'text-ge-red icon-warning-sign':'text-ge-green icon-ok-sign';
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
      //var ds = (new Date(vm.enddate).getTime() + (24 * 1000 * 60 * 60) - new Date(vm.startdate).getTime()) / (1000 * 24 * 60 * 60);
      var dt = "";
      var ds = 1;
      for (var i = 0; i < ds; i++) {
        dt = $filter('date')(new Date(vm.startdate).getTime() + i * 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
        vm.daystocover.push(dt);
      }
      vm.enddate = $filter('date')(new Date(vm.startdate) + 24 * 60 * 60 * 1000, 'yyyy-MM-dd');

      //ZW500
      for (var k = 0; k < vm.zwsm.length; k++) {
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
      }
      //ZB
      for (var k = 0; k < vm.zbsm.length; k++) {
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
      }

      for (var k = 0; k < vm.daystocover.length; k++) {
        if (new Date(vm.daystocover[k]).getTime() < new Date($filter('date')(new Date().getTime(), 'yyyy-MM-dd')).getTime()) {
          dataService.getmtf(vm.daystocover[k].replace(/-/g, '')).then(function (response) {
            //console.log(response.data);
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
        } else {
          dataService.gettodaymtf(vm.daystocover[k]).then(function (response) {
            //console.log(response.data);
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
      }

      dataService.getgradebyd1000(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd')).then(function (response) {
        for (var r = 0; r < response.data.length; r++) {
          response.data[r].cnt = parseInt(response.data[r].cnt);
          if (response.data[r].descr.includes('450')) {
            response.data[r].aeq = response.data[r].cnt * 0.9;
          } else if (response.data[r].descr.includes('550')) {
            response.data[r].aeq = response.data[r].cnt * 1.1;
          } if (response.data[r].descr.includes('700')) {
            response.data[r].aeq = response.data[r].cnt * 1.4;
          } else {
            response.data[r].aeq = response.data[r].cnt * 1;
          }
          vm.zw1000.push(response.data[r]);
        }

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
        bp: 230,
        min: 220,
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
      if (vm.szamlalo >= 13 + vm.daystocover.length) {
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

    activate();

    function activate() {
      if (!$cookies.getObject('user')) {
        $state.go('login')
      } else {
        $rootScope.user = $cookies.getObject('user');
        vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
        vm.startdate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
        vm.enddate = $filter('date')(new Date(vm.startdate).getTime(), 'yyyy-MM-dd');

        //loadPartnumbers();
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
      { name: "ZW220 CP5", amount: 0.44, sheets: 28 },
      { name: "ZW230 FLOW", amount: 0.46, sheets: 28 },
      { name: "ZW230 CP5", amount: 0.46, sheets: 28 },
      { name: "C11CP5", amount: 0.5, sheets: 11 },
      { name: "C11 CP5", amount: 0.5, sheets: 11 },
      { name: "C11FLOW", amount: 0.5, sheets: 11 },
      { name: "C11 FLOW", amount: 0.5, sheets: 11 },
      { name: "D11 CP5", amount: 0.68, sheets: 11 },
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