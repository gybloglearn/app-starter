define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.info = [];
    vm.act = 'Welding_1';
    vm.allmachines = ['Welding_1', 'Rolling1', 'Rolling2', 'Rolling3', 'Trim', 'Testing1', 'Drying #1', 'QC', 'Packaging #1', 'Report to ERP_1'];
    vm.load = load;
    vm.set = setChart;
    vm.datszam = datsz;

    function datsz() {
      vm.dat = new Date(vm.datum);
      vm.datumszam = $filter('date')(vm.dat - 6 * 24 * 3600 * 1000, 'yyyy-MM-dd');
    }

    function load() {
      vm.dis = true;
      vm.info = [];

      if (vm.heti) {

        dataService.getweek(vm.datum).then(function (response) {
          vm.info = response.data;
          setChart();
          vm.dis = false;
        });
      } else {
        dataService.get(vm.datum).then(function (response) {
          vm.info = response.data;
          setChart();
          vm.dis = false;
        });
      }
    }

    function setChart() {
      adatok($filter('filter')(vm.info, { 'Machine': vm.act }));
    }

    function adatok(adat) {
      var data = [];
      angular.forEach(adat, function (v, k) {
        var ora = new Date(v.Daterecorded).getHours();
        var perc = new Date(v.Daterecorded).getMinutes();
        if (ora <= 5) {
          v.nap = $filter('date')(new Date(v.Daterecorded).getTime() - 24 * 3600 * 1000, "MM-dd");
        } else {
          v.nap = $filter('date')(new Date(v.Daterecorded).getTime(), "MM-dd");
        }
        ora = (ora <= 5 && perc < 50) ? 18 + ora : ora - 6;
        v.ora = ora < 10 ? "0" + ora : ora + "";
        adat[k] = v;
      });

      if (vm.heti) {
        var x = feltolt_day();
        for (var i = 0; i < x.length; i++) {
          data.push($filter('filter')(adat, { nap: x[i] }).length);
        }
        vm.chartconfig = {
          chart: {
            width: 900,
            height: 360
          },
          xAxis: [
            { type: "category", categories: x },
          ],
          title: { text: 'F&M mennyiségek - ' + vm.act },
          series: [{
            name: 'Termelt darab', tooltip: {
              useHTML: true,
              headerFormat: '<b style="color:{series.color};font-weight:bold;">Termelt mennyiség</b><br>',
              pointFormat: '<span style="color:{series.color};"font-size:1.2em">{point.y} db</span>'
            }, type: 'column', data: data
          }]
        };
      } else {
        var x = feltolt_hour();

        for (var i = 0; i < x.length; i++) {
          data.push({ x: x[i], y: $filter('filter')(adat, { ora: x[i] }).length });
        }
        vm.chartconfig = {
          chart: {
            width: 900,
            height: 360
          },
          xAxis: [
            { type: "category", categories: x },
          ],
          title: { text: 'F&M mennyiségek - ' + vm.act },
          series: [{
            name: 'Termelt darab',
            tooltip: {
              useHTML: true,
              headerFormat: '<b style="color:{series.color};font-weight:bold;">Termelt mennyiség</b><br>',
              pointFormat: '<span style="color:{series.color};"font-size:1.2em">{point.y} db</span>'
            }, type: 'column', data: data
          }]
        };
      }
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

    function feltolt_day() {
      var napok = [];
      vm.downday = new Date(vm.datum).getTime();
      for (var i = 0; i <= 6; i++) {
        vm.now = $filter('date')(vm.downday - (6 - i) * 24 * 3600 * 1000, 'MM-dd');
        napok.push(vm.now);
      }
      return napok;
    }


    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.today = $filter('date')(new Date(), 'yyyy-MM-dd');
      load();
    }
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
