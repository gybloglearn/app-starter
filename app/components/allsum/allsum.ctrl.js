define([], function () {
  'use strict';
  function Controller(allsumService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.date = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.sm = [];
    vm.callsm = callsm;

    function loadPartnumbers() {
      vm.partnumbers = [];
      allsumService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
        console.log(vm.partnumbers);
      });
    }

    function callsm() {
      vm.loaddata = true;
      vm.sm = [];
      for (var i = 0; i < vm.sheetmakers.length; i++) {
        vm.sm[i] = {};
        vm.sm[i].id = vm.sheetmakers[i];
        vm.sm[i].musz = 0;
        vm.sm[i].szerv = 0;
        vm.sm[i].terv = 0;
        vm.sm[i].jo = 0;
        vm.sm[i].jaeq = 0;
        vm.sm[i].ossz = 0;
        vm.sm[i].oaeq = 0;
        vm.sm[i].selejt = 0;
        vm.sm[i].saeq = 0;
        vm.sm[i].misstime = 0;
        vm.sm[i].timediff = 0;
        vm.sm[i].alltime = 1440 * 60;
      }
      vm.sm[i] = {}
      vm.sm[i].id = "SMS";
      vm.sm[i].musz = 0;
      vm.sm[i].szerv = 0;
      vm.sm[i].terv = 0;
      vm.sm[i].jo = 0;
      vm.sm[i].jaeq = 0;
      vm.sm[i].ossz = 0;
      vm.sm[i].oaeq = 0;
      vm.sm[i].selejt = 0;
      vm.sm[i].saeq = 0;
      vm.sm[i].misstime = 0;
      vm.sm[i].timediff = 0;
      vm.sm[i].alltime = vm.sheetmakers.length * 1440 * 60;

      load();
    }

    function load() {
      vm.tervezett = [
        { name: "101 - üresjárat (nem kell gyártani)", time: 0 },
        { name: "102 - kísérlet", time: 0 },
        { name: "103 - oktatás", time: 0 },
        { name: "104 - takarítás", time: 0 },
        { name: "105 - spoolcsere", time: 0 },
        { name: "106 - laminálcsík töltés", time: 0 },
        { name: "107 - normál keretfeladás , új fésű felrakása", time: 0 },
        { name: "108 - TMK", time: 0 },
        { name: "109 - termékváltás (csak a norma szerinti)", time: 0 },
        { name: "110 - Keretenkénti lap mérése", time: 0 },
        { name: "111 - Egyéb - kötelező szöveges beviteli mező", time: 0 }
      ];
      vm.szervezesi = [
        { name: "201 - Segédeszköz (keret, fésű, U alak) hiány", time: 0 },
        { name: "202 - létszámhiány", time: 0 },
        { name: "203 - Egyéb, nem SM géphiba miatti állás", time: 0 },
        { name: "204 - alap - vagy segédanyaghiány", time: 0 },
        { name: "205 - szárító tele van", time: 0 },
        { name: "206 - Munkaidő veszteseg", time: 0 },
        { name: "207 - Lapdurrogtatas", time: 0 },
        { name: "20105 - SpoolCsere - norma fölött", time: 0 },
        { name: "20107 - Normál keretfeladás, új fésű felrakása - normafölött", time: 0 },
        { name: "20106 - Lamináltcsík töltés - norma fölött", time: 0 },
      ];
      vm.muszaki = [
        { name: "301 - Maximo van - kötelező számot felvinni", time: 0 },
        { name: "302 - gépbeállítás - beállító operátor", time: 0 },
        { name: "303 - (maximo nincs) - vaklárma", time: 0 },
        { name: "304 - laphossz - beállító operátor", time: 0 },
        { name: "305 - laphossz - karbantartó", time: 0 },
        { name: "306 - ragcsík / laminált - beállító operátor", time: 0 },
        { name: "307 - ragcsík / laminált - karbantartó - maximo", time: 0 },
        { name: "308 - Lapmérés", time: 0 }
      ];

      angular.forEach(vm.sheetmakers, function (v, k) {
        allsumService.get(vm.date, v).then(function (response) {
          for (var i = 0; i < response.data.length; i++) {
            var tmb = response.data[i];
            var diff = 0;
            var k = i + 1;

            if (k <= response.data.length - 1) {
              diff = (response.data[k].timestamp - response.data[i].timestamp) / 1000;
            }

            for (var j = 0; j < vm.sheetmakers.length; j++) {
              if (v == vm.sheetmakers[j] && tmb.Ev_Group == "Tervezett veszteseg") {
                vm.sm[j].terv += tmb.Event_time;
                vm.sm[vm.sheetmakers.length].terv += tmb.Event_time;
              }
              else if (v == vm.sheetmakers[j] && tmb.Ev_Group == "Szervezesi veszteseg") {
                vm.sm[j].szerv += tmb.Event_time;
                vm.sm[vm.sheetmakers.length].szerv += tmb.Event_time;
              }
              else if (v == vm.sheetmakers[j] && tmb.Ev_Group == "Muszaki technikai okok") {
                vm.sm[j].musz += tmb.Event_time;
                vm.sm[vm.sheetmakers.length].musz += tmb.Event_time;
              }
              else if (v == vm.sheetmakers[j]) {
                vm.sm[j].misstime += diff;
                vm.sm[j].timediff += diff - tmb.Event_time;
                vm.sm[vm.sheetmakers.length].misstime += diff;
                vm.sm[vm.sheetmakers.length].timediff += diff - tmb.Event_time;
              }
            }
            for (var a = 0; a < vm.tervezett.length; a++) {
              if (vm.tervezett[a].name == response.data[i].Event_SubGroup) {
                vm.tervezett[a].time += response.data[i].Event_time;
              }
            }
            for (var b = 0; b < vm.szervezesi.length; b++) {
              if (vm.szervezesi[b].name == response.data[i].Event_SubGroup) {
                vm.szervezesi[b].time += response.data[i].Event_time;
              }
            }
            for (var c = 0; c < vm.muszaki.length; c++) {
              if (vm.muszaki[c].name == response.data[i].Event_SubGroup) {
                vm.muszaki[c].time += response.data[i].Event_time;
              }
            }
          }
        });
      });
      loadsm();
    }

    function loadsm() {
      allsumService.getsheet(vm.date, $filter('date')(new Date(vm.date).getTime() + 24 * 60 * 60 * 1000, "yyyy-MM-dd")).then(function (response) {
        var d = response.data;

        for (var i = 0; i < vm.partnumbers.length; i++) {
          for (var j = 0; j < d.length; j++) {
            if (vm.partnumbers[i].id == d[j].type) {
              d[j].Goodsheets = d[j].Totalsheets - d[j].ScrapSheets;
              d[j].Goodaeq = ((d[j].Totalsheets - d[j].ScrapSheets) / vm.partnumbers[i].sheets) * vm.partnumbers[i].aeq;
              d[j].Scrapaeq = (d[j].ScrapSheets / vm.partnumbers[i].sheets) * vm.partnumbers[i].aeq;
              d[j].Totalaeq = (d[j].Totalsheets / vm.partnumbers[i].sheets) * vm.partnumbers[i].aeq;
              d[j].shortname = d[j].MachineName[0] + d[j].MachineName[5] + d[j].MachineName[10];
            }
          }
        }

        for (var j = 0; j < d.length; j++) {
          for (var k = 0; k < vm.sheetmakers.length; k++) {
            if (d[j].shortname == vm.sm[k].id) {
              vm.sm[k].jo += d[j].Goodsheets * 1;
              vm.sm[k].jaeq += d[j].Goodaeq * 1;
              vm.sm[k].selejt += d[j].ScrapSheets * 1;
              vm.sm[k].saeq += d[j].Scrapaeq * 1;
              vm.sm[k].ossz += d[j].Totalsheets * 1;
              vm.sm[k].oaeq += d[j].Totalaeq * 1;
              vm.sm[vm.sheetmakers.length].jo += d[j].Goodsheets * 1;
              vm.sm[vm.sheetmakers.length].jaeq += d[j].Goodaeq * 1;
              vm.sm[vm.sheetmakers.length].selejt += d[j].ScrapSheets * 1;
              vm.sm[vm.sheetmakers.length].saeq += d[j].Scrapaeq * 1;
              vm.sm[vm.sheetmakers.length].ossz += d[j].Totalsheets * 1;
              vm.sm[vm.sheetmakers.length].oaeq += d[j].Totalaeq * 1;
            }
          }
        }
        console.log(vm.sm);
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadPartnumbers();
    }

    /*vm.tervezett = [
      { name: "101 - üresjárat (nem kell gyártani)", time: 0 },
      { name: "102 - kísérlet", time: 0 },
      { name: "103 - oktatás", time: 0 },
      { name: "104 - takarítás", time: 0 },
      { name: "105 - spoolcsere", time: 0 },
      { name: "106 - laminálcsík töltés", time: 0 },
      { name: "107 - normál keretfeladás , új fésű felrakása", time: 0 },
      { name: "108 - TMK", time: 0 },
      { name: "109 - termékváltás (csak a norma szerinti)", time: 0 },
      { name: "110 - Keretenkénti lap mérése", time: 0 },
      { name: "111 - Egyéb - kötelező szöveges beviteli mező", time: 0 }
    ];
    vm.szervezesi = [
      { name: "201 - Segédeszköz (keret, fésű, U alak) hiány", time: 0 },
      { name: "202 - létszámhiány", time: 0 },
      { name: "203 - Egyéb, nem SM géphiba miatti állás", time: 0 },
      { name: "204 - alap - vagy segédanyaghiány", time: 0 },
      { name: "205 - szárító tele van", time: 0 },
      { name: "206 - Munkaidő veszteseg", time: 0 },
      { name: "207 - Lapdurrogtatas", time: 0 },
      { name: "20105 - SpoolCsere - norma fölött", time: 0 },
      { name: "20107 - Normál keretfeladás, új fésű felrakása - normafölött", time: 0 },
      { name: "20106 - Lamináltcsík töltés - norma fölött", time: 0 },
    ];
    vm.muszaki = [
      { name: "301 - Maximo van - kötelező számot felvinni", time: 0 },
      { name: "302 - gépbeállítás - beállító operátor", time: 0 },
      { name: "303 - (maximo nincs) - vaklárma", time: 0 },
      { name: "304 - laphossz - beállító operátor", time: 0 },
      { name: "305 - laphossz - karbantartó", time: 0 },
      { name: "306 - ragcsík / laminált - beállító operátor", time: 0 },
      { name: "307 - ragcsík / laminált - karbantartó - maximo", time: 0 },
      { name: "308 - Lapmérés", time: 0 }
    ];*/
  }
  Controller.$inject = ['allsumService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});