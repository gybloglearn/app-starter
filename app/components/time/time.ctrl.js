define([], function () {
  'use strict';
  function Controller(timeService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (7 * 24 * 3600 * 1000),'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000),'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000),'yyyy-MM-dd');
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.actsm = "";
    vm.createchart = createchart;
    vm.create_dates = create_dates;
    vm.load=false;

    function create_dates() {
      vm.dates = [];
      vm.days = [];
      vm.load=true;
      var differencedate = 0;
      differencedate = (new Date(vm.enddate).getTime() - new Date(vm.startdate).getTime()) / (24 * 3600 * 1000);
      for (var i = 0; i <= differencedate; i++) {
        vm.dates[i] = $filter('date')(new Date(vm.enddate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyyMMdd');
        vm.days[i] = $filter('date')(new Date(vm.enddate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
      }
      load();
    }


    function load() {
      vm.data = [];
      angular.forEach(vm.dates, function (v, k) {
        timeService.get(v).then(function (response) {
          var d = response.data;
          //sheetmakerenként szétszedés tömbökbe
          var sm1d = $filter('filter')(d, { Machine: 'SM1' });
          var sm2d = $filter('filter')(d, { Machine: 'SM2' });
          var sm4d = $filter('filter')(d, { Machine: 'SM4' });
          var sm5d = $filter('filter')(d, { Machine: 'SM5' });
          var sm6d = $filter('filter')(d, { Machine: 'SM6' });
          var sm7d = $filter('filter')(d, { Machine: 'SM7' });
          var sm8d = $filter('filter')(d, { Machine: 'SM8' });
          var sm9d = $filter('filter')(d, { Machine: 'SM9' });
          //tömbök sorbarendezése idő szerint
          sm1d = $filter('orderBy')(sm1d, 'timestamp');
          sm2d = $filter('orderBy')(sm2d, 'timestamp');
          sm4d = $filter('orderBy')(sm4d, 'timestamp');
          sm5d = $filter('orderBy')(sm5d, 'timestamp');
          sm6d = $filter('orderBy')(sm6d, 'timestamp');
          sm7d = $filter('orderBy')(sm7d, 'timestamp');
          sm8d = $filter('orderBy')(sm8d, 'timestamp');
          sm9d = $filter('orderBy')(sm9d, 'timestamp');
          //számolt idő timestamp alapján
          for (var i = 0; i < sm1d.length; i++) {
            if (i < sm1d.length - 1) {
              sm1d[i].count_time = (sm1d[i + 1].timestamp - sm1d[i].timestamp) / 1000;
            }
            else {
              sm1d[i].count_time = sm1d[i].Event_time;
            }
            sm1d[i].date = vm.days[k];
            vm.data.push(sm1d[i]);
          }

          for (var i = 0; i < sm2d.length; i++) {
            if (i < sm2d.length - 1) {
              sm2d[i].count_time = (sm2d[i + 1].timestamp - sm2d[i].timestamp) / 1000;
            }
            else {
              sm2d[i].count_time = sm2d[i].Event_time;
            }
            sm2d[i].date = vm.days[k];
            vm.data.push(sm2d[i]);
          }

          for (var i = 0; i < sm4d.length; i++) {
            if (i < sm4d.length - 1) {
              sm4d[i].count_time = (sm4d[i + 1].timestamp - sm4d[i].timestamp) / 1000;
            }
            else {
              sm4d[i].count_time = sm4d[i].Event_time;
            }
            sm4d[i].date = vm.days[k];
            vm.data.push(sm4d[i]);
          }

          for (var i = 0; i < sm5d.length; i++) {
            if (i < sm5d.length - 1) {
              sm5d[i].count_time = (sm5d[i + 1].timestamp - sm5d[i].timestamp) / 1000;
            }
            else {
              sm5d[i].count_time = sm5d[i].Event_time;
            }
            sm5d[i].date = vm.days[k];
            vm.data.push(sm5d[i]);
          }

          for (var i = 0; i < sm6d.length; i++) {
            if (i < sm6d.length - 1) {
              sm6d[i].count_time = (sm6d[i + 1].timestamp - sm6d[i].timestamp) / 1000;
            }
            else {
              sm6d[i].count_time = sm6d[i].Event_time;
            }
            sm6d[i].date = vm.days[k];
            vm.data.push(sm6d[i]);
          }

          for (var i = 0; i < sm7d.length; i++) {
            if (i < sm7d.length - 1) {
              sm7d[i].count_time = (sm7d[i + 1].timestamp - sm7d[i].timestamp) / 1000;
            }
            else {
              sm7d[i].count_time = sm7d[i].Event_time;
            }
            sm7d[i].date = vm.days[k];
            vm.data.push(sm7d[i]);
          }

          for (var i = 0; i < sm8d.length; i++) {
            if (i < sm8d.length - 1) {
              sm8d[i].count_time = (sm8d[i + 1].timestamp - sm8d[i].timestamp) / 1000;
            }
            else {
              sm8d[i].count_time = sm8d[i].Event_time;
            }
            sm8d[i].date = vm.days[k];
            vm.data.push(sm8d[i]);
          }

          for (var i = 0; i < sm9d.length; i++) {
            if (i < sm9d.length - 1) {
              sm9d[i].count_time = (sm9d[i + 1].timestamp - sm9d[i].timestamp) / 1000;
            }
            else {
              sm9d[i].count_time = sm9d[i].Event_time;
            }
            sm9d[i].date = vm.days[k];
            vm.data.push(sm9d[i]);
          }
          createchart();
          vm.load=false;
        });
      });
    }

    function createchart() {
      console.log(vm.data);

      vm.production_eventtime = [];
      vm.start_eventtime = [];
      vm.downtime_muszaki_eventtime = [];
      vm.downtime_szervezesi_eventtime = [];
      vm.downtime_tervezesi_eventtime = [];
      vm.production_counttime = [];
      vm.start_counttime = [];
      vm.downtime_muszaki_counttime = [];
      vm.downtime_szervezesi_counttime = [];
      vm.downtime_tervezesi_counttime = [];

      for (var i = 0; i < vm.days.length; i++) {
        //eventtime
        vm.production_eventtime.push({ cat: vm.days[i], y: ($filter('sumField')($filter('filter')(vm.data, { Machine: vm.actsm, Event_type: 'Sheet Production', date: vm.days[i] }), 'Event_time')) * 1 });
        vm.start_eventtime.push({ cat: vm.days[i], y: ($filter('sumField')($filter('filter')(vm.data, { Machine: vm.actsm, Event_type: 'Modul Start', date: vm.days[i] }), 'Event_time')) * 1 });
        vm.downtime_muszaki_eventtime.push({ cat: vm.days[i], y: ($filter('sumField')($filter('filter')(vm.data, { Machine: vm.actsm, Ev_Group: 'Muszaki technikai okok', date: vm.days[i] }), 'Event_time')) * 1 });
        vm.downtime_szervezesi_eventtime.push({ cat: vm.days[i], y: ($filter('sumField')($filter('filter')(vm.data, { Machine: vm.actsm, Ev_Group: 'Szervezesi veszteseg', date: vm.days[i] }), 'Event_time')) * 1 });
        vm.downtime_tervezesi_eventtime.push({ cat: vm.days[i], y: ($filter('sumField')($filter('filter')(vm.data, { Machine: vm.actsm, Ev_Group: 'Tervezett veszteseg', date: vm.days[i] }), 'Event_time')) * 1 });
        //counttime
        vm.production_counttime.push({ cat: vm.days[i], y: ($filter('sumField')($filter('filter')(vm.data, { Machine: vm.actsm, Event_type: 'Sheet Production', date: vm.days[i] }), 'count_time')) * 1 });
        vm.start_counttime.push({ cat: vm.days[i], y: ($filter('sumField')($filter('filter')(vm.data, { Machine: vm.actsm, Event_type: 'Modul Start', date: vm.days[i] }), 'count_time')) * 1 });
        vm.downtime_muszaki_counttime.push({ cat: vm.days[i], y: ($filter('sumField')($filter('filter')(vm.data, { Machine: vm.actsm, Ev_Group: 'Muszaki technikai okok', date: vm.days[i] }), 'count_time')) * 1 });
        vm.downtime_szervezesi_counttime.push({ cat: vm.days[i], y: ($filter('sumField')($filter('filter')(vm.data, { Machine: vm.actsm, Ev_Group: 'Szervezesi veszteseg', date: vm.days[i] }), 'count_time')) * 1 });
        vm.downtime_tervezesi_counttime.push({ cat: vm.days[i], y: ($filter('sumField')($filter('filter')(vm.data, { Machine: vm.actsm, Ev_Group: 'Tervezett veszteseg', date: vm.days[i] }), 'count_time')) * 1 });
      }

      vm.chartconfig = {
        chart: { type: 'column' },
        title: { text: 'Könyvelt idő - Számolt idő ' + vm.actsm },
        plotOptions: {
          column: {
            stacking: 'normal',
          }
        },
        tooltip: { shared: true },
        xAxis: { type: 'category', categories: vm.days },
        yAxis:
          { title: { text: 'Másodperc' } },
        series: [
          { name: 'Modul Start eset', color: 'rgb(51, 204, 51)', data: vm.start_eventtime, stack: 'eventtime' },
          { name: 'Sheet Production eset', color: 'rgb(153, 255, 102)', data: vm.production_eventtime, stack: 'eventtime' },
          { name: 'Műszaki technikai okok eset', color: 'rgb(255, 0, 0)', data: vm.downtime_muszaki_eventtime, stack: 'eventtime' },
          { name: 'Szervezési veszteség eset', color: 'rgb(51, 51, 204)', data: vm.downtime_szervezesi_eventtime, stack: 'eventtime' },
          { name: 'Tervezett veszteség eset', color: 'rgb(204, 51, 255)', data: vm.downtime_tervezesi_eventtime, stack: 'eventtime' },

          { name: 'Modul Start számolt', color: 'rgb(51, 204, 51)', data: vm.start_counttime, stack: 'counttime' },
          { name: 'Sheet Production számolt', color: 'rgb(153, 255, 102)', data: vm.production_counttime, stack: 'counttime' },
          { name: 'Műszaki technikai okok számolt', color: 'rgb(255, 0, 0)', data: vm.downtime_muszaki_counttime, stack: 'counttime' },
          { name: 'Szervezési veszteség számolt', color: 'rgb(51, 51, 204)', data: vm.downtime_szervezesi_counttime, stack: 'counttime' },
          { name: 'Tervezett veszteség számolt', color: 'rgb(204, 51, 255)', data: vm.downtime_tervezesi_counttime, stack: 'counttime' },
        ]
      }
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      create_dates();
    }
  }
  Controller.$inject = ['timeService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
