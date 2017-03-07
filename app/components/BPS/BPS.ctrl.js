define([], function () {
  'use strict';
  function Controller($cookies, $state, $rootScope, bpsdataService, $filter) {
    var vm = this;
    vm.n = new Date().getTime();
    vm.tabledata = [];
    vm.opdata = [];
    activate();
    vm.getData = getData;
    vm.getToday=getToday;
    vm.datumszam = vm.fr;
    vm.datszam = datszam;

    function datszam()
    {
      vm.szam = new Date(vm.fr);
      vm.datumszam=$filter('date')(vm.szam, 'yyyy-MM-dd');
    }

    function getData() {
      vm.opdata = [];
      var a = 0;
      var talalat = 0;

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
        var actoperator;
        for (var k = 0; k < vm.tabledata.length; k++) {
          for (var j = 0; j < datas.length; j++) {
            if (datas[j].name == vm.tabledata[k].machinename) {
              datas[j].data.push({ y: datas[j].val, x: new Date(vm.tabledata[k].startdate).getTime() + 3600 * 1000, x2: new Date(vm.tabledata[k].enddate).getTime() + 3600 * 1000, JobID: vm.tabledata[k].JobID, op: vm.tabledata[k].Operator, rep: vm.tabledata[k].Repaired, rem: vm.tabledata[k].removed });
              if (k > 0) {
                datas[datas.length - 1].data.push({ y: datas[j].val, x2: new Date(vm.tabledata[k].startdate).getTime() + 1000 * 3600, x: new Date(vm.tabledata[k - 1].enddate).getTime() + 1000 * 3600 });
              }
            }
          }
          actoperator = vm.tabledata[k].Operator;
          for (var b = 0; b < vm.opdata.length; b++) {
            if (actoperator == vm.opdata[b].operator) {
              talalat++
            }
          }
          if (talalat > 0) {
            talalat = 0;
            a = a;
          }
          else {
            vm.opdata[a] = {}
            vm.opdata[a].operator = actoperator;
            vm.opdata[a].worktime = 0;
            vm.opdata[a].repair = 0;
            vm.opdata[a].remove = 0;
            vm.opdata[a].moduls = [];
            a++
          }

          for (var c = 0; c < vm.opdata.length; c++) {
            if (vm.opdata[c].operator == vm.tabledata[k].Operator) {
              vm.opdata[c].repair = vm.opdata[c].repair + vm.tabledata[k].Repaired;
              vm.opdata[c].remove = vm.opdata[c].remove + vm.tabledata[k].removed;
              vm.opdata[c].worktime = vm.opdata[c].worktime + ((new Date(vm.tabledata[k].enddate).getTime() - new Date(vm.tabledata[k].startdate).getTime()) / (1000 * 60));
              vm.opdata[c].moduls.push([vm.tabledata[k].JobID, vm.tabledata[k].Repaired]); // modulhoz tartozó bökések elmentése 2 dimenziós tömbbe
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

        vm.opchartconfig = {
          chart: {
            type: 'column',
          },
          plotOptions: {
            column: {
              stacking: 'normal'
            }
          },
          title: { text: "Munkaidő/kieső idő arányok" },
          series: [
            {
              name: 'Kieső idő',
              color: "#ff9821",
              data: feltolt_x_kieso(vm.opdata),
              stack: 'Összes idő'
            },
            {
              name: 'Munkaidő',
              color: "#005cb9",
              data: feltolt_x_hasznos(vm.opdata),
              stack: 'Összes idő'
            }
          ],
          xAxis: [
            {
              categories: feltolt_y(vm.opdata),
              title: { text: "Operátor" }
            },
          ],
          yAxis: {
            title: {
              text: "Idő(Perc)"
            }
          },
        }
        vm.loading = false;
      });
    }

    function getToday()
    {
      vm.fr=$filter('date')(new Date(), 'yyyy-MM-dd');
      getData();
    }

    function activate() {
      vm.fr = $filter('date')(vm.n, 'yyyy-MM-dd');
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      getData();
    }

    function feltolt_x_hasznos(tomb) {
      var x_adatok = [];
      for (var i = 0; i < tomb.length; i++) {
        x_adatok[i] = tomb[i].worktime;
      }
      return x_adatok;
    }

    function feltolt_x_kieso(tomb) {
      var x_adatok = [];
      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].worktime < 480) {
          x_adatok[i] = 480 - tomb[i].worktime;
        }
        else {
          x_adatok[i] = 0;
        }
      }
      return x_adatok;
    }

    function feltolt_y(tomb) {
      var y_adatok = [];
      for (var i = 0; i < tomb.length; i++) {
        y_adatok[i] = tomb[i].operator;
      }
      return y_adatok;
    }
  }
  Controller.$inject = ['$cookies', '$state', '$rootScope', 'bpsdataService', '$filter'];
  return Controller;
});