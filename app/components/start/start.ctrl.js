define([], function () {
  'use strict';
  function Controller(Data, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.weekstart = $filter('date')((new Date().getTime() - 1 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.weekend = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.weekstat = [];
    vm.mistakes = [];
    vm.top10 = [];

    function load() {
      vm.startloading = true;
      vm.weekstat = [];
      vm.mistakes = [];
      vm.top10 = [];
      var a = 0;
      var b = 0;
      var csere;
      csere = {}

      Data.get(vm.weekstart, vm.weekend).then(function (response) {
        vm.weekstat = response.data;

        for (var i = 0; i < vm.weekstat.length; i++) {
          if (vm.weekstat[i].machine_Stat != "Aut. Dolgozik " && vm.weekstat[i].machine_Stat != "Alapállapot") {
            vm.mistakes[a] = {}
            vm.mistakes[a].name = vm.weekstat[i].MName;
            vm.mistakes[a].time = vm.weekstat[i].Stat_Time * 1;
            vm.mistakes[a].start = vm.weekstat[i].StartDate;
            vm.mistakes[a].end = vm.weekstat[i].EndDate;
            vm.mistakes[a].state = vm.weekstat[i].machine_Stat;
            a++;
          }
        }

        for (var i = 0; i < vm.mistakes.length; i++) {
          for (var j = i + 1; j < vm.mistakes.length; j++) {
            if (vm.mistakes[j].time < vm.mistakes[i].time) {
              csere = vm.mistakes[i];
              vm.mistakes[i] = vm.mistakes[j];
              vm.mistakes[j] = csere;
            }
          }
        }
        console.log(vm.top10);

        for (var i = vm.mistakes.length - 1; i > vm.mistakes.length - 11; i--) {
          vm.top10[b] = vm.mistakes[i];
          b++;
        }

        vm.chartconfig_bar = {
          chart: {
            type: 'bar',
          },
          title: { text: "TOP10 kieső idő az elmúlt 7 napban" },
          series: [
            {
              name: 'Kiesés',
              color: "#ff0000",
              data: feltolt_adatok(vm.top10),
              dataLabels: {
                enabled: true,
                format: '{point.st}'
              }
            },
          ],
          xAxis: [
            {
              categories: feltolt_tipus(vm.top10),
              title: { text: "Gép" }
            },
          ],
          yAxis: {
            title: {
              text: "Idő (perc)"
            },
          },
        }

        vm.startloading = false;
      });
    }
    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }

    function feltolt_adatok(tomb) {
      var adatok = [];

      for (var i = 0; i < tomb.length; i++) {
        var d = {}
        d.y = tomb[i].time;
        d.x = tomb[i].name;
        d.st = tomb[i].state;
        adatok.push(d);
      }
      return adatok;
    }

    function feltolt_tipus(tomb) {
      var adatok = [];

      for (var i = 0; i < tomb.length; i++) {
        adatok.push(tomb[i].name);
      }
      return adatok;
    }

  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
