define([], function () {
  'use strict';
  function Controller(sscrapService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.sm = [];
    vm.load = load;

    function load() {
      vm.sm = [];
      var counter = 0;
      for (var i = 0; i < vm.sheetmakers.length; i++) {
        sscrapService.getsheet(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd'), vm.sheetmakers[i]).then(function (response) {
          counter++;
          response.data = $filter('orderBy')(response.data, ['type']);
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].date = $filter('date')(new Date(response.data[j].days).getTime(), 'yyyy-MM-dd');
            response.data[j].id = response.data[j].shortname;
            response.data[j].shiftnum = parseInt(response.data[j].shiftnum);
            response.data[j].shift = $filter('shift')(response.data[j].shiftnum, response.data[j].date);
            response.data[j].aeq = parseFloat($filter('filter')(vm.aeqs, { name: response.data[j].type }, true)[0].amount);
            response.data[j].sheets = parseInt($filter('filter')(vm.aeqs, { name: response.data[j].type }, true)[0].sheets);
            response.data[j].sumaeq = response.data[j].amount / response.data[j].sheets * response.data[j].aeq;
            response.data[j].modul = Math.floor(response.data[j].amount / response.data[j].sheets);
            response.data[j].lsh = (response.data[j].amount - response.data[j].modul * response.data[j].sheets);
            if (response.data[j].category == 'GOOD') {
              response.data[j].ttlamount = response.data[j - 1].amount;
              vm.sm.push(response.data[j]);
            }
          }
          if (counter == vm.sheetmakers.length) {
            scrapload();
          }
        });
      }
    }

    function scrapload() {
      sscrapService.getscrap(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd')).then(function (response) {
        for (var i = 0; i < vm.sm.length; i++) {
          vm.sm[i].bad = 0;
          for (var j = 0; j < response.data.length; j++) {
            if (vm.sm[i].date == response.data[j].day && vm.sm[i].shift == response.data[j].shift && vm.sm[i].id.includes(response.data[j].sm)) {
              vm.sm[i].bad += response.data[j].pc;
            }
          }
        }
        console.log(vm.sm);
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
      load();
    }

    vm.aeqs = [
      { name: "Ds12 FLOW", amount: 0.6, sheets: 12 },
      { name: "DS12FLOW", amount: 0.6, sheets: 12 },
      { name: "DS-D12 FLOW", amount: 0.6, sheets: 12 },
      { name: "CS-D12 FLOW", amount: 0.6, sheets: 12 },
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
  Controller.$inject = ['sscrapService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});