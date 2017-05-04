define([], function () {
  'use strict';
  function Controller(smdataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.sm_datas = [];
    vm.darab = [];
    vm.egyedi = [];
    vm.szervezesi_veszteseg = [];
    vm.tervezett_veszteseg = [];
    vm.muszaki_technikai_okok = [];
    vm.osszegzo_szervezesi = [];
    vm.osszegzo_tervezett = [];
    vm.osszegzo_muszaki = [];
    vm.sum_szervezesi = 0;
    vm.sum_tervezett = 0;
    vm.sum_okok = 0;
    vm.sm = "SM4";
    vm.downt="Szervezesi veszteseg"
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.downtimes=["Szervezesi veszteseg","Tervezett veszteseg","Műszaki technikai okok"];
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.today = (new Date().getHours() * 60 + new Date().getMinutes()) - 350;
    vm.datumszam = vm.datum;
    vm.load = load;
    vm.datszam = beallit;
    feltolt_zero(vm.darab);
    var allando = [];

    var j = 0;
    var k = 0;
    var l = 0;

    for (var i = 0; i < 24; i++) {
      allando[i] = 31;
    }

    function beallit() {
      vm.szam = new Date(vm.datum);
      vm.datumszam = $filter('date')(vm.szam, 'yyyy-MM-dd');
    }

    function load() {
      j = 0;
      k = 0;
      l = 0;
      vm.szervezesi_veszteseg = [];
      vm.tervezett_veszteseg = [];
      vm.muszaki_technikai_okok = [];
      vm.sum_szervezesi = 0;
      vm.sum_tervezett = 0;
      vm.sum_okok = 0;
      vm.smloading = true;
      vm.dis = true;
      feltolt_zero(vm.darab);
      vm.sm_datas = [];
      smdataService.get(vm.datum, vm.sm).then(function (response) {
        vm.sm_datas = response.data;
        vm.egyedi = $filter('unique')(vm.sm_datas, 'Event_SubGroup');
        vm.dis = false;

        for (var i = 0; i < vm.sm_datas.length; i++) {
          hour_grop(vm.sm_datas[i].Event_type, vm.sm_datas[i].timestamp);
          leall(vm.sm_datas[i].timestamp, vm.sm_datas[i].Event_type, vm.sm_datas[i].Ev_Group, vm.sm_datas[i].Event_time, vm.sm_datas[i].Shift_Name, vm.sm_datas[i].Event_SubGroup, vm.sm_datas[i].Comment);
        }
        osszegzo(vm.sm_datas);
        vm.sum_szervezesi = sumpie(vm.szervezesi_veszteseg);
        vm.sum_tervezett = sumpie(vm.tervezett_veszteseg);
        vm.sum_okok = sumpie(vm.muszaki_technikai_okok);

        daytimechart();
        setChart(vm.sm);
        setChartxrange(vm.sm);
        setChartpie(vm.sm);
        setCol1(vm.sm);
        setCol2(vm.sm);
        setCol3(vm.sm);
        vm.smloading = false;
      });

    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
      vm.edate = new Date().getTime();
    }

    function sumpie(tomb) {
      var sum = 0;
      for (var a = 0; a < tomb.length; a++) {
        sum = sum + tomb[a].tartam;
      }
      sum = sum / 60;
      return sum;
    }

    function daytimechart() {
      var tday = $filter('date')(new Date(), 'yyyy-MM-dd');
      if (vm.datum < tday) {
        vm.today = 24 * 60;
      }
      else {
        vm.today = (new Date().getHours() * 60 + new Date().getMinutes()) - 350;
      }
    }

    function setChart(nowsm) {
      vm.chartconfig = {
        chart: {
          type: 'column',
          width: 900,
          height: 360
        },
        title: { text: nowsm + " SOE report" },
        subtitle: { text: 'Forrás: MES adatbázis' },
        series: [
          {
            type: "line",
            name: 'Órai cél',
            color: "#ff8800",
            data: allando
          },
          {
            name: 'Termelt lap',
            color: "#00b300",
            data: vm.darab
          }
        ],


        xAxis: [
          { categories: feltolt_hour() },
        ],
        yAxis: {
          title: {
            text: "Darab"
          }
        },
      };
    }

    function setChartxrange(nowsm) {
      vm.chartconfig_xrange = {
        chart: {
          type: 'xrange',
          width: 1100,
          height: 200,
          zoomType: 'x'
        },
        legend: {
          floating: false,
          align: 'bottom',
        },
        xAxis: { title: { text: 'Idő' }, type: 'datetime', dateTimeLabelFormats: { hour: '%d.<br>%H:%M' }, tickInterval: 3600 * 1000 },
        yAxis: { title: { enabled: false }, min: 0, max: 2, categories: ['Szervezési veszteség', 'Tervezett veszteség', 'Műszaki technikai okok'] },
        series: [
          {
            color: '#cc33ff',
            name: 'Szervezési veszteség',
            tooltip: {
              useHTML: true,
              headerFormat: '<b style="color:{series.color};font-weight:bold;">Szervezési veszteség:</b><br>',
              pointFormat: '<span style="color:{series.color};">{point.categ}</span><br><span style="font-size:1.2em">{point.x:%H:%M:%S} - {point.x2:%H:%M:%S}</span><br><b style="font-size:10px">{point.subgroup}</b><br><i style="font-size:10px">{point.comment}</i>'
            },
            data: vm.szervezesi_veszteseg,
            borderRadius: 0,
            pointWidth: 30,
            borderColor: '#cc33ff'
          },
          {
            color: '#3366ff',
            name: 'Tervezett veszteség',
            tooltip: {
              useHTML: true,
              headerFormat: '<b style="color:{series.color};font-weight:bold;">Tervezett veszteség:</b><br>',
              pointFormat: '<span style="color:{series.color};">{point.categ}</span><br><span style="font-size:1.2em">{point.x:%H:%M:%S} - {point.x2:%H:%M:%S}</span><br><b style="font-size:10px">{point.subgroup}</b><br><i style="font-size:10px">{point.comment}</i>'
            },
            data: vm.tervezett_veszteseg,
            borderRadius: 0,
            pointWidth: 30,
            borderColor: '#3366ff'
          },
          {
            color: '#e60000',
            name: 'Műszaki technikai okok',
            tooltip: {
              useHTML: true,
              headerFormat: '<b style="color:{series.color};font-weight:bold;">Műszaki technikai okok:</b><br>',
              pointFormat: '<span style="color:{series.color};">{point.categ}</span><br><span style="font-size:1.2em">{point.x:%H:%M:%S} - {point.x2:%H:%M:%S}</span><br><b style="font-size:10px">{point.subgroup}</b><br><i style="font-size:10px">{point.comment}</i>'
            },
            data: vm.muszaki_technikai_okok,
            borderRadius: 0,
            pointWidth: 30,
            borderColor: '#e60000'
          }
        ]
      };
    }

    function setChartpie(nowsm) {
      vm.chartconfig_pie = {
        chart: {
          type: 'pie',
          width: 1100,
          height: 400
        },
        tooltip: {
          pointFormat: '<b style="color:{point.color};font-size:1.2em;font-weight:bold">{point.percentage:.2f} %</b>'
        },
        title: { text: "Állásidők eloszlása" },
        subtitle: { text: "Összes eltelt idő: " + vm.today + "perc" },
        plotOptions: {
          pie: {
            center: ['50%', '50%'],
            showInLegend: true
          }
        },
        series: [
          {
            data: [{
              name: 'Elérhető idő',
              color: "#00b300",
              y: vm.today - (vm.sum_szervezesi + vm.sum_tervezett + vm.sum_okok)
            },
            {
              name: 'Szervezesi veszteseg',
              color: "#cc33ff",
              y: vm.sum_szervezesi
            },
            {
              name: 'Tervezett veszteseg',
              color: "#3366ff",
              y: vm.sum_tervezett
            },
            {
              name: 'Műszaki technikai okok',
              color: "#e60000",
              y: vm.sum_okok
            }]
          }
        ],
      };
    }

    function setCol1(nowsm){
      vm.osszegzo_szervezesi = $filter('orderBy')(vm.osszegzo_szervezesi, ["time"]);
      vm.chartconfig_col1 = {
        chart: {
          type: 'column',
          width: 900,
          height: 360
        },
        title: { text: nowsm + " - Szervezesi veszteseg" },
        series: [
          {
            name: 'Szervezesi veszteseg',
            color: "#cc33ff",
            data: feltolt_ido(vm.osszegzo_szervezesi)
          }
        ],


        xAxis: [
          { categories: feltolt_tipus(vm.osszegzo_szervezesi) },
        ],
        yAxis: {
          title: {
            text: "Idő"
          }
        },
      };
    }
    function setCol2(nowsm){
      vm.osszegzo_tervezett = $filter('orderBy')(vm.osszegzo_tervezett, ["time"]);
      vm.chartconfig_col2 = {
        chart: {
          type: 'column',
          width: 900,
          height: 360
        },
        title: { text: nowsm + " - Tervezett veszteseg" },
        series: [
          {
            name: 'Tervezett veszteseg',
            color: "#3366ff",
            data: feltolt_ido(vm.osszegzo_tervezett)
          }
        ],


        xAxis: [
          { categories: feltolt_tipus(vm.osszegzo_tervezett) },
        ],
        yAxis: {
          title: {
            text: "Idő"
          }
        },
      };
    }
    function setCol3(nowsm){
      vm.osszegzo_muszaki = $filter('orderBy')(vm.osszegzo_muszaki, ["time"]);
      vm.chartconfig_col3 = {
        chart: {
          type: 'column',
          width: 900,
          height: 360
        },
        title: { text: nowsm + " - Műszaki technikai okok" },
        series: [
          {
            name: 'Műszaki technikai okok',
            color: "#e60000",
            data: feltolt_ido(vm.osszegzo_muszaki)
          }
        ],


        xAxis: [
          { categories: feltolt_tipus(vm.osszegzo_muszaki) },
        ],
        yAxis: {
          title: {
            text: "Idő"
          }
        },
      };
    }

    function feltolt_tipus(tomb){
      var x_adatok=[];
      for(var i=0;i<tomb.length;i++){
        x_adatok.push(tomb[i].name);
      }
      return x_adatok;
    }

    function feltolt_ido(tomb){
      var adatok=[];
      for(var i=0;i<tomb.length;i++){
        adatok.push(tomb[i].time);
      }
      return adatok;

    }

    function feltolt_hour() {
      var szamok = [];
      for (var i = 6; i < 24; i++) {
        szamok.push(i < 10 ? "0" + i : "" + i);
      }
      for (var j = 0; j < 6; j++) {
        szamok.push("0" + j);
      }
      return szamok;
    }

    function feltolt_zero(nulla) {
      for (var i = 0; i < 24; i++) {
        nulla[i] = 0;
      }
      return nulla;
    }

    function hour_grop(itemtype, itemstart) {
      var szamvaltozo = new Date(itemstart).getHours() * 60 + new Date(itemstart).getMinutes();
      for (var i = 0; i < 18; i++) {
        if (itemtype == "Sheet Production" && (szamvaltozo >= ((i + 5) * 60 + 50)) && szamvaltozo < ((i + 6) * 60 + 50)) {
          vm.darab[i]++
        }
      }
      for (var i = 18; i < 24; i++) {
        if (itemtype == "Sheet Production" && (szamvaltozo >= ((i - 18) * 60 - 10)) && szamvaltozo < ((i - 17) * 60 - 10)) {
          vm.darab[i]++
        }
      }
    }

    function leall(itemstart, itemtype, itemgroup, itemtime, itemshift, itemsub, itemcomment) {
      var szamvaltozo = new Date(itemstart).getHours() * 60 + new Date(itemstart).getMinutes();

      if (itemtype == "Downtime" && itemgroup == "Szervezesi veszteseg") {
        vm.szervezesi_veszteseg[l] = {};
        vm.szervezesi_veszteseg[l].x = itemstart + 1000 * 3600;
        vm.szervezesi_veszteseg[l].tartam = itemtime;
        vm.szervezesi_veszteseg[l].x2 = 1000 * 3600 + itemstart + (itemtime * 1000);
        vm.szervezesi_veszteseg[l].szaknev = itemshift;
        vm.szervezesi_veszteseg[l].y = 0.5;
        vm.szervezesi_veszteseg[l].subgroup = itemsub;
        vm.szervezesi_veszteseg[l].comment = itemcomment;

        if (szamvaltozo >= 350 && szamvaltozo < 830) {
          vm.szervezesi_veszteseg[l].szakszam = 1;
        }
        else if (szamvaltozo >= 830 && szamvaltozo < 1310) {
          vm.szervezesi_veszteseg[l].szakszam = 2;
        }
        else {
          vm.szervezesi_veszteseg[l].szakszam = 3;
        }
        l++;
      }
      if (itemtype == "Downtime" && itemgroup == "Tervezett veszteseg") {
        vm.tervezett_veszteseg[j] = {};
        vm.tervezett_veszteseg[j].x = itemstart + 1000 * 3600;
        vm.tervezett_veszteseg[j].tartam = itemtime;
        vm.tervezett_veszteseg[j].x2 = 1000 * 3600 + itemstart + (itemtime * 1000);
        vm.tervezett_veszteseg[j].szaknev = itemshift;
        vm.tervezett_veszteseg[j].y = 1.5;
        vm.tervezett_veszteseg[j].subgroup = itemsub;
        vm.tervezett_veszteseg[j].comment = itemcomment;

        if (szamvaltozo >= 350 && szamvaltozo < 830) {
          vm.tervezett_veszteseg[j].szakszam = 1;
        }
        else if (szamvaltozo >= 830 && szamvaltozo < 1310) {
          vm.tervezett_veszteseg[j].szakszam = 2;
        }
        else {
          vm.tervezett_veszteseg[j].szakszam = 3;
        }
        j++;
      }
      if (itemtype == "Downtime" && itemgroup == "Muszaki technikai okok") {
        vm.muszaki_technikai_okok[k] = {};
        vm.muszaki_technikai_okok[k].x = itemstart + 1000 * 3600;
        vm.muszaki_technikai_okok[k].tartam = itemtime;
        vm.muszaki_technikai_okok[k].x2 = 1000 * 3600 + itemstart + (itemtime * 1000);
        vm.muszaki_technikai_okok[k].szaknev = itemshift;
        vm.muszaki_technikai_okok[k].y = 2.5;
        vm.muszaki_technikai_okok[k].subgroup = itemsub;
        vm.muszaki_technikai_okok[k].comment = itemcomment;

        if (szamvaltozo >= 350 && szamvaltozo < 830) {
          vm.muszaki_technikai_okok[k].szakszam = 1;
        }
        else if (szamvaltozo >= 830 && szamvaltozo < 1310) {
          vm.muszaki_technikai_okok[k].szakszam = 2;
        }
        else {
          vm.muszaki_technikai_okok[k].szakszam = 3;
        }
        k++;
      }
    }

    function osszegzo(tomb) {
      vm.osszegzo_szervezesi = [];
      vm.osszegzo_tervezett = [];
      vm.osszegzo_muszaki = [];
      var a = 0;
      var b = 0;
      var c = 0;
      var talalt = 0;

      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].Event_type == "Downtime" && tomb[i].Ev_Group == "Szervezesi veszteseg") {
          for (var j = 0; j < vm.osszegzo_szervezesi.length; j++) {
            if (tomb[i].Event_SubGroup == vm.osszegzo_szervezesi[j].name) {
              vm.osszegzo_szervezesi[j].time += tomb[i].Event_time;
              vm.osszegzo_szervezesi[j].piece++;
              talalt++;
            }
          }
          if (talalt > 0) {
            a = a;
            talalt = 0;
          }
          else {
            vm.osszegzo_szervezesi[a] = {}
            vm.osszegzo_szervezesi[a].name = tomb[i].Event_SubGroup;
            vm.osszegzo_szervezesi[a].time = 0;
            vm.osszegzo_szervezesi[a].piece = 1;
            vm.osszegzo_szervezesi[a].time += tomb[i].Event_time;
            a++;
          }
        }
      }

      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].Event_type == "Downtime" && tomb[i].Ev_Group == "Tervezett veszteseg") {
          for (var j = 0; j < vm.osszegzo_tervezett.length; j++) {
            if (tomb[i].Event_SubGroup == vm.osszegzo_tervezett[j].name) {
              vm.osszegzo_tervezett[j].time += tomb[i].Event_time;
              vm.osszegzo_tervezett[j].piece++;
              talalt++;
            }
          }
          if (talalt > 0) {
            b = b;
            talalt = 0;
          }
          else {
            vm.osszegzo_tervezett[b] = {}
            vm.osszegzo_tervezett[b].name = tomb[i].Event_SubGroup;
            vm.osszegzo_tervezett[b].time = 0;
            vm.osszegzo_tervezett[b].piece = 1;
            vm.osszegzo_tervezett[b].time += tomb[i].Event_time;
            b++;
          }
        }
      }
      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].Event_type == "Downtime" && tomb[i].Ev_Group == "Muszaki technikai okok") {
          for (var j = 0; j < vm.osszegzo_muszaki.length; j++) {
            if (tomb[i].Event_SubGroup == vm.osszegzo_muszaki[j].name) {
              vm.osszegzo_muszaki[j].time += tomb[i].Event_time;
              vm.osszegzo_muszaki[j].piece++;
              talalt++;
            }
          }
          if (talalt > 0) {
            c = c;
            talalt = 0;
          }
          else {
            vm.osszegzo_muszaki[c] = {}
            vm.osszegzo_muszaki[c].name = tomb[i].Event_SubGroup;
            vm.osszegzo_muszaki[c].time = 0;
            vm.osszegzo_muszaki[c].piece = 1;
            vm.osszegzo_muszaki[c].time += tomb[i].Event_time;
            c++;
          }
        }
      }
    }

  }
  Controller.$inject = ['smdataService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
