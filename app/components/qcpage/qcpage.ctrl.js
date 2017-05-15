define([], function () {
  'use strict';
  function Controller(downloadService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.type = ["ETF", "Gradeing"];
    vm.times = ["nap", "hét", "hónap", "negyedév", "év"];
    vm.data = [];
    vm.sum = [];
    vm.selectsum = [];
    vm.acttime = "nap";
    vm.acttype = "ETF";
    vm.load = load;

    function load() {
      vm.data = [];
      vm.sum = [];
      vm.selectsum = [];
      var talalat = 0;
      var talalt = 0;
      var a = 0;
      var b = 0;
      vm.dis = true;
      vm.QCloading = true;

      downloadService.get(vm.startdate, vm.enddate, vm.acttype, vm.acttime).then(function (response) {
        vm.data = response.data;

        for (var i = 0; i < vm.data.length; i++) {
          var actdate = vm.data[i].Date;
          for (var j = 0; j < vm.sum.length; j++) {
            if (actdate == vm.sum[j].datum) {
              vm.sum[j].osszeg += vm.data[i].Value;
              talalat++
            }
          }
          if (talalat > 0) {
            a = a;
            talalat = 0;
          }
          else {
            vm.sum[a] = {}
            vm.sum[a].datum = actdate;
            vm.sum[a].osszeg = vm.data[i].Value;
            a++;
          }
        }

        for (var i = 0; i < vm.data.length; i++) {
          var actdate = vm.data[i].Date;
          for (var j = 0; j < vm.selectsum.length; j++) {
            if (actdate == vm.selectsum[j].datum) {
              if (vm.data[i].Label == "A+") {
                vm.selectsum[j].aplusz += vm.data[i].Value;
                vm.selectsum[j].osszes += vm.data[i].Value;
              }
              else if (vm.data[i].Label == "A-") {
                vm.selectsum[j].aminus += vm.data[i].Value;
                vm.selectsum[j].osszes += vm.data[i].Value;
              }
              else if (vm.data[i].Label == "B") {
                vm.selectsum[j].b += vm.data[i].Value;
                vm.selectsum[j].osszes += vm.data[i].Value;
              }
              else if (vm.data[i].Label == "Not graded") {
                vm.selectsum[j].notgraded += vm.data[i].Value;
                vm.selectsum[j].osszes += vm.data[i].Value;
              }
              else if (vm.data[i].Label == "Scrap") {
                vm.selectsum[j].scrap += vm.data[i].Value;
                vm.selectsum[j].osszes += vm.data[i].Value;
              }
              talalt++
            }
          }
          if (talalt > 0) {
            b = b;
            talalt = 0;
          }
          else {
            vm.selectsum[b] = {}
            vm.selectsum[b].datum = actdate;
            if (vm.data[i].Label == "A+"){
              vm.selectsum[b].aplusz = vm.data[i].Value;
              vm.selectsum[b].aminus = 0;
              vm.selectsum[b].b = 0;
              vm.selectsum[b].notgraded = 0;
              vm.selectsum[b].scrap = 0;
              vm.selectsum[b].osszes = vm.data[i].Value;
            }
            else if (vm.data[i].Label == "A-"){
              vm.selectsum[b].aplusz = 0;
              vm.selectsum[b].aminus = vm.data[i].Value;
              vm.selectsum[b].b = 0;
              vm.selectsum[b].notgraded = 0;
              vm.selectsum[b].rework = 0;
              vm.selectsum[b].scrap = 0;
              vm.selectsum[b].osszes = vm.data[i].Value;
            }
            else if (vm.data[i].Label == "B"){
              vm.selectsum[b].aplusz = 0;
              vm.selectsum[b].aminus = 0;
              vm.selectsum[b].b = vm.data[i].Value;
              vm.selectsum[b].notgraded = 0;
              vm.selectsum[b].rework = 0;
              vm.selectsum[b].scrap = 0;
              vm.selectsum[b].osszes = vm.data[i].Value;
            }
            else if (vm.data[i].Label == "Not graded"){
              vm.selectsum[b].aplusz = 0;
              vm.selectsum[b].aminus = 0;
              vm.selectsum[b].b = 0;
              vm.selectsum[b].notgraded = vm.data[i].Value;
              vm.selectsum[b].rework = 0;
              vm.selectsum[b].scrap = 0;
              vm.selectsum[b].osszes = vm.data[i].Value;
            }
            else if (vm.data[i].Label == "Scrap"){
              vm.selectsum[b].aplusz = 0;
              vm.selectsum[b].aminus = 0;
              vm.selectsum[b].b = 0;
              vm.selectsum[b].notgraded = 0;
              vm.selectsum[b].rework = 0;
              vm.selectsum[b].scrap = vm.data[i].Value;
              vm.selectsum[b].osszes = vm.data[i].Value;
            }
            b++;
          }
        }

        console.log(vm.selectsum);

        vm.dis = false;
        vm.QCloading = false;

        vm.QCchartconfig = {
          chart: {
            type: 'column',
          },
          plotOptions: {
            column: {
              stacking: 'normal'
            }
          },
          tooltip: {
            valueDecimals: 2
          },
          title: { text: "ZW1000QC-chart" },
          series: [
            {
              name: 'Scrap',
              color: "#ff0000",
              data: feltolt_Scrap(vm.data, vm.sum),
              stack: 'Összes címke'
            },
            {
              name: 'Not graded',
              color: "#660066",
              data: feltolt_Not_graded(vm.data, vm.sum),
              stack: 'Összes címke'
            },
            {
              name: 'B',
              color: "#ff9900",
              data: feltolt_B(vm.data, vm.sum),
              stack: 'Összes címke'
            },
            {
              name: 'A-',
              color: "#cccc00",
              data: feltolt_A_minus(vm.data, vm.sum),
              stack: 'Összes címke'
            },
            {
              name: 'A+',
              color: "#00cc00",
              data: feltolt_A(vm.data, vm.sum),
              stack: 'Összes címke'
            }
          ],
          xAxis: [
            {
              categories: feltolt_x_datum(vm.data),
              title: { text: "Dátum" }
            },
          ],
          yAxis: {
            title: {
              text: "Százalék"
            },
            tickInterval: 20,
            max: 100
          },
        }
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.enddate = new Date().getTime();
      vm.startdate = $filter('date')(vm.enddate - (10 * 24 * 3600 * 1000), 'yyyy-MM-dd');
      vm.enddate = $filter('date')(vm.enddate, 'yyyy-MM-dd');
      load();
      vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    }

    function feltolt_Scrap(tomb, tomb2) {
      var x_scrap = [];

      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].Label == "Scrap") {
          for (var j = 0; j < tomb2.length; j++) {
            if (tomb[i].Date == tomb2[j].datum) {
              x_scrap.push((tomb[i].Value / tomb2[j].osszeg) * 100);
            }
          }
        }
      }
      return x_scrap;
    }

    function feltolt_Not_graded(tomb, tomb2) {
      var x_ngraded = [];

      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].Label == "Not graded") {
          for (var j = 0; j < tomb2.length; j++) {
            if (tomb[i].Date == tomb2[j].datum) {
              x_ngraded.push((tomb[i].Value / tomb2[j].osszeg) * 100);
            }
          }
        }
      }
      return x_ngraded;
    }

    function feltolt_B(tomb, tomb2) {
      var x_B = [];

      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].Label == "B") {
          for (var j = 0; j < tomb2.length; j++) {
            if (tomb[i].Date == tomb2[j].datum) {
              x_B.push((tomb[i].Value / tomb2[j].osszeg) * 100);
            }
          }
        }
      }
      return x_B;
    }

    function feltolt_A_minus(tomb, tomb2) {
      var x_A = [];

      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].Label == "A-") {
          for (var j = 0; j < tomb2.length; j++) {
            if (tomb[i].Date == tomb2[j].datum) {
              x_A.push((tomb[i].Value / tomb2[j].osszeg) * 100);
            }
          }

        }
      }
      return x_A;
    }
    function feltolt_A(tomb, tomb2) {
      var x_A = [];

      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].Label == "A+") {
          for (var j = 0; j < tomb2.length; j++) {
            if (tomb[i].Date == tomb2[j].datum) {
              x_A.push((tomb[i].Value / tomb2[j].osszeg) * 100);
            }
          }

        }
      }
      return x_A;
    }

    function feltolt_x_datum(tomb) {
      var x_datum = [];
      var talalat = 0;
      var a = 0;
      var act = "";
      for (var i = 0; i < tomb.length; i++) {
        act = tomb[i].Date;
        for (var j = 0; j < x_datum.length; j++) {
          if (act == x_datum[j]) {
            talalat++;
          }
        }
        if (talalat == 0) {
          x_datum.push(act);
        }
        else {
          talalat = 0;
        }
      }
      return x_datum;
    }
  }
  Controller.$inject = ['downloadService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
