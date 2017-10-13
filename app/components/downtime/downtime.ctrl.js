define([], function () {
  'use strict';
  function Controller(downtimeService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (14 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.data = [];
    vm.group = [];
    vm.names = [];
    vm.load = load;
    vm.loading = true;

    function load() {
      vm.loading = true;
      vm.data = [];
      vm.group = [];
      vm.names = [];
      var groupfilter = [];
      var namefilter = [];
      var goodtime = 0;

      downtimeService.get(vm.startdate, vm.enddate).then(function (response) {
        vm.data = response.data;
        groupfilter = $filter('unique')(vm.data, 'Reason_group_Name');
        namefilter = $filter('unique')(vm.data, 'reas_Name');

        goodtime = ((new Date(vm.enddate).getTime() - new Date(vm.startdate).getTime()) / 1000) * 2

        for (var i = 0; i < groupfilter.length; i++) {
          var obj = {};
          obj = {
            code: groupfilter[i].Reason_group_Name,
            amount: 0
          };
          vm.group.push(obj);
        }
        for (var i = 0; i < vm.group.length; i++) {
          for (var j = 0; j < vm.data.length; j++) {
            if (vm.group[i].code == vm.data[j].Reason_group_Name) {
              vm.group[i].amount += vm.data[j].Duration_s_ * 1;
              goodtime -= vm.data[j].Duration_s_ * 1;
            }
          }
        }
        var goodobj = {};
        goodobj = {
          code: "Elérhető idő",
          amount: goodtime
        }
        vm.group.push(goodobj);

        var gr = [];
        var chartdrill = [];
        var colors = [];
        colors["Elérhető idő"] = "rgb(100,200,50)";
        colors["Váratlan gépleállás"] = "rgb(255,0,0)";
        colors["Tervezett állás"] = "rgb(50,100,200)";
        colors["Fonatoló hiba"] = "rgb(150,150,150)";
        colors["Operátor hiba"] = "rgb(200,50,200)";
        for (var i = 0; i < vm.group.length; i++) {
          gr.push({ name: vm.group[i].code, y: vm.group[i].amount, drilldown: vm.group[i].code, color: colors[vm.group[i].code] });
          chartdrill.push({ name: vm.group[i].code, id: vm.group[i].code, data: [] });
        }
        for (var i = 0; i < chartdrill.length; i++) {
          for (var j = 0; j < namefilter.length; j++) {
            var t = [];
            var szam = 0;
            for (var k = 0; k < vm.data.length; k++) {
              if (vm.data[k].reas_Name == namefilter[j].reas_Name && vm.data[k].Reason_group_Name == chartdrill[i].name) {
                szam += vm.data[k].Duration_s_ * 1;
              }
            }
            t = [namefilter[j].reas_Name, szam];
            chartdrill[i].data.push(t);
          }
        }

        setChartpie(gr, chartdrill);
        console.log(goodtime);
        console.log(vm.data);
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
        title: { text: "Hiba eloszlás" },
        plotOptions: {
          pie: {
            center: ['50%', '50%'],
            showInLegend: false,
            dataLabels: {
              formatter: function(){
                if(this.percentage > 0){
                  return '<b>' + this.point.name + ': ' + this.percentage.toFixed(2) + ' %</b>';
                }
              }
            }
          }
        },
        series: [
          {
            name: "adatok",
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
      load();
    }
  }
  Controller.$inject = ['downtimeService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
