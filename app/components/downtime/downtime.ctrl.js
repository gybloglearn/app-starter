define([], function () {
  'use strict';
  function Controller(cleventService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.dt = [];
    vm.dtl = dtl;
    vm.clload = false;

    function dtl() {
      vm.enddate = $filter('date')(new Date(vm.startdate).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      load();
    }

    function load() {
      vm.clload = true;
      vm.dt = [];

      vm.chartdata = [
        { name: "Chlorination 4", val: 0, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Chlorination Tank5", val: 1, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Chlorination Tank6", val: 2, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Chlorination Tank7", val: 3, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Chlorination Tank8", val: 4, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Chlorination Tank11", val: 5, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Chlorination Tank12", val: 6, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Chlorination Tank13", val: 7, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Chlorination Tank14", val: 8, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Kieső idő", color: '#ff9821', borderColor: '#ff9821', data: [], pointWidth: 10 }
      ];

      cleventService.get(vm.startdate, vm.enddate).then(function (response) {
        vm.dt = $filter('orderBy')(response.data, ['MachineName', 'CL_Start']);
        for (var i = 0; i < vm.dt.length; i++) {
          for (var j = 0; j < vm.chartdata.length; j++) {
            if (vm.dt[i].MachineName == vm.chartdata[j].name) {
              if (vm.dt[i].CL_End != "") {
                var xkezd = new Date(vm.dt[i].CL_Start).getTime();
                var xvege = new Date(vm.dt[i].CL_End).getTime();
              }
              vm.chartdata[j].data.push({ y: vm.chartdata[j].val, x: xkezd, x2: xvege, JobID: vm.dt[i].JobID });
              if (i > 0) {
                if (vm.dt[i - 1].CL_End != "") {
                  var xkieso = new Date(vm.dt[i - 1].CL_End).getTime();
                }
                vm.chartdata[vm.chartdata.length - 1].data.push({ y: vm.chartdata[j].val, x2: xkezd, x: xkieso });
              }
              setChart(vm.chartdata);
            }
          }
        }
        vm.clload = false;
      });
    }

    function setChart(arr) {
      vm.chartconfig = {
        chart: {
          type: 'xrange',
        },
        xAxis: {
          type: 'datetime',
          tickInterval: 3600 * 1000,
        },
        yAxis: { title: { text: 'CL' }, min: 0, max: 8, categories: ['CL4', 'CL5', 'CL6', 'CL7', 'CL8', 'CL11', 'CL12', 'CL13', 'CL14'] },
        legend: { floating: false, enabled: false, align: 'top' },
        tooltip: {
          useHTML: true,
          headerFormat: '<b style="color:{series.color};font-weight:bold;">{series.name}</b><br>',
          pointFormat: '<span style="color:{series.color};"></span><br><span style="font-size:1.2em">{point.JobID}</span><br><span style="font-size:1.2em">{point.x:%H:%M:%S} - {point.x2:%H:%M:%S}</span><br>'
        },
        series: arr
      };
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.edate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      load();
    }
  }
  Controller.$inject = ['cleventService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
