define([], function () {
  'use strict';
  function Controller($cookies, $state, $rootScope, $stateParams, $filter, sprintService) {
    var vm = this;
    vm.project = {};
    vm.sprint = [];
    vm.sprintazon = "";
    vm.sprintdue = "";

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
          categories: feltolt_day()
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
    function feltolt_day() {
      var napok = [];
      for (var i = 0; i < vm.sprint.length; i++) {
        if (vm.sprint[i].project == vm.project.id) {
          for (var j = 0; j <= 14; j++) {
            vm.now = $filter('date')(vm.sprint[i].id + (j * 24 * 3600 * 1000), 'yyyy-MM-dd');
            napok.push(vm.now);
          }
          vm.sprintazon = vm.sprint[i].id;
          vm.sprintdue = vm.sprint[i].due
        }
      }
      return napok;

    }

    /*vm.chartConfig = {
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
        max: 10 //ahány feladat van a sprintben
      },
      xAxis: {
        categories: feltolt_day()
      },
      tooltip: { shared: true },
      series: [
        {
          name: 'Várakozik',
          color: '#999999',
          data: [10, 7, 5, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: 'Folyamatban',
          color: '#ffbb33',
          data: [0, 2, 2, 1, 1, 2]
        },
        {
          name: 'Lekódolva',
          color: '#3399ff',
          data: [0, 1, 2, 0, 2, 3]
        },
        {
          name: 'Tesztelve',
          color: '#ff3385',
          data: [0, 0, 1, 3, 2, 4]
        },
        {
          name: 'Kész',
          color: '#ffff33',
          data: [0, 0, 0, 1, 2, 0]
        },
        {
          name: 'Bevezetve',
          color: '#33ff33',
          data: [0, 0, 0, 1, 1, 0]
        }
      ]
    };*/

  }
  Controller.$inject = ['$cookies', '$state', '$rootScope', '$stateParams', '$filter', 'sprintService'];
  return Controller;
});
