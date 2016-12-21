define([], function () {
  'use strict';
  function Controller($cookies, $state, $rootScope,$stateParams,$filter) {
    var vm = this;
    vm.project={};

    activate();
    function activate() {
      (!$cookies.getObject('user')?$state.go('login'):$rootScope.user=$cookies.getObject('user'));
      if($stateParams.project)
      {
        vm.project=$stateParams.project;
      }
      else
      {
        $state.go("start");
      }
    }

     function feltolt_day() {
            var napok = [];
            vm.downday = new Date().getTime();
            for (var i = 0; i < 14; i++) {
                vm.now = $filter('date')(vm.downday + i * 24 * 3600 * 1000, 'yyyy-MM-dd');
                napok.push(vm.now);
            }
            return napok;
        }



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
                title:{
                    text:"Feladat státuszok"
                },
                tickInterval:1,
                max:10 //ahágy feladat van a sprintben
            },
            xAxis: {
              categories: feltolt_day()
            },
            tooltip: { shared: true },
            series: [
                {
                    name: 'Várakozik',
                    color: '#999999',
                    data: [10, 7, 5, 4, 2, 1,0,0,0,0,0,0,0,0]
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

  }
  Controller.$inject = ['$cookies', '$state', '$rootScope','$stateParams','$filter'];
  return Controller;
});
