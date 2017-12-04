define([], function () {
  'use strict';
  function Controller(sscrapService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime() + 24 * 60 * 60 * 1000, 'yyyy-MM-dd');
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.sm = [];
    vm.createdate = createdate;

    function createdate(dt) {
      vm.enddate = $filter('date')(new Date(dt).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      createsheetmakers(vm.startdate, vm.enddate);
    }

    function createsheetmakers(dt1, dt2) {
      vm.sm = [];
      var difference = ((new Date(dt2).getTime() - new Date(dt1).getTime()) / (24 * 3600 * 1000)) - 1;

      for (var i = 0; i <= difference; i++) {
        var actdate = $filter('date')(new Date(dt2).getTime() - ((i + 1) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        for (var j = 0; j < vm.sheetmakers.length; j++) {
          var obj = {};
          obj.id = vm.sheetmakers[j];
          obj.date = actdate;
          obj.shiftnum = 1;
          obj.type = "";
          obj.good = 0;
          obj.total = 0;
          obj.bad = 0;
          obj.diff = 0;
          obj.modul = 0;
          obj.lsh = 0;
          obj.aeq = 0;

          var obj2 = {};
          obj2.id = vm.sheetmakers[j];
          obj2.date = actdate;
          obj2.shiftnum = 3;
          obj.type = "";
          obj2.good = 0;
          obj2.total = 0;
          obj2.bad = 0;
          obj2.diff = 0;
          obj2.modul = 0;
          obj2.lsh = 0;
          obj2.aeq = 0;

          vm.sm.push(obj);
          vm.sm.push(obj2);
        }
      }
      load();
    }

    function load() {
      for (var i = 0; i < vm.sheetmakers.length; i++) {
        sscrapService.getsheet(vm.startdate, vm.enddate, vm.sheetmakers[i]).then(function (response) {
          for (var j = 0; j < vm.sm.length; j++) {
            for (var k = 0; k < response.data.length; k++) {
              var actdate = $filter('date')(new Date(response.data[k].days).getTime(), 'yyyy-MM-dd');
              if (vm.sm[j].id == response.data[k].shortname && vm.sm[j].shiftnum == response.data[k].shiftnum && vm.sm[j].date == actdate && response.data[k].category == "TOTAL") {
                vm.sm[j].type = response.data[k].type;
                vm.sm[j].total = response.data[k].amount;
              }
              else if (vm.sm[j].id == response.data[k].shortname && vm.sm[j].shiftnum == response.data[k].shiftnum && vm.sm[j].date == actdate && response.data[k].category == "GOOD") {
                vm.sm[j].good = response.data[k].amount;
                vm.sm[j].diff = vm.sm[j].total - response.data[k].amount;
                vm.sm[j].aeq = parseFloat(response.data[k].amount / parseInt($filter('filter')(vm.aeqs, { name: response.data[k].type })[0].sheets) * parseFloat($filter('filter')(vm.aeqs, { name: response.data[k].type }, true)[0].amount));
                vm.sm[j].modul = Math.floor(response.data[k].amount / parseInt($filter('filter')(vm.aeqs, { name: response.data[k].type })[0].sheets));
                vm.sm[j].lsh = response.data[k].amount - (vm.sm[j].modul * parseInt($filter('filter')(vm.aeqs, { name: response.data[k].type })[0].sheets));
              }
            }
          }
          if(i == vm.sheetmakers.length ){
            calc();
          }
        });
      }
      scrapload();
    }

    function calc(){
      vm.sm = $filter('orderBy')(vm.sm, ['id', 'date', 'shiftnum']);
      for(var z = 0; z < vm.sm.length; z++){
        if(z > 0) {
          var sheets = parseInt($filter('filter')(vm.aeqs, {name: vm.sm[z].type})[0].sheets);
          console.log(sheets);
          if(vm.sm[z].shiftnum == 1){
            var d = $filter('date')(new Date(vm.sm[z].date).getTime() - 24*60*60*1000, 'yyyy-MM-dd');
            var prev = $filter('filter')(vm.sm, {date: d, id: vm.sm[z].id, type: vm.sm[z].type, shiftnum: 3 });
            if(prev.length > 0){
              vm.sm[z].modul = Math.floor((vm.sm[z].good + prev[0].lsh) / sheets);
              vm.sm[z].lsh = vm.sm[z].good + prev[0].lsh - (vm.sm[z].modul * sheets);
            }
          } else {
            var prev = $filter('filter')(vm.sm, {date: vm.sm[z].date, id: vm.sm[z].id, type: vm.sm[z].type, shiftnum: 1 });
            if(prev.length > 0){
              vm.sm[z].modul = Math.floor((vm.sm[z].good + prev[0].lsh) / sheets);
              vm.sm[z].lsh = vm.sm[z].good + prev[0].lsh - (vm.sm[z].modul * sheets);
            }
          }
          console.log(vm.sm[z]);
          console.log(prev);
        }
      }
      /*for(var z = 0; z < vm.sm.length; z++){
        var athoz = 0;
        if(z > 0){
          if(vm.sm[z].shiftnum == 1) {
            var d = $filter('date')(new Date(vm.sm[z].date).getTime() - 24*60*60*1000);
            if(new Date(d).getTime() > new Date(vm.startdate).getTime()){
              athoz = $filter('filter')(vm.sm, {id: vm.sm[z].id, date: d, type: vm.sm[z].type, shiftnum: 3})[0].lsh;
            }
          } else {
            var a = $filter('filter')(vm.sm, {id: vm.sm[z].id, date: vm.sm[z].date, type: vm.sm[z].type, shiftnum: 1});
            console.log(vm.sm[z]);
            console.log(a);
            athoz = $filter('filter')(vm.sm, {id: vm.sm[z].id, date: vm.sm[z].date, type: vm.sm[z].type, shiftnum: 1})[0].lsh;
          }
          console.log(athoz);
        }
      }*/

    }

    function scrapload() {
      sscrapService.getscrap(vm.startdate, vm.enddate).then(function (response) {
        for (var i = 0; i < vm.sm.length; i++) {
          vm.sm[i].shift = $filter('shift')(vm.sm[i].shiftnum, vm.sm[i].date);
          for (var j = 0; j < response.data.length; j++) {
            if (vm.sm[i].date == response.data[j].day && vm.sm[i].shift == response.data[j].shift && vm.sm[i].id.includes(response.data[j].sm)) {
              vm.sm[i].bad += response.data[j].pc;
            }
          }
        }
      });
      vm.enddate = $filter('date')(new Date(vm.enddate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));

      vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
      createsheetmakers(vm.startdate, vm.enddate);
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