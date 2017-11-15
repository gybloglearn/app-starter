define([], function () {
  'use strict';
  function Controller(ppdataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.n = new Date().getTime() - 5 * 60 * 60 * 24 * 1000;
    vm.tabledata = [];
    activate();
    vm.getData = getData;
    vm.exportToCSV = exportToCSV;

    function getData() {
      var i = ppdataService.get($filter('date')(new Date(vm.fr), 'MMdd'));
      i.then(function (resp) {
        var szak = [], nap2 = [], nap2s = [], het1s = [];
        var drill = [];
        angular.forEach(resp.data, function (v, k) {

          drill.push({ id: "szak_" + v.date, name: "Előző szakos (" + v.date + ")", data: [], colorByPoint: true });
          var uni = $filter('unique')(v.data[0].adatok.szak, 'Állapot');
          angular.forEach(uni, function (x) {
            $filter('filter')(drill, { "id": "szak_" + v.date })[0].data.push([x["Állapot"], $filter('filter')(v.data[0].adatok.szak, { "Állapot": x["Állapot"] }).length]);
          });

          drill.push({ id: "nap2_" + v.date, name: "Előző 2 napi (" + v.date + ")", data: [], colorByPoint: true });
          uni = $filter('unique')(v.data[0].adatok.nap2, 'Állapot');
          angular.forEach(uni, function (x) {
            $filter('filter')(drill, { "id": "nap2_" + v.date })[0].data.push([x["Állapot"], $filter('filter')(v.data[0].adatok.nap2, { "Állapot": x["Állapot"] }).length]);
          });

          drill.push({ id: "nap2s_" + v.date, name: "2 napnál régebbi (" + v.date + ")", data: [], colorByPoint: true });
          uni = $filter('unique')(v.data[0].adatok.nap2s, 'Állapot');
          angular.forEach(uni, function (x) {
            $filter('filter')(drill, { "id": "nap2s_" + v.date })[0].data.push([x["Állapot"], $filter('filter')(v.data[0].adatok.nap2s, { "Állapot": x["Állapot"] }).length]);
          });

          drill.push({ id: "het1s_" + v.date, name: "1 hétnél régebbi (" + v.date + ")", data: [], colorByPoint: true });
          uni = $filter('unique')(v.data[0].adatok.het1s, 'Állapot');
          angular.forEach(uni, function (x) {
            $filter('filter')(drill, { "id": "het1s_" + v.date })[0].data.push([x["Állapot"], $filter('filter')(v.data[0].adatok.het1s, { "Állapot": x["Állapot"] }).length]);
          });

          var szk = "";
          if (angular.isUndefined(v.data[0].adatok.szak[0]) == false) {
            szk = v.data[0].adatok.szak[0]["Szak"];
          }
          szak.push({ name: v.date + "-ig - " + szk, y: v.data[0].szak, drilldown: "szak_" + v.date });
          nap2.push({ name: v.date + "-ig - " + szk, y: v.data[0].nap2, drilldown: "nap2_" + v.date });
          nap2s.push({ name: v.date + "-ig - " + szk, y: v.data[0].nap2s, drilldown: "nap2s_" + v.date });
          het1s.push({ name: v.date + "-ig - " + szk, y: v.data[0].het1s, drilldown: "het1s_" + v.date });
          if (k == resp.data.length - 1) {
            vm.tabledata = v;
          }
        });
        vm.chartconf = {
          chart: { type: 'column', spacingBottom: 30 },
          plotOptions: { column: { stacking: 'normal', pointPadding: 0, borderWidth: 0 } },
          tooltip: { shared: true },
          title: { text: 'Parkoló pálya' },
          xAxis: { type: 'category', labels: { rotation: -90, useHTML: true, y: 15, formatter: function () { return '<span style="font-size:1em">' + this.value + '<span>' } } },
          series: [
            { name: "Szakos elvégzett", color: "#46ad00", data: szak },
            { name: "2napja elvégzett", color: "#ff9821", data: nap2 },
            { name: "2 napnál régebb", color: "#de2533", data: nap2s },
            { name: "1 hétnél régebb", color: "#333333", data: het1s }
          ],
          drilldown: { series: drill, "cursor": "pointer", "color": "#003399", "fontWeight": "bold", "textDecoration": "none" }
        }
      });
    }

    function exportToCSV() {
      console.log(vm.tabledata.data[0].adatok.szak);
      var content = "";
      //content += ";;;Szakos;;;\r\n";
      content += "Cikkszám,Megjegyzés,Modulszám,Pozíció,Szak,Állapot,Rögzítés dátuma\r\n";
      for (var a = 0; a < vm.tabledata.data[0].adatok.szak.length; a++) {
        content += vm.tabledata.data[0].adatok.szak[a].Cikkszám + "," + vm.tabledata.data[0].adatok.szak[a].Megjegyzés + "," + vm.tabledata.data[0].adatok.szak[a].Modulszám + "," + vm.tabledata.data[0].adatok.szak[a].Pozíció + "," + vm.tabledata.data[0].adatok.szak[a].Szak + "," + vm.tabledata.data[0].adatok.szak[a].Állapot + "," + vm.tabledata.data[0].adatok.szak[a].Állapot_rögzítés_dátuma + ";\r\n";
      }
      for (var b = 0; b < vm.tabledata.data[0].adatok.nap2.length; b++) {
        content += vm.tabledata.data[0].adatok.nap2[b].Cikkszám + "," + vm.tabledata.data[0].adatok.nap2[b].Megjegyzés + "," + vm.tabledata.data[0].adatok.nap2[b].Modulszám + "," + vm.tabledata.data[0].adatok.nap2[b].Pozíció + "," + vm.tabledata.data[0].adatok.nap2[b].Szak + "," + vm.tabledata.data[0].adatok.nap2[b].Állapot + "," + vm.tabledata.data[0].adatok.nap2[b].Állapot_rögzítés_dátuma + ";\r\n";
      }
      for (var c = 0; c < vm.tabledata.data[0].adatok.nap2s.length; c++) {
        content += vm.tabledata.data[0].adatok.nap2s[c].Cikkszám + "," + vm.tabledata.data[0].adatok.nap2s[c].Megjegyzés + "," + vm.tabledata.data[0].adatok.nap2s[c].Modulszám + "," + vm.tabledata.data[0].adatok.nap2s[c].Pozíció + "," + vm.tabledata.data[0].adatok.nap2s[c].Szak + "," + vm.tabledata.data[0].adatok.nap2s[c].Állapot + "," + vm.tabledata.data[0].adatok.nap2s[c].Állapot_rögzítés_dátuma + ";\r\n";
      }
      for (var d = 0; d < vm.tabledata.data[0].adatok.het1s.length; d++) {
        content += vm.tabledata.data[0].adatok.het1s[d].Cikkszám + "," + vm.tabledata.data[0].adatok.het1s[d].Megjegyzés + "," + vm.tabledata.data[0].adatok.het1s[d].Modulszám + "," + vm.tabledata.data[0].adatok.het1s[d].Pozíció + "," + vm.tabledata.data[0].adatok.het1s[d].Szak + "," + vm.tabledata.data[0].adatok.het1s[d].Állapot + "," + vm.tabledata.data[0].adatok.het1s[d].Állapot_rögzítés_dátuma + ";\r\n";
      }

      /*for( var x = 0; x < vm.tabledata.data[0].length; x++){
        content += vm.tabledata.data[0].adatok.szak[x].substr(0,1) + vm.tabledata.data[0].adatok.szak[x].substr(vm.tabledata.data[0].adatok.szak[x].indexOf(' '),2) + ",";
      }
      content += "\r\n";
      /*for (var o = 0; o < vm.ops.length; o++) {
        content += vm.ops[o].sso + "," + vm.ops[o].shift + ",";
        for (var i = 0; i < vm.tabledata.data[0].length; i++) {
          content += $filter('filter')(vm.datas, {mch: "Potting3", pha: vm.tabledata.data[0][i], operator: vm.ops[o].sso}).length + ",";
        }
        for (var j = 0; j < vm.tabledata.data[0].length; j++) {
          content += $filter('filter')(vm.datas, {mch: "Potting4", pha: vm.tabledata.data[0][j], operator: vm.ops[o].sso}).length + ",";
        }
        content += "\r\n";
      }*/
      var hiddenElement = document.createElement('a');
      hiddenElement.href = 'data:attachment/csv;charset=iso-8859-1,' + encodeURI(content);
      hiddenElement.target = '_blank';
      hiddenElement.download = 'data_' + vm.n + '.csv';
      hiddenElement.click();
    }

    function activate() {
      vm.fr = $filter('date')(vm.n, 'yyyy-MM-dd');
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      getData();
      vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    }
  }
  Controller.$inject = ['ppdataService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
