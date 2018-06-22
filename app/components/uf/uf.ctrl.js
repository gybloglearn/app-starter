define([], function () {
  'use strict';
  function Controller(ufService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (7 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.days = [];
    vm.data = [];
    vm.load = false;
    vm.createdates = createdates;

    function load1000Partnumbers() {
      vm.partnumbers = [];
      ufService.get1000partnumber().then(function (response) {
        vm.partnumbers = response.data;
        console.log(vm.partnumbers);
      });
    }

    function createdates() {
      vm.days = [];
      vm.loaddays = [];
      vm.data = [];
      var differencedate = 0;
      differencedate = (new Date(vm.enddate).getTime() - new Date(vm.startdate).getTime()) / (24 * 3600 * 1000);
      for (var i = 0; i <= differencedate; i++) {
        var obj = {
          date: $filter('date')(new Date(vm.enddate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'),
          spstart: 0,
          spend: 0,
          pottingin: 0,
          pottingp3: 0,
          pottingout: 0,
          centristart: 0,
          centriend: 0,
          bpstart: 0,
          bpend: 0,
          grade: 0
        }
        vm.data.push(obj);
        vm.loaddays[i] = $filter('date')(new Date(vm.enddate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyyMMdd');
        vm.days.push($filter('date')(new Date(vm.enddate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
      }
      loadpotting();
    }

    function loadpotting() {
      vm.load = true;
      var sdate = $filter('date')(new Date(vm.startdate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      var edate = $filter('date')(new Date(vm.enddate).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');

      ufService.getpotting(sdate, edate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          for (var i = 0; i < vm.partnumbers.length; i++) {
            if (response.data[j].jobid.includes(vm.partnumbers[i].modul)) {
              response.data[j].aeq = vm.partnumbers[i].aeq;
            }
          }
          var pottingford = new Date(response.data[j].Potting_Flip).getHours() * 60 + new Date(response.data[j].Potting_Flip).getMinutes();
          var takeoutnum = new Date(response.data[j].Brick_Takeout).getHours() * 60 + new Date(response.data[j].Brick_Takeout).getMinutes();
          var centrifugestartnum = new Date(response.data[j].Centrifuga_Start).getHours() * 60 + new Date(response.data[j].Centrifuga_Start).getMinutes();
          var centrifugestopnum = new Date(response.data[j].Centrifuga_Stop).getHours() * 60 + new Date(response.data[j].Centrifuga_Stop).getMinutes();
          var gradenum = new Date(response.data[j].Gradedate).getHours() * 60 + new Date(response.data[j].Gradedate).getMinutes();

          if (pottingford < 350) {
            response.data[j].Potting_Flip_Day = $filter('date')(new Date(response.data[j].Potting_Flip).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Potting_Flip_Day = $filter('date')(new Date(response.data[j].Potting_Flip).getTime(), 'yyyy-MM-dd');
          }
          if (takeoutnum < 350) {
            response.data[j].Brick_Takeout_Day = $filter('date')(new Date(response.data[j].Brick_Takeout).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Brick_Takeout_Day = $filter('date')(new Date(response.data[j].Brick_Takeout).getTime(), 'yyyy-MM-dd');
          }

          if (centrifugestartnum < 350) {
            response.data[j].Centrifuga_Start_Day = $filter('date')(new Date(response.data[j].Centrifuga_Start).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Centrifuga_Start_Day = $filter('date')(new Date(response.data[j].Centrifuga_Start).getTime(), 'yyyy-MM-dd');
          }
          if (centrifugestopnum < 350) {
            response.data[j].Centrifuga_Stop_Day = $filter('date')(new Date(response.data[j].Centrifuga_Stop).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Centrifuga_Stop_Day = $filter('date')(new Date(response.data[j].Centrifuga_Stop).getTime(), 'yyyy-MM-dd');
          }

          if (gradenum < 350) {
            response.data[j].Grade_Day = $filter('date')(new Date(response.data[j].Gradedate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Grade_Day = $filter('date')(new Date(response.data[j].Gradedate).getTime(), 'yyyy-MM-dd');
          }

          for (var k = 0; k < vm.data.length; k++) {
            if (vm.data[k].date == response.data[j].Brick_Potting_Init__Day) {
              vm.data[k].pottingin += response.data[j].aeq;
            }
            if (vm.data[k].date == response.data[j].Potting_Flip_Day) {
              vm.data[k].pottingp3 += response.data[j].aeq;
            }
            if (vm.data[k].date == response.data[j].Brick_Takeout_Day) {
              vm.data[k].pottingout += response.data[j].aeq;
            }

            if (vm.data[k].date == response.data[j].Centrifuga_Start_Day) {
              vm.data[k].centristart += response.data[j].aeq;
            }
            if (vm.data[k].date == response.data[j].Centrifuga_Stop_Day) {
              vm.data[k].centriend += response.data[j].aeq;
            }

            if (vm.data[k].date == response.data[j].Grade_Day) {
              vm.data[k].grade += response.data[j].aeq;
            }
          }
        }
        loadetf();
      });
    }

    function loadetf() {
      var sdate = $filter('date')(new Date(vm.startdate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      var edate = $filter('date')(new Date(vm.enddate).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');

      ufService.getetf(sdate, edate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          for (var i = 0; i < vm.partnumbers.length; i++) {
            if (response.data[j].jobid.includes(vm.partnumbers[i].modul)) {
              response.data[j].aeq = vm.partnumbers[i].aeq;
            }
          }

          for (var k = 0; k < vm.data.length; k++) {
            if (vm.data[k].date == response.data[j].BP_start_shiftday) {
              vm.data[k].bpstart += response.data[j].aeq;
            }
            if (vm.data[k].date == response.data[j].BP_end_shiftday) {
              vm.data[k].bpend += response.data[j].aeq;
            }
          }
        }
        createchart();
      });
    }

    function createchart() {
      
      var pottingdata = [];
      var centrifugadata = [];
      var bpdata = [];
      var gradedata = [];
      var target = [];

      for (var b = 0; b < vm.data.length; b++) {

        pottingdata.push(vm.data[b].pottingout);
        centrifugadata.push(vm.data[b].centriend);
        bpdata.push(vm.data[b].bpend);
        gradedata.push(vm.data[b].grade);
        target.push(60);
      }
      vm.chartconfig = {
        chart: { type: 'column' },
        title: { text: 'ZW1000 Termékvonal' },
        subTitle: { text: 'MES adatok megjelenítése' },
        xAxis: { type: 'category', categories: vm.days },
        series: [
          //{ name: 'SPL end', data: spldata },
          { name: 'Potting end', data: pottingdata },
          { name: 'Centrifuga end', data: centrifugadata },
          { name: 'BP end', data: bpdata },
          { name: 'Grade', data: gradedata },
          { name: 'Cél', type: 'line', color: 'Green', data: target }
        ]
      };
      vm.load = false;
      

    }


    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.chartconfig = {
        chart: {}
      };
      vm.edate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      load1000Partnumbers();
      createdates();
    }
  }
  Controller.$inject = ['ufService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
