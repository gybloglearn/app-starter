define([], function () {
  'use strict';
  function Controller(mtfhoursService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.tanks = ["Bubble point tank1", "Bubble point tank2", "Bubble point tank3", "Bubble point tank4", "Bubble point tank5", "Bubble point tank6", "Bubble point tank7", "Bubble point tank12", "Bubble point tank13", "Bubble point tank14", "Bubble point tank15", "Bubble point tank21", "Bubble point tank22", "Bubble point tank23", "Bubble point tank25", "Bubble point tank26"];
    vm.acttype = "";
    vm.acttank = "";
    vm.change_date=change_date;
    vm.create_chart=create_chart;
    vm.mtfload=false;

    function loadPartnumbers() {
      vm.partnumbers = [];
      mtfhoursService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
        console.log(vm.partnumbers);
      });
      load();
    }

    function change_date(){
      vm.enddate=$filter('date')(new Date(vm.startdate).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      load();
    }

    function load() {
      vm.mtfload=true;
      vm.data = [];
      angular.forEach(vm.tanks, function (v, k) {
        mtfhoursService.get(vm.startdate, vm.enddate, v).then(function (response) {
          var d = $filter('unique')(response.data, 'modul_id1');
          var respd = response.data;
          for (var i = 0; i < d.length; i++) {
            d[i].tank = v;
            d[i].sumbokes = 0;
            for (var j = 0; j < vm.partnumbers.length; j++) {
              if (d[i].modul_id1.includes(vm.partnumbers[j].id)) {
                d[i].modul = vm.partnumbers[j].name;
                d[i].aeq = vm.partnumbers[j].aeq * 1;
              }
            }
            for (var k = 0; k < respd.length; k++) {
              if (d[i].modul_id1 == respd[k].modul_id1) {
                d[i].sumbokes += respd[k].bt_kat_db1 * 1;
              }
            }
            var num = new Date(d[i].bt_datetime).getMinutes();
            if (num < 50) {
              d[i].hour = $filter('date')(new Date(d[i].bt_datetime).getTime(), 'HH');
            }
            else {
              d[i].hour = $filter('date')(new Date(d[i].bt_datetime).getTime() + (3600 * 1000), 'HH');
            }
            if (d[i].modul_id1 != "") {
              vm.data.push(d[i]);
            }
          }
          console.log(vm.data);
          create_chart();
          vm.mtfload=false;
        });
      });
    }

    function create_chart() {
      vm.bokeshour = [];
      vm.cats = [];
      for (var i = 6; i < 24; i++) {
        vm.cats.push(i < 10 ? "0" + i : "" + i);
      }
      for (var j = 0; j < 6; j++) {
        vm.cats.push("0" + j);
      }

      for (var k = 0; k < vm.cats.length; k++) {
        vm.bokeshour.push({ cat: vm.cats[k], y: ($filter('sumField')($filter('filter')(vm.data, { modul: vm.acttype, tank: vm.acttank, hour: vm.cats[k] }), 'sumbokes'))*1 });
      }

      vm.chartconfig = {
        chart: { type: 'column' },
        title: { text: 'Bökés eloszlása óránként ' + vm.acttype + ' ' + vm.acttank },
        xAxis: { type: 'category', categories: vm.cats },
        yAxis: { title: { text: 'db' } },
        series: [
          { name: 'Bökés', color: 'rgb(0, 0, 255)', data: vm.bokeshour },
        ]
      }
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadPartnumbers();
    }
  }
  Controller.$inject = ['mtfhoursService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
