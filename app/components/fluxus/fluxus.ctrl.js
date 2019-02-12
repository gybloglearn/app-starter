define([], function () {
  'use strict';
  function Controller(fluxusService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.date = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.datenum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.beallit = beallit;
    vm.loading = false;
    vm.clorcat = ["Anyaghiány Pottingról", "Létszámhiány", "PH beállítás", "Áramláshiba", "Szivárgás", "Hőmérséklet", "Beadagolás hiba", "Sósav tartály levegőre fut", "Segédeszköz hiány", "Egyéb"];
    vm.fluxuscat = ["Anyaghiány", "Létszámhiány", "Szivattyú", "Szűrő", "Áramláshiba", "Hőmérséklet", "Egyéb"];
    vm.impregnalcat = ["Glicerinsűrűség", "Kádszint", "Segédeszköz hiány", "Szivattyú", "Glicerin hiány", "Anyaghiány", "Létszámhiány", "Áramlási hiba", "Egyéb"];
    vm.saveclorinfo=saveclorinfo;
    vm.savefluxusinfo=savefluxusinfo;
    vm.saveimpregnalinfo=saveimpregnalinfo;
    vm.goodsave=goodsave;

    function loadpartnumbers() {
      vm.partnumbers = [];
      fluxusService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }

    function beallit() {
      vm.datenum = $filter('date')(new Date(vm.date).getTime(), 'yyyy-MM-dd')
      createhours();
    }

    function createhours() {
      vm.cats = [];
      for (var i = 6; i < 24; i++) {
        vm.cats.push(i < 10 ? "0" + i : "" + i);
      }
      for (var j = 0; j < 6; j++) {
        vm.cats.push("0" + j);
      }
      loadfluxus()
    }

    function loadfluxus() {

      vm.loading = true;

      vm.data = [];
      vm.impdata = [];
      vm.clordata = [];

      var sdate = $filter('date')(new Date(vm.date).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      var edate = $filter('date')(new Date(vm.date).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');

      fluxusService.getetf(sdate, edate).then(function (response) {

        for (var j = 0; j < response.data.length; j++) {
          for (var k = 0; k < vm.partnumbers.length; k++) {
            if (response.data[j].jobid.includes(vm.partnumbers[k].modul)) {
              response.data[j].aeq = vm.partnumbers[k].aeq;
              response.data[j].modulname = vm.partnumbers[k].name;
            }
          }
          response.data[j].Perm_gep = response.data[j].Perm_gép;

          var minutes = new Date(response.data[j].Perm_test).getMinutes();
          var impminutes = new Date(response.data[j].Impregnation_end).getMinutes();
          var clorminutes = new Date(response.data[j].Klórozás_end).getMinutes();

          if (minutes >= 50) {
            response.data[j].fluxus_hour = new Date(response.data[j].Perm_test).getHours() + 1;
          }
          else {
            response.data[j].fluxus_hour = new Date(response.data[j].Perm_test).getHours()
          }
          if (response.data[j].Perm_test_shiftday == vm.date) {
            vm.data.push(response.data[j]);
          }

          if (impminutes >= 50) {
            response.data[j].impregnation_hour = new Date(response.data[j].Impregnation_end).getHours() + 1;
          }
          else {
            response.data[j].impregnation_hour = new Date(response.data[j].Impregnation_end).getHours()
          }
          if (response.data[j].Impregnation_end_shiftday == vm.date) {
            vm.impdata.push(response.data[j]);
          }

          if (clorminutes >= 50) {
            response.data[j].clor_hour = new Date(response.data[j].Klórozás_end).getHours() + 1;
          }
          else {
            response.data[j].clor_hour = new Date(response.data[j].Klórozás_end).getHours()
          }
          if (response.data[j].Klórozás_end_shiftday == vm.date) {
            vm.clordata.push(response.data[j]);
          }
        }
        create_chart()
        vm.loading = false;
      });
    }

    function create_chart() {
      vm.chartdata =
        [
          { name: 'Klórozó', color: 'rgb(50,102,155)', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Klórozó kumulált', color: 'rgb(50,102,155)', type: 'line', yAxis: 1, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Fluxus', color: 'rgb(0,0,255)', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Fluxus kumulált', color: 'rgb(0,0,255)', type: 'line', yAxis: 1, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Impregnálás', color: 'rgb(102, 0, 102)', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Impregnálás kumulált', color: 'rgb(102,0,102)', type: 'line', yAxis: 1, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Cél', color: 'rgb(255,0,0)', type: 'line', yAxis: 1, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
        ];
      for (var i = 0; i < vm.clordata.length; i++) {
        for (var j = 0; j < vm.cats.length; j++) {
          if (vm.clordata[i].clor_hour == parseInt(vm.cats[j])) {
            vm.chartdata[0].data[j]++;
          }
        }
      }
      for (var i = 0; i < vm.data.length; i++) {
        for (var j = 0; j < vm.cats.length; j++) {
          if (vm.data[i].fluxus_hour == parseInt(vm.cats[j])) {
            vm.chartdata[2].data[j]++;
          }

        }
      }
      for (var i = 0; i < vm.impdata.length; i++) {
        for (var j = 0; j < vm.cats.length; j++) {
          if (vm.impdata[i].impregnation_hour == parseInt(vm.cats[j])) {
            vm.chartdata[4].data[j]++;
          }

        }
        for (var k = 0; k < 24; k++) {
          if (k > 0) {
            vm.chartdata[1].data[k] = vm.chartdata[1].data[k - 1] + vm.chartdata[0].data[k];
            vm.chartdata[3].data[k] = vm.chartdata[3].data[k - 1] + vm.chartdata[2].data[k];
            vm.chartdata[5].data[k] = vm.chartdata[5].data[k - 1] + vm.chartdata[4].data[k];
            vm.chartdata[6].data[k] = vm.chartdata[6].data[k - 1] + 3.7;
          } else {
            vm.chartdata[1].data[k] = vm.chartdata[0].data[k];
            vm.chartdata[3].data[k] = vm.chartdata[2].data[k];
            vm.chartdata[5].data[k] = vm.chartdata[4].data[k];
            vm.chartdata[6].data[k] = 3.7;
          }
        }
      }
      vm.chartconfig = {
        chart: {
          type: 'column',
          height: 360
        },
        plotOptions: {
          column: {
            borderWidth: 0,
            events: {
              click: function (ev) {
                /*console.log(ev.point.category);
                console.log(ev.point.options.cat + " - " + ev.point.series.name);*/
                createinfo(ev.point.category, ev.point.series.name);
              }
            }
          }
        },
        title: { text: "Fluxus és impregnálás adatok órai lebontása" },
        tooltip: {
          valueDecimals: 0
        },
        xAxis: { type: 'category', categories: vm.cats },
        yAxis: [{ title: { text: 'Darab' } }, { title: { text: 'Kumulált Darab' }, opposite: true }],
        series: vm.chartdata
      };
    }

    function createinfo(categ, name) {
      if (name == "Klórozó") {
        vm.createinfodata = {};
        vm.cat = "";
        vm.descriptioninfo = "";
        vm.startinfo = vm.date + " " + categ + ":" + "00";
        vm.endinfo = vm.date + " " + categ + ":" + "00";

        loadclorinationinfo();
        vm.mutatklor = true;
      }
      else if (name == "Fluxus") {
        vm.createinfodata = {};
        vm.cat = "";
        vm.descriptioninfo = "";
        vm.startinfo = vm.date + " " + categ + ":" + "00";
        vm.endinfo = vm.date + " " + categ + ":" + "00";

        loadfluxusinfo();
        vm.mutatfluxus = true;
      }
      else if (name == "Impregnálás") {
        vm.createinfodata = {};
        vm.cat = "";
        vm.descriptioninfo = "";
        vm.startinfo = vm.date + " " + categ + ":" + "00";
        vm.endinfo = vm.date + " " + categ + ":" + "00";

        loadimpregnalinfo();
        vm.mutatimpregnal = true;
      }
    }

    function saveclorinfo() {

      vm.createinfodata.id = new Date().getTime();
      vm.createinfodata.sso = $rootScope.user.username;
      vm.createinfodata.operator_name = $rootScope.user.displayname;
      vm.createinfodata.start = vm.startinfo;
      vm.createinfodata.end = vm.endinfo;
      vm.createinfodata.time = vm.timeinfo = (new Date(vm.endinfo).getTime() - new Date(vm.startinfo).getTime()) / 60000;
      vm.createinfodata.category = vm.cat;
      vm.createinfodata.description = vm.descriptioninfo;
      
      console.log(vm.createinfodata);
      fluxusService.postclorination(vm.createinfodata).then(function (resp) {
        vm.showmessage = true;
        vm.createinfodata = {};
      });
      vm.mutatklor = false;
    }

    function loadclorinationinfo() {
      vm.clorinationinfo = [];

      fluxusService.getclorination().then(function (resp) {
        vm.clorinationinfo = resp.data;
      });
    }
    function savefluxusinfo() {

      vm.createinfodata.id = new Date().getTime();
      vm.createinfodata.sso = $rootScope.user.username;
      vm.createinfodata.operator_name = $rootScope.user.displayname;
      vm.createinfodata.start = vm.startinfo;
      vm.createinfodata.end = vm.endinfo;
      vm.createinfodata.time = vm.timeinfo = (new Date(vm.endinfo).getTime() - new Date(vm.startinfo).getTime()) / 60000;
      vm.createinfodata.category = vm.cat;
      vm.createinfodata.description = vm.descriptioninfo;
      
      console.log(vm.createinfodata);
      fluxusService.postfluxus(vm.createinfodata).then(function (resp) {
        vm.showmessage = true;
        vm.createinfodata = {};
      });
      vm.mutatfluxus = false;
    }

    function loadfluxusinfo() {
      vm.clorinationinfo = [];

      fluxusService.getfluxus().then(function (resp) {
        vm.fluxusinfo = resp.data;
      });
    }

    function saveimpregnalinfo() {

      vm.createinfodata.id = new Date().getTime();
      vm.createinfodata.sso = $rootScope.user.username;
      vm.createinfodata.operator_name = $rootScope.user.displayname;
      vm.createinfodata.start = vm.startinfo;
      vm.createinfodata.end = vm.endinfo;
      vm.createinfodata.time = vm.timeinfo = (new Date(vm.endinfo).getTime() - new Date(vm.startinfo).getTime()) / 60000;
      vm.createinfodata.category = vm.cat;
      vm.createinfodata.description = vm.descriptioninfo;
      
      console.log(vm.createinfodata);
      fluxusService.postimpregnal(vm.createinfodata).then(function (resp) {
        vm.showmessage = true;
        vm.createinfodata = {};
      });
      vm.mutatimpregnal = false;
    }

    function loadimpregnalinfo() {
      vm.impregnalinfoinfo = [];

      fluxusService.getimpregnal().then(function (resp) {
        vm.impregnalinfo = resp.data;
      });
    }

    function goodsave() {
      alert("Mentés sikeres!");
  }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadpartnumbers();
      createhours();
    }
  }
  Controller.$inject = ['fluxusService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
