define([], function () {
  'use strict';
  function Controller(statService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.showsumstat = true;
    vm.show2table=true;
    vm.stat_data = [];
    vm.sumstat = [];
    vm.startdatum = $filter('date')(new Date().getTime() - (48 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddatum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.load = load;
    vm.startdatumszam = vm.startdatum;
    vm.enddatumszam = vm.enddatum;
    vm.beallit = beallit;
    vm.drawchart = drawchart;
    var tomb=[];


    function beallit() {
      vm.szam1 = new Date(vm.startdatum);
      vm.szam2 = new Date(vm.enddatum);
      vm.startdatumszam = $filter('date')(vm.szam1, 'yyyy-MM-dd');
      vm.enddatumszam = $filter('date')(vm.szam2, 'yyyy-MM-dd');
    }

    function load() {
      var act = "";
      var actszam = 0;
      var talalat = 0;
      var a = 0;
      tomb=[];

      vm.dis = true;
      vm.braidtloading = true;
      vm.stat_data = [];
      vm.sumstat = [];
      statService.get(vm.startdatum, vm.enddatum).then(function (response) {
        vm.stat_data = response.data;
        vm.dis = false;
        for (var i = 0; i < vm.stat_data.length; i++) {
          act = vm.stat_data[i].machine_Stat;
          actszam = vm.stat_data[i].Stat_Time * 1;
          for (var j = 0; j < vm.sumstat.length; j++) {
            if (vm.sumstat[j].id == act) {
              vm.sumstat[j].time = vm.sumstat[j].time + actszam;
              vm.sumstat[j].piece++;
              if(vm.sumstat[j].min>actszam)
              {
                vm.sumstat[j].min=actszam;
              }
              else if(vm.sumstat[j].max<actszam)
              {
                vm.sumstat[j].max=actszam;
              }
              talalat++;
            }
          }
          if (talalat > 0) {
            talalat = 0;
            a = a;
          }
          else {
            vm.sumstat[a] = {}
            vm.sumstat[a].id = act;
            vm.sumstat[a].time = actszam;
            vm.sumstat[a].piece = 1;
            vm.sumstat[a].min=actszam;
            vm.sumstat[a].max=actszam;
            a++
          }
        }
        vm.braidtloading = false;
        tomb=vm.stat_data;
      });
    }
    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }

    function drawchart() {
      var difference = (new Date(vm.enddatumszam).getTime() - new Date(vm.startdatumszam).getTime()) / (60000);
      var hibaido=0;

      for(var i=0;i<tomb.length;i++)
      {
        if(tomb[i].MName==vm.drawitem.MName)
        {
          hibaido=hibaido+tomb[i].Stat_Time*1;
        }
      }
      setChartpie(vm.drawitem.MName,difference,hibaido);
    }

    function setChartpie(name,diff,miss) {
      vm.chartconfig_pie = {
        chart: {
          type: 'pie',
          width: 800,
          height: 400
        },
        tooltip: {
          pointFormat: '<b style="color:{point.color};font-size:1.2em;font-weight:bold">{point.percentage:.2f} %</b>'
        },
        title: { text: "Gép: " + name },
        subtitle: { text: "Összes eltelt idő: " + diff + "perc" },
        plotOptions: {
          pie: {
            center: ['50%', '50%'],
            showInLegend: true
          }
        },
        series: [
          {
            data: [{
              name: 'Elérhető idő',
              color: "#00b300",
              y: diff - miss
            },
            {
              name: 'Kiesés',
              color: "#e60000",
              y: miss
            }]
          }
        ],
      };
    }
  }
  Controller.$inject = ['statService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
