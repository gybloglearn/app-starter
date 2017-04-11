define([], function () {
  'use strict';
  function Controller(statService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.showsumstat = true;
    vm.show2table = true;
    vm.stat_data = [];
    vm.sumstat = [];
    vm.startdatum = $filter('date')(new Date().getTime() - (48 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddatum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.load = load;
    vm.startdatumszam = vm.startdatum;
    vm.enddatumszam = vm.enddatum;
    vm.beallit = beallit;
    vm.drawchart = drawchart;
    var tomb = [];
    var kodok = [];
    var ok = [];


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
      tomb = [];

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
              if (vm.sumstat[j].min > actszam) {
                vm.sumstat[j].min = actszam;
              }
              else if (vm.sumstat[j].max < actszam) {
                vm.sumstat[j].max = actszam;
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
            vm.sumstat[a].min = actszam;
            vm.sumstat[a].max = actszam;
            a++
          }
        }
        vm.braidtloading = false;
        tomb = vm.stat_data;
        console.log(vm.stat_data);
      });
    }
    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }

    function drawchart() {
      var difference = (new Date(vm.enddatumszam).getTime() - new Date(vm.startdatumszam).getTime()) / (60000);
      var hibaido = 0;
      var kodok = [];
      var ok = [];
      var a = 0;
      var b = 0;

      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].MName == vm.drawitem.MName) {
          
          if (tomb[i].machine_Stat == "Aut. Dolgozik ") {
            ok[a] = {}
            ok[a].name = tomb[i].MName;
            ok[a].code = tomb[i].machine_Stat;
            ok[a].x = new Date(tomb[i].StartDate).getTime();
            ok[a].time = tomb[i].Stat_Time * 1* 60000;
            ok[a].x2 = new Date(tomb[i].EndDate).getTime();
            ok[a].y = 0.5;
            a++
          }
          else {
            hibaido = hibaido + tomb[i].Stat_Time * 1;
            kodok[b] = {}
            kodok[b].name = tomb[i].MName;
            kodok[b].code = tomb[i].machine_Stat;
            kodok[b].x = new Date(tomb[i].StartDate).getTime();
            kodok[b].time = tomb[i].Stat_Time * 1 * 60000;
            kodok[b].x2 = new Date(tomb[i].EndDate).getTime();
            kodok[b].y = 0.5;
            b++
          }
        }
      }
      setChartpie(vm.drawitem.MName, difference, hibaido);
      setChartxrange(ok,kodok);
    }

    function setChartpie(name, diff, miss) {
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
              y: miss,
              drilldown: "kiesesdrill"
            }]
          }
        ],
        drilldown: [
          {
            id: "kiesesdrill",
            name: "kiesesdrill",
            data: [
              {
                name:"Egyéb",
                color: "#ddd",
                y: 12
              },
              {
                name: "Más",
                color: "#aaa",
                y: 10
              }
            ]
          }
        ]
      };
    }

    function setChartxrange(ok,kodok) {
      vm.chartconfig_xrange = {
        chart: {
          type: 'xrange',
          width: 1100,
          height: 200,
          zoomType: 'x'
        },
        legend: {
          floating: false,
          align: 'bottom',
        },
        xAxis: { title: { text: 'Idő' }, type: 'datetime', dateTimeLabelFormats: { hour: '%d.<br>%H:%M' }, tickInterval: 3600 * 1000 },
        yAxis: { title: { enabled: false }, min: 0, max: 1, categories: ["Kiesés", "Elérhető idő"] },
        series: [
          {
            color: '#e60000',
            name: 'Kiesés',
            tooltip: {
              useHTML: true,
              headerFormat: '<b style="color:{series.color};font-weight:bold;">Kiesés:</b><br>',
              pointFormat: '<span style="color:{series.color};">{point.categ}</span><br><span style="font-size:1.2em">{point.x:%H:%M:%S} - {point.x2:%H:%M:%S}</span><br><b style="font-size:10px">{point.code}</b><br><i style="font-size:10px"></i>'
            },
            data: kodok,
            borderRadius: 0,
            pointWidth: 30,
            borderColor: '#e60000'
          },
          {
            color: '#00b300',
            name: 'Elérhető idő',
            tooltip: {
              useHTML: true,
              headerFormat: '<b style="color:{series.color};font-weight:bold;">Elérhető idő:</b><br>',
              pointFormat: '<span style="color:{series.color};">{point.categ}</span><br><span style="font-size:1.2em">{point.x:%H:%M:%S} - {point.x2:%H:%M:%S}</span><br><b style="font-size:10px">{point.code}</b><br><i style="font-size:10px"></i>'
            },
            data: ok,
            borderRadius: 0,
            pointWidth: 30,
            borderColor: '#00b300'
          }
        ]
      };
    }
  }
  Controller.$inject = ['statService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
