define([], function () {
  'use strict';
  function Controller($cookies, $state, $rootScope, bpsdataService, $filter) {
    var vm = this;
    vm.n = new Date().getTime();
    vm.tabledata = [];
    vm.opdata = [];
    activate();
    vm.getData = getData;
    function getData() {
      vm.loading = true;
      vm.chartconf = { chart: { type: 'xrange' } };
      var i = bpsdataService.getToday($filter('date')(new Date(vm.fr), 'yyyy-MM-dd'), 'BP1,BP2,BP3,BP4,BP5,BP6,BP7,BP8,BP12,BP13,BP14,BP15,BP21,BP22,BP23,BP25,BP26');
      var datas = [
        { name: "Bubble point tank1", val: 0, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Bubble point tank2", val: 1, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Bubble point tank3", val: 2, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Bubble point tank4", val: 3, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Bubble point tank5", val: 4, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Bubble point tank6", val: 5, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Bubble point tank7", val: 6, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Bubble point tank8", val: 7, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Bubble point tank12", val: 8, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Bubble point tank13", val: 9, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Bubble point tank14", val: 10, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Bubble point tank15", val: 11, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Bubble point tank21", val: 12, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Bubble point tank22", val: 13, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Bubble point tank23", val: 14, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Bubble point tank25", val: 15, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Bubble point tank26", val: 16, color: '#005cb9', borderColor: '#005cB9', data: [], pointWidth: 10 },
        { name: "Kieső idő", color: '#ff9821', borderColor: '#ff9821', data: [], pointWidth: 10 }
      ];
      i.then(function (resp) {
        vm.tabledata = $filter('orderBy')(resp.data, ['machinename', 'startdate']);
        for (var k = 0; k < vm.tabledata.length; k++) {
          for (var j = 0; j < datas.length; j++) {
            if (datas[j].name == vm.tabledata[k].machinename) {
              datas[j].data.push({ y: datas[j].val, x: new Date(vm.tabledata[k].startdate).getTime() + 3600 * 1000, x2: new Date(vm.tabledata[k].enddate).getTime() + 3600 * 1000, JobID: vm.tabledata[k].JobID, op: vm.tabledata[k].Operator, rep: vm.tabledata[k].Repaired, rem: vm.tabledata[k].removed });
              if (k > 0) {
                datas[datas.length - 1].data.push({ y: datas[j].val, x2: new Date(vm.tabledata[k].startdate).getTime() + 1000 * 3600, x: new Date(vm.tabledata[k - 1].enddate).getTime() + 1000 * 3600 });
              }
            }
          }
        }
        vm.chartconf = {
          chart: { type: 'xrange', height: 440 },
          xAxis: {
            type: 'datetime', tickInterval: 3600 * 1000,
            plotBands: [
              { color: "#eee", from: new Date($filter('date')(new Date(vm.fr), 'yyyy-MM-dd')).getTime() + 5 * 3600 * 1000 + 50 * 60 * 1000, to: new Date($filter('date')(new Date(vm.fr), 'yyyy-MM-dd')).getTime() + 13 * 3600 * 1000 + 50 * 60 * 1000 },
              { color: "#ddd", from: new Date($filter('date')(new Date(vm.fr), 'yyyy-MM-dd')).getTime() + 13 * 3600 * 1000 + 50 * 60 * 1000, to: new Date($filter('date')(new Date(vm.fr), 'yyyy-MM-dd')).getTime() + 21 * 3600 * 1000 + 50 * 60 * 1000 },
              { color: "#ccc", from: new Date($filter('date')(new Date(vm.fr), 'yyyy-MM-dd')).getTime() + 21 * 3600 * 1000 + 50 * 60 * 1000, to: new Date($filter('date')(new Date(vm.fr), 'yyyy-MM-dd')).getTime() + 29 * 3600 * 1000 + 50 * 60 * 1000 }
            ]
          },
          yAxis: { title: { text: 'UFF' }, min: 0, max: 16, categories: ['BP1', 'BP2', 'BP3', 'BP4', 'BP5', 'BP6', 'BP7', 'BP8', 'BP12', 'BP13', 'BP14', 'BP15', 'BP21', 'BP22', 'BP23', 'BP25', 'BP26'] },
          legend: { floating: false, enabled: false, align: 'top' },
          tooltip: {
            useHTML: true,
            headerFormat: '<b style="color:{series.color};font-weight:bold;">{series.name}</b><br>',
            pointFormat: '<span style="color:{series.color};">{point.op}</span><br><span style="font-size:1.2em">{point.x:%H:%M:%S} - {point.x2:%H:%M:%S}</span><br><b style="font-size:10px">{point.JobID}</b><br><i style="font-size:10px">{point.rep} - bökés -> {point.rem} - kivett szál</i>'
          },
          series: datas
        };
        vm.loading = false;
      });
    }

    function getOperator() {
      var op = bpsdataService.getToday($filter('date')(new Date(vm.fr), 'yyyy-MM-dd'), 'BP1,BP2,BP3,BP4,BP5,BP6,BP7,BP8,BP12,BP13,BP14,BP15,BP21,BP22,BP23,BP25,BP26');
      var datas = [];
      var numbers=[];
      var a = 0;
      var talalat = 0;
      vm.opchartconfig = { chart: { type: 'xrange' } };

      op.then(function (resp) {
        datas = $filter('orderBy')(resp.data, ['machinename', 'startdate']);
        for (var i = 0; i < datas.length; i++) {
          var actoperator = datas[i].Operator;
          for (var j = 0; j < vm.opdata.length; j++) {
            if (actoperator == vm.opdata[j].operator) {
              talalat++;
            }
          }
          if (talalat > 0) {
            talalat = 0;
            a = a;
          }
          else {
            numbers[a]=actoperator;
            vm.opdata[a] = {};
            vm.opdata[a].operator = actoperator;
            vm.opdata[a].val = a;
            vm.opdata[a].color = '#005cb9';
            vm.opdata[a].borderColor = '#005cb9';
            vm.opdata[a].data = [];
            vm.opdata[a].pointWidth = 10;
            a++
          }
        }
        vm.opdata[a] = {};
        vm.opdata[a].operator = "Kieső idő";
        vm.opdata[a].color = '#ff9821';
        vm.opdata[a].borderColor = '#ff9821';
        vm.opdata[a].data = [];
        vm.opdata[a].pointWidth = 10;

        console.log(numbers);


        for (var b = 0; b < datas.length; b++) {
          for (var c = 0; c < vm.opdata.length; c++) {
            if (vm.opdata[c].operator == datas[b].Operator) {
              vm.opdata[c].data.push({ y: vm.opdata[c].val, x: new Date(datas[b].startdate).getTime() + 3600 * 1000, x2: new Date(datas[b].enddate).getTime() + 3600 * 1000, JobID: datas[b].JobID, bp: datas[b].machinename, rep: datas[b].Repaired, rem: datas[b].removed });
              if (b > 0) {
                vm.opdata[vm.opdata.length - 1].data.push({ y: vm.opdata[c].val, x2: new Date(datas[b].startdate).getTime() + 1000 * 3600, x: new Date(datas[b - 1].enddate).getTime() + 1000 * 3600 });
              }
            }
          }
        }
        vm.opchartconfig = {
          chart: { type: 'xrange', height: 440 },
          xAxis: {
            type: 'datetime', tickInterval: 3600 * 1000,
            plotBands: [
              { color: "#eee", from: new Date($filter('date')(new Date(vm.fr), 'yyyy-MM-dd')).getTime() + 5 * 3600 * 1000 + 50 * 60 * 1000, to: new Date($filter('date')(new Date(vm.fr), 'yyyy-MM-dd')).getTime() + 13 * 3600 * 1000 + 50 * 60 * 1000 },
              { color: "#ddd", from: new Date($filter('date')(new Date(vm.fr), 'yyyy-MM-dd')).getTime() + 13 * 3600 * 1000 + 50 * 60 * 1000, to: new Date($filter('date')(new Date(vm.fr), 'yyyy-MM-dd')).getTime() + 21 * 3600 * 1000 + 50 * 60 * 1000 },
              { color: "#ccc", from: new Date($filter('date')(new Date(vm.fr), 'yyyy-MM-dd')).getTime() + 21 * 3600 * 1000 + 50 * 60 * 1000, to: new Date($filter('date')(new Date(vm.fr), 'yyyy-MM-dd')).getTime() + 29 * 3600 * 1000 + 50 * 60 * 1000 }
            ]
          },
          yAxis: { title: { text: 'Operátorok' }, min: 0, max: numbers.length-1, categories: numbers },
          legend: { floating: false, enabled: false, align: 'top' },
          tooltip: {
            useHTML: true,
            headerFormat: '<b style="color:{series.color};font-weight:bold;">{series.operator}</b><br>',
            pointFormat: '<span style="color:{series.color};">{point.op}</span><br><span style="font-size:1.2em">{point.x:%H:%M:%S} - {point.x2:%H:%M:%S}</span><br><b style="font-size:10px">{point.JobID}</b><br><i style="font-size:10px">{point.rep} - bökés -> {point.rem} - kivett szál</i>'
          },
          series: vm.opdata
        };
        vm.loading = false;

      });
    }

    function activate() {
      vm.fr = $filter('date')(vm.n, 'yyyy-MM-dd');
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      getData();
      getOperator();
    }
  }
  Controller.$inject = ['$cookies', '$state', '$rootScope', 'bpsdataService', '$filter'];
  return Controller;
});
