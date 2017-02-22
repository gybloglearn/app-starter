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
    vm.sm = "SM4";
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.smloading = true;
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
      vm.smloading = true;
      vm.dis = true;
      feltolt_zero(vm.darab);
      vm.sm_datas = [];
      smdataService.get(vm.datum, vm.sm).then(function (response) {
        vm.sm_datas = response.data;
        vm.egyedi = $filter('unique')(vm.sm_datas, 'Event_SubGroup');
        vm.dis = false;
        console.log(vm.szervezesi_veszteseg);
        console.log(vm.tervezett_veszteseg);
        console.log(vm.muszaki_technikai_okok);
        var nowsm = vm.sm;
        for (var i = 0; i < vm.sm_datas.length; i++) {
          hour_grop(vm.sm_datas[i].Event_type, vm.sm_datas[i].timestamp);
          leall(vm.sm_datas[i].timestamp, vm.sm_datas[i].Event_type, vm.sm_datas[i].Ev_Group, vm.sm_datas[i].Event_time);
        }
        setChart(nowsm);
        vm.smloading = false;
      });

    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
      vm.edate = new Date().getTime();
    }

    function setChart(nowsm) {
      vm.sm = nowsm;
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

    function hour_grop(itemtype, itemtime) {
      var szamvaltozo = new Date(itemtime).getHours() * 60 + new Date(itemtime).getMinutes();
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

    function leall(itemstart, itemtype, itemgroup, itemtime) {
      if (itemtype == "Downtime" && itemgroup == "Szervezesi veszteseg") {
        vm.szervezesi_veszteseg[l] = {};
        vm.szervezesi_veszteseg[l].start = itemstart;
        vm.szervezesi_veszteseg[l].tartam = itemtime;
        vm.szervezesi_veszteseg[l].vege = itemstart + (itemtime * 1000);
        l++;
      }
      if (itemtype == "Downtime" && itemgroup == "Tervezett veszteseg") {
        vm.tervezett_veszteseg[j] = {};
        vm.tervezett_veszteseg[j].start = itemstart;
        vm.tervezett_veszteseg[j].tartam = itemtime;
        vm.tervezett_veszteseg[j].vege = itemstart + (itemtime * 1000);
        j++;
      }
      if (itemtype == "Downtime" && itemgroup == "Muszaki technikai okok") {
        vm.muszaki_technikai_okok[k] = {};
        vm.muszaki_technikai_okok[k].start = itemstart;
        vm.muszaki_technikai_okok[k].tartam = itemtime;
        vm.muszaki_technikai_okok[k].vege = itemstart + (itemtime * 1000);
        k++;
      }
    }

  }
  Controller.$inject = ['smdataService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
