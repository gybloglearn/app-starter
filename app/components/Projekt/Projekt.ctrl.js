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
          data: [10, 7, 5, 4, 2, 1]
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
    };
      });
    }

    function feltolt_day() {
      var napok = [];
      for (var i = 0; i < vm.sprint.length; i++) {
        if (vm.sprint[i].project == vm.project.id) {
          for (var j = 0; j <= 14; j++) {
            vm.now = $filter('date')(vm.sprint[i].id + (j * 24 * 3600 * 1000), 'yyyy-MM-dd');
            napok.push(vm.now);
          }
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
