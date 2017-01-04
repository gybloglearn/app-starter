define([], function () {
  'use strict';
  function Controller($cookies, $state, $rootScope, $stateParams, $filter, sprintService) {
    var vm = this;
    vm.project = {};
    vm.sprint = [];

    activate();
    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      if ($stateParams.project) {
        vm.project = $stateParams.project;
      }
      else {
        $state.go("start");
      }

      sprintService.getAll().then(function (resp) {
        vm.sprint = resp.data;
        vm.thisprojectsprint = $filter('orderBy')($filter('filter')(vm.sprint, vm.project.id), "id", true);
        if (vm.project.status != 0) {
          generateChartConfig(vm.thisprojectsprint[0]);
        }
      });

    }
    vm.clickDate = generateChartConfig;


    function generateChartConfig(thisprojectsprint) {
      vm.chartConfig = {
        chart: {
          type: 'area'
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          }
        },
        title: {
          text: vm.project.name
        },
        yAxis: {
          title: {
            text: "Feladat státuszok"
          },
          tickInterval: 1,
          max: thisprojectsprint.status[0].data.max //ahány feladat van a sprintben
        },
        xAxis: {
          categories: feltolt_day(thisprojectsprint)
        },
        tooltip: { shared: true },
        series: [
          {
            name: 'Várakozik',
            color: '#999999',
            data: thisprojectsprint.status[0].data
          },
          {
            name: 'Folyamatban',
            color: '#ffbb33',
            data: thisprojectsprint.status[1].data
          },
          {
            name: 'Lekódolva',
            color: '#3399ff',
            data: thisprojectsprint.status[2].data
          },
          {
            name: 'Tesztelve',
            color: '#ff3385',
            data: thisprojectsprint.status[3].data
          },
          {
            name: 'Kész',
            color: '#ffff33',
            data: thisprojectsprint.status[4].data
          },
          {
            name: 'Bevezetve',
            color: '#33ff33',
            data: thisprojectsprint.status[5].data
          }
        ]
      };
    }
    function feltolt_day(item) {
      var napok = [];
      for (var j = 0; j <= 14; j++) {
        vm.now = $filter('date')(item.id + (j * 24 * 3600 * 1000), 'yyyy-MM-dd');
        napok[j] = vm.now;
      }
      return napok;
    }
  }

  Controller.$inject = ['$cookies', '$state', '$rootScope', '$stateParams', '$filter', 'sprintService'];
  return Controller;
});
