define([], function () {
  'use strict';
  function Controller(wipService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.list = [];
    vm.status = [];
    vm.load = load;
    vm.filter = filter;

    function filter() {
      vm.dates = [];
      var sdt = new Date(vm.startdate).getTime();
      var edt = new Date(vm.enddate).getTime();
      var d = (edt - sdt) / (24 * 60 * 60 * 1000);
      for (var i = 0; i <= d; i++) {
        var day = $filter('date')(sdt + i * 24 * 60 * 60 * 1000, "yyyyMMdd");
        wipService.getDays(day).then(function (response) {
          for (var k = 0; k < response.data.length; k++) {
            vm.dates.push(response.data[k]);
          }
          crChart(vm.dates);
        });
      }
      console.log(vm.dates);

    }
    function crChart(ser) {
      var series = [];
      var xCats = [];
      for (var i = 0; i < ser.length; i++) {
        series.push({ cat: ser[i].file, y: ser[i].data.length });
      }
      series = $filter('orderBy')(series, 'cat');
      for (var j = 0; j < series.length; j++) {
        xCats.push(series[j].cat.substr(0,8) + " - " + series[j].cat.substr(8,2));
      }
      vm.wipchart = {
        chart: { type: "line" },
        title: { text: vm.startdate + " - " + vm.enddate + " WIP alakulása" },
        subtitle: { text: "forrás: MES" },
        xAxis: {type: "category", categories: xCats},
        series: [
          { name: "WIP szint", data: series }
        ]
      };
    }
    function load() {
      vm.data = [];
      vm.list = [];
      vm.status = [];

      wipService.get("All", "Rolling", "Report To ERP").then(function (response) {
        vm.data = response.data;
        vm.list = $filter('unique')(vm.data, 'Machine');
        vm.status = $filter('unique')(vm.data, 'Status');
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
    }
  }
  Controller.$inject = ['wipService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
