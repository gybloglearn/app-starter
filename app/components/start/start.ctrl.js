define([], function () {
  'use strict';
  function Controller(ufService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime() + (24*60*60*1000), 'yyyy-MM-dd');
    vm.now = $filter('date')(new Date().getTime(), 'yyyy-MM-dd HH:mm');
    vm.days = [];
    vm.data = [];
    vm.load = false;
    vm.loadetf = loadetf;

    function loadetf() {
      vm.load = true;
      vm.data = [];
      var gradedata = [];
      vm.endate = $filter('date')(new Date(vm.startdate).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      ufService.getetf(vm.startdate, vm.endate).then(function (response) {
        vm.data = response.data;
        for (var i = 0; i < vm.data.length; i++) {
          var number = 0;
          if (vm.data[i].startdate != "") {
            number = new Date(vm.data[i].startdate).getHours() * 60 + new Date(vm.data[i].startdate).getMinutes();
            if (number < 350) {
              vm.data[i].day = $filter('date')(new Date(vm.data[i].startdate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
            }
            else {
              vm.data[i].day = $filter('date')(new Date(vm.data[i].startdate).getTime(), 'yyyy-MM-dd');
            }
            if(new Date(vm.data[i].startdate).getMinutes() > 50) {
              vm.data[i].hour = $filter('date')(new Date(vm.data[i].startdate).getTime()+3600*1000, "HH");
            } else {
              vm.data[i].hour = $filter('date')(new Date(vm.data[i].startdate).getTime(), "HH");
            }

          }
          vm.data[i].Amount = 1;
          vm.data[i].AEQ = 1.2;
        }
        ufService.getmodulhistory(vm.startdate, vm.endate).then(function (response) {
          gradedata = response.data;
          for (var i = 0; i < vm.data.length; i++) {
            for (var j = 0; j < gradedata.length; j++) {
              if (vm.data[i].PhaseName == "Grade" && vm.data[i].jobid == gradedata[j].jobid) {
                vm.data[i].grade = gradedata[j].Grade;
              }
            }
          }
          //console.log(vm.data);
          vm.xAxisData = [];
          vm.centri = []; vm.centricum = [];
          vm.pstart = []; vm.pstartcum = [];
          var targ = [];
          var hour = 0;
          for (var i = 0; i < 24; i++){
            if(i < 18){
              hour = (i+6)<10?"0"+(i+6):""+(i+6);
              vm.xAxisData.push(hour);
            } else {
              hour = (i-18)<10?"0"+(i-18):""+(i-18);
              vm.xAxisData.push(hour);
            }
            vm.centri.push({cat: hour, y: $filter('filter')(vm.data, {PhaseName: 'Centrifuge end', hour: hour}).length});
            vm.pstart.push({cat: hour, y: $filter('filter')(vm.data, {PhaseName: 'Potting flip', hour: hour}).length});
            if (i > 0){
              vm.centricum.push({cat: hour, y: vm.centricum[i-1].y + $filter('filter')(vm.data, {PhaseName: 'Centrifuge end', hour: hour}).length});
              vm.pstartcum.push({cat: hour, y: vm.pstartcum[i-1].y + $filter('filter')(vm.data, {PhaseName: 'Potting flip', hour: hour}).length});
              targ.push({cat: hour, y: targ[i-1].y + 2.91});
            } else {
              vm.centricum.push({cat: hour, y: $filter('filter')(vm.data, {PhaseName: 'Centrifuge end', hour: hour}).length});
              vm.pstartcum.push({cat: hour, y: $filter('filter')(vm.data, {PhaseName: 'Potting flip', hour: hour}).length});
              targ.push({cat: hour, y: 2.91});
            }
          }

          vm.chartconfig = {
            chart: { type: 'column' },
            title: { text: 'ZW1500 Termékvonal' },
            subTitle: { text: 'MES adatok megjelenítése' },
            tooltip: {
              shared: true,
              pointFormat: '<span style="color:{series.color}">{series.name}: {point.y:.0f}</span><br>',
              useHTML: true
            },
            plotOptions: {
              column: {
                stacking: 'normal'
              }
            },
            xAxis: { type: 'category', categories: vm.xAxisData },
            yAxis: [
              {title: { text: 'Órai Darabszám'}, min: 0, max: 8, tickInterval: 1},
              {title: { text: 'Napi Összesítő'}, opposite: true, min: 0, max: 80, tickInterval: 10}
            ],
            series: [
              //{ name: 'SPL end', data: vm.bundleChartData, stack: 'spl', color: 'rgb(54,147,248)' },
              { name: 'Potting flip', data: vm.pstart, stack: 'potting' , color: 'rgb(255,152,33)'},
              { name: 'Potting flip összesítő', data: vm.pstartcum, type: "line", yAxis: 1, color: 'rgb(255,152,33)'},
              { name: 'Centrifuga End', data: vm.centri, stack: 'centrifuge', color: 'rgb(156,151,255)'},
              { name: 'Centrifuga End összesítő', data: vm.centricum, type: "line", yAxis: 1, color: 'rgb(156,151,255)'},
              { name: 'Cél', data: targ, type: "line", yAxis: 1, color: 'rgb(255,0,0)'}
              //{ name: 'BP End', data: vm.bp, stack: 'bp' , color: 'rgb(0,92,185)'},
              //{ name: 'Scrap', data: vm.scrapgrade, stack: 'grade' , color: 'rgb(222,37,51)'},
              //{ name: 'Grade', data: vm.goodgrade, stack: 'grade' , color: 'rgb(70,173,0)'},
              //{ name: 'Cél', type: 'line', color: 'Green', data: vm.target }
            ]
          };
          vm.load = false;
        });
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user')?$state.go('login'):$rootScope.user=$cookies.getObject('user'));
      vm.chartconfig = {
        chart: {}
      };
      vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
      loadetf();
    }
  }
  Controller.$inject = ['ufService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
