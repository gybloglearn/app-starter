define([], function () {
  'use strict';
  function Controller(weeklyService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.today = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.beforesix = $filter('date')(new Date().getTime() - 6 * 24 * 3600 * 1000, 'yyyy-MM-dd');
    var sheets = ["SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.sheets = sheets;
    vm.data = [];
    vm.setChart=setChart;

    function load() {
      vm.data = [];

      angular.forEach(sheets, function (v, k) {
        weeklyService.get(vm.beforesix, vm.today, v).then(function (response) {
          vm.data = vm.data.concat(response.data);
        });
      });
    }

    function setChart(dt){
      vm.Chartconfig = {
            chart: {
              type: 'column',
            },
            plotOptions: {
              column: {
                stacking: 'normal'
              }
            },
            tooltip: {
              valueDecimals: 2
            },
            title: { text: "SM chart" },
            series: [
              {
                name: 'Műszaki technikai okok',
                color: "#ff0000",
                data: feltolt_Muszaki(dt),
                stack: 'Összes'
              },
              {
                name: 'Szervezési veszteség',
                color: "#ff0066",
                data: feltolt_Szervezesi(dt),
                stack: 'Összes'
              },
              {
                name: 'Tervezett veszteség',
                color: "#660066",
                data: feltolt_Tervezett(dt),
                stack: 'Összes'
              },
              {
                name: 'Jó',
                color: "#00ff00",
                data: feltolt_Jo(dt),
                stack: 'Összes'
              },
            ],
            xAxis: [
              {
                title: { text: "Hibák" },
                //type: "category"
              },
            ],
            yAxis: {
              title: {
                text: "Százalék"
              },
              tickInterval: 20,
              max: 100
            },
          }
    }

    function feltolt_Muszaki(tomb) {
      var hiba = 0;
      var hb=[];

      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].Ev_Group == "Muszaki technikai okok") {
          hiba += (tomb[i].Event_time)/60;
        }
      }
      hb[0]=(hiba / (10080 * 7)) * 100;
      return hb;
    }

    function feltolt_Szervezesi(tomb) {
      var hiba = 0;
      var hb=[];

      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].Ev_Group == "Szervezesi veszteseg") {
          hiba += (tomb[i].Event_time)/60;
        }
      }
      hb[0]=(hiba / (10080 * 7)) * 100;
      return hb;
    }

    function feltolt_Tervezett(tomb) {
      var hiba = 0;
      var hb=[];

      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].Ev_Group == "Tervezett veszteseg") {
          hiba += (tomb[i].Event_time)/60;
        }
      }
      hb[0]=(hiba / (10080 * 7)) * 100;
      return hb;
    }

    function feltolt_Jo(tomb) {
      var hiba = 0;
      var jo=10080 * 7;
      var hb=[];

      for (var i = 0; i < tomb.length; i++) {
        {
          hiba += (tomb[i].Event_time)/60;
        }
      }
      hb[0]=((jo-hiba) / jo) * 100;
      return hb;
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['weeklyService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
