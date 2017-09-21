define([], function () {
  'use strict';
  function Controller(scrapService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (7 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.levels = ["J1", "J2", "J3", "Konyvelesre kesz", "Konyvelve", "Visszautasitva", "Penzugyi reviewed"];
    vm.actlevel = "Konyvelve";
    vm.data = [];
    vm.scrapfilter = [];
    vm.cikkfilter = [];
    vm.scrapdata = [];
    vm.load = load;
    vm.loading = false;

    function load() {
      vm.loading = true;
      vm.data = [];
      vm.scrapfilter = [];
      vm.cikkfilter = [];
      vm.scrapdata = [];

      scrapService.get(vm.startdate, vm.enddate, vm.actlevel).then(function (response) {
        vm.data = response.data;
        vm.scrapfilter = $filter('unique')(vm.data, 'scrapName');
        vm.cikkfilter = $filter('unique')(vm.data, 'CikkMegnevezes');

        for (var i = 0; i < vm.scrapfilter.length; i++) {
          var obj = {};
          obj = {
            code: vm.scrapfilter[i].scrapName,
            amount: 0
          };
          vm.scrapdata.push(obj);
        }
        for (var i = 0; i < vm.scrapdata.length; i++) {
          for (var j = 0; j < vm.data.length; j++) {
            if (vm.scrapdata[i].code == vm.data[j].scrapName) {
              vm.scrapdata[i].amount += vm.data[j].Mennyiseg * 1;
            }
          }
        }
        var sc = [];
        var chartdrill = [];
        for (var i = 0; i < vm.scrapdata.length; i++) {
          sc.push({ name: vm.scrapdata[i].code, y: vm.scrapdata[i].amount, drilldown: vm.scrapdata[i].code });
          chartdrill.push({name: vm.scrapdata[i].code, id: vm.scrapdata[i].code, data: [] });
        }
        for(var i=0;i<chartdrill.length;i++){
          for(var j=0;j<vm.cikkfilter.length;j++){
            var t=[];
            var szam=0;
            for(var k=0;k<vm.data.length;k++){
              if(vm.data[k].CikkMegnevezes==vm.cikkfilter[j].CikkMegnevezes && vm.data[k].scrapName==chartdrill[i].name){
                szam+=vm.data[k].Mennyiseg*1;
              }
            }
            t=[vm.cikkfilter[j].CikkMegnevezes,szam];
            chartdrill[i].data.push(t);
          }
        }
        setChartpie(sc, chartdrill);
        vm.loading = false;
      });
    }

    function setChartpie(dt, dd) {
      vm.chartconfig_pie = {
        chart: {
          type: 'pie',
          width: 1100,
          height: 400
        },
        tooltip: {
          pointFormat: '<b style="color:{point.color};font-size:1.2em;font-weight:bold">{point.percentage:.2f} %</b>'
        },
        title: { text: "Scrap eloszlás" },
        plotOptions: {
          pie: {
            center: ['50%', '50%'],
            showInLegend: false
          }
        },
        series: [
          {
            name:"adatok",
            data: dt
          }
        ],
        drilldown: {
          series: dd
        }
      };
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.today = $filter('date')(new Date(), 'yyyy-MM-dd');
    }
  }
  Controller.$inject = ['scrapService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
