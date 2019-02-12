define([], function () {
  'use strict';
  function Controller(allsumService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.date = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.sm = [];
    vm.callsm = callsm;
    vm.create_allday_data = create_allday_data;
    vm.exportToCSV = exportToCSV;
    vm.clr = clr;
    vm.smtarget = 250;
    vm.bptarget = 250;
    vm.mintarget = 250;
    vm.loading = false;

    function loadPartnumbers() {
      vm.partnumbers = [];
      allsumService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
        console.log(vm.partnumbers);
      });
    }

    function callsm() {

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
      vm.loading = true;
      vm.tervezett = [
        { name: "101 - üresjárat (nem kell gyártani)", time: 0, descr: "" },
        { name: "102 - kísérlet", time: 0, descr: "" },
        { name: "103 - oktatás", time: 0, descr: "" },
        { name: "104 - takarítás", time: 0, descr: "" },
        { name: "105 - spoolcsere", time: 0, descr: "" },
        { name: "106 - laminálcsík töltés", time: 0, descr: "" },
        { name: "107 - normál keretfeladás , új fésű felrakása", time: 0, descr: "" },
        { name: "108 - TMK", time: 0, descr: "" },
        { name: "109 - termékváltás (csak a norma szerinti)", time: 0, descr: "" },
        { name: "110 - Keretenkénti lap mérése", time: 0, descr: "" },
        { name: "111 - Egyéb - kötelező szöveges beviteli mező", time: 0, descr: "" }
      ];
      vm.szervezesi = [
        { name: "201 - Segédeszköz (keret, fésű, U alak) hiány", time: 0, descr: "" },
        { name: "202 - Létszámhiány", time: 0, descr: "" },
        { name: "203 - Egyéb, nem SM géphiba miatti állás ", time: 0, descr: "" },
        { name: "204 - alap - vagy segédanyaghiány", time: 0, descr: "" },
        { name: "205 - Szárító tele van", time: 0, descr: "" },
        { name: "206 - Munkaidő veszteseg", time: 0, descr: "" },
        { name: "207 - Lapdurrogtatas", time: 0, descr: "" },
        { name: "11103 - Összerendelés / Papírmunka", time: 0, descr: "" },
        { name: "20105 - SpoolCsere - norma fölött", time: 0, descr: "" },
        { name: "20106 - Lamináltcsík töltés-norma fölött", time: 0, descr: "" },
        { name: "20107 - Normál keretfeladás, új fésű felrakása-normafölött", time: 0, descr: "" },
      ];
      vm.muszaki = [
        { name: "301 - Maximo van - kötelező számot felvinni", time: 0, descr: "" },
        { name: "302 - gépbeállítás - beállító operátor", time: 0, descr: "" },
        { name: "303 - (maximo nincs) - vaklárma", time: 0, descr: "" },
        { name: "304 - laphossz - beállító operátor", time: 0, descr: "" },
        { name: "305 - laphossz karbantartó kötelező maximo", time: 0, descr: "" },
        { name: "306 - ragcsík / laminált - beállító operátor", time: 0, descr: "" },
        { name: "307 - ragcsík / laminált - karbantartó - maximo", time: 0, descr: "" },
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
              vm.sm[vm.sheetmakers.length].misstime += diff;
              vm.sm[vm.sheetmakers.length].timediff += diff - tmb.Event_time;
            }

            for (var j = 0; j < vm.sheetmakers.length; j++) {
              if (v == vm.sheetmakers[j]) {
                vm.sm[j].misstime += diff;
                vm.sm[j].timediff += diff - tmb.Event_time;
              }

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
          vm.loading = false;
        });
      });
    }

    function create_allday_data() {
      vm.daydata = [];
      var ob = {
        otszaz: 0,
        zbzl: 0,
        osszes: 0,
        otszazbp: 0,
        zbzlbp: 0,
        osszesbp: 0,
        minotszaz: 0,
        minzbzl: 0,
        minosszes: 0
      };
      vm.daydata.push(ob);
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
          for (var k = 0; k < vm.daydata.length; k++) {
            if (d[j].shortname == "SM1" || d[j].shortname == "SM2") {
              vm.daydata[k].zbzl += d[j].Goodaeq * 1;
              vm.daydata[k].osszes += d[j].Goodaeq * 1;
            }
            else {
              vm.daydata[k].otszaz += d[j].Goodaeq * 1;
              vm.daydata[k].osszes += d[j].Goodaeq * 1;
            }
          }
        }
        loadmtf();
      });
    }

    function loadmtf() {
      allsumService.getmtftable(vm.date, $filter('date')(new Date(vm.date).getTime() + 24 * 60 * 60 * 1000, "yyyy-MM-dd")).then(function (response) {
        var d = response.data;
        for (var i = 0; i < vm.partnumbers.length; i++) {
          for (var j = 0; j < d.length; j++) {
            if (vm.partnumbers[i].id == d[j].type) {
              d[j].bpaeq = d[j].BPOUT * vm.partnumbers[i].aeq;
              d[j].minaeq = d[j].GRADED * vm.partnumbers[i].aeq;
            }
          }
        }
        for (var j = 0; j < d.length; j++) {
          for (var k = 0; k < vm.daydata.length; k++) {
            if (d[j].type == "3149069") {
              vm.daydata[k].zbzlbp += d[j].bpaeq;
              vm.daydata[k].osszesbp += d[j].bpaeq;
              vm.daydata[k].minzbzl += d[j].minaeq;
              vm.daydata[k].minosszes += d[j].minaeq;
            }
            else if (d[j].type[0] == "3") {
              vm.daydata[k].otszazbp += d[j].bpaeq;
              vm.daydata[k].osszesbp += d[j].bpaeq;
              vm.daydata[k].minotszaz += d[j].minaeq;
              vm.daydata[k].minosszes += d[j].minaeq;
            }
          }
        }
      });
    }

    function exportToCSV() {
      var content = "";
      content += "Veszteségek;%;;Napi összes(AEQ)\r\n";
      content += "Kieso ido;" + $filter('number')(((vm.sm[vm.sm.length - 1].timediff / vm.sm[vm.sm.length - 1].alltime) * 100), 2) + "%;;Mennyiség;500;ZB/ZL;ZW;\r\n";
      content += "Tervezett veszteség;" + $filter('number')(((vm.sm[vm.sm.length - 1].terv / vm.sm[vm.sm.length - 1].alltime) * 100), 2) + "%;;SM;" + $filter('number')(vm.daydata[0].otszaz, 2) + ";" + $filter('number')(vm.daydata[0].zbzl, 2) + ";" + $filter('number')(vm.daydata[0].osszes, 2) + ";\r\n";
      content += "Szervezési veszteség;" + $filter('number')(((vm.sm[vm.sm.length - 1].szerv / vm.sm[vm.sm.length - 1].alltime) * 100), 2) + "%;;BP;" + $filter('number')(vm.daydata[0].otszazbp, 2) + ";" + $filter('number')(vm.daydata[0].zbzlbp, 2) + ";" + $filter('number')(vm.daydata[0].osszesbp, 2) + ";\r\n";
      content += "Muszaki technikai okok;" + $filter('number')(((vm.sm[vm.sm.length - 1].musz / vm.sm[vm.sm.length - 1].alltime) * 100), 2) + "%;;SM;" + $filter('number')(vm.daydata[0].minotszaz, 2) + ";" + $filter('number')(vm.daydata[0].minzbzl, 2) + ";" + $filter('number')(vm.daydata[0].minosszes, 2) + ";\r\n";
      content += ";\r\n";
      content += "Veszteségek kategóriák;;\r\n";
      content += "Tervezett veszteség (kategóriák);Ido(perc);Megjegyzés;\r\n";
      for (var a = 0; a < vm.tervezett.length; a++) {
        if (vm.tervezett[a].time > 0) {
          content += vm.tervezett[a].name + ";" + $filter('number')(vm.tervezett[a].time / 60, 0) + ";" + vm.tervezett[a].descr + ";\r\n";
        }
      }
      content += "Szervezési veszteség (kategóriák);Ido(perc);Megjegyzés;\r\n";
      for (var b = 0; b < vm.szervezesi.length; b++) {
        if (vm.szervezesi[b].time > 0) {
          content += vm.szervezesi[b].name + ";" + $filter('number')(vm.szervezesi[b].time / 60, 0) + ";" + vm.szervezesi[b].descr + ";\r\n";
        }
      }
      content += "Muszaki technikai okok (kategóriák);Ido(perc);Megjegyzés;\r\n";
      for (var c = 0; c < vm.muszaki.length; c++) {
        if (vm.muszaki[c].time > 0) {
          content += vm.muszaki[c].name + ";" + $filter('number')(vm.muszaki[c].time / 60, 0) + ";" + vm.muszaki[c].descr + ";\r\n";
        }
      }

      var hiddenElement = document.createElement('a');
      hiddenElement.href = 'data:attachment/text;charset=ISO8859-2,' + escape(content);
      hiddenElement.target = '_blank';
      hiddenElement.download = 'Napi_összesítés' + vm.date + '.csv';
      hiddenElement.click();
    }

    function clr() {
      for (var a = 0; a < vm.tervezett.length; a++) {
        vm.tervezett[a].descr = "";
      }
      for (var b = 0; b < vm.szervezesi.length; b++) {
        vm.szervezesi[b].descr = "";
      }
      for (var c = 0; c < vm.muszaki.length; c++) {
        vm.muszaki[c].descr = "";
      }
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadPartnumbers();
    }
  }
  Controller.$inject = ['allsumService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});