define([], function () {
  'use strict';
  function Controller($cookies, $scope, $state, $rootScope, $filter, smscrService) {
    var vm = this;
    vm.n = new Date($filter('date')(new Date(), 'yyyy-MM-dd'));
    vm.filtered = {};
    vm.loading = false;
    vm.tabledata = [];
    vm.smprod = [];
    activate();
    vm.chartconf = { chart: { type: 'column' } };
    vm.getData = getData;
    vm.redr = redr;
    function redr() {
      vm.loading = true;
      vm.chartconf = {
        chart: { type: 'column' },
        plotOptions: { column: { stacking: 'normal' } },
        tooltip: { shared: true, useHTML: true, backgroundColor: '#333', valueDecimals: 2, valueSuffix: ' %', borderWidth: 0, headerFormat: '<span style="color:#eee;display: block;font-size:1.2em;">{point.key}</span>' },
        title: { text: 'Kimutatás' },
        xAxis: { title: { text: 'Napok' }, type: 'category', categories: [] },
        yAxis: { title: { text: 'Arány' } }
      };
      var k = $filter('unique')($filter('filter')(vm.tabledata, vm.filtered), 'day');
      var series = [
        { name: "Lapparaméter", color: "rgb(250,193,145)", data: [], point: {events: { click: function(event){ vm.filtered.day = this.category; vm.filtered.category = this.series.name;vm.redr();$scope.$digest();} }} },
        { name: "Géphiba", color: "rgb(228,109,10)", data: [], point: {events: { click: function(event){ vm.filtered.day = this.category; vm.filtered.category = this.series.name;vm.redr();$scope.$digest();} }} },
        { name: "Szálhibák", color: "rgb(192,81,77)", data: [], point: {events: { click: function(event){ vm.filtered.day = this.category; vm.filtered.category = this.series.name;vm.redr();$scope.$digest();} }} },
        { name: "Egyéb hibák", color: "rgb(112,48,160)", data: [], point: {events: { click: function(event){ vm.filtered.day = this.category; vm.filtered.category = this.series.name;vm.redr();$scope.$digest();} }} },
        { name: "Robot hiba", color: "rgb(209,148,147)", data: [], point: {events: { click: function(event){ vm.filtered.day = this.category; vm.filtered.category = this.series.name;vm.redr();$scope.$digest();} }} },
        { name: "Cél", type: "line", color: "rgb(222, 37, 51)", marker: {symbol: "circle"}, data: [] },
        { name: "Napi", type: "line", color: "rgb(255, 152, 33)", marker: {symbol: "circle"}, data: [] },
        { name: "Kumulált", type: "line", color: "rgb(70, 173, 0)", marker: {symbol: "circle"}, data: [] }
      ];
      var cumtot = [];
      var cumscr = [];
      var sumtot = [];
      var sumscr = [];

      for (var x = 0; x < k.length; x++) {
        vm.chartconf.xAxis.categories.push(k[x].day);
        var tot = $filter('sumdb')($filter('filter')(vm.smprod, { 'day': k[x].day }), 'amount');
        var scr = $filter('sumdb')($filter('filter')($filter('filter')(vm.tabledata, vm.filtered), { 'day': k[x].day }), 'pc');
        cumtot.push(tot);
        cumscr.push(scr);
        cumtot.reduce(function(a,b,i){return sumtot[i] = a+b;},0);
        cumscr.reduce(function(a,b,i){return sumscr[i] = a+b;},0);
        series[0].data.push($filter('sumdb')($filter('filter')($filter('filter')(vm.tabledata, vm.filtered), { 'day': k[x].day, 'category': series[0].name }), 'pc') / tot * 100);
        series[1].data.push($filter('sumdb')($filter('filter')($filter('filter')(vm.tabledata, vm.filtered), { 'day': k[x].day, 'category': series[1].name }), 'pc') / tot * 100);
        series[2].data.push($filter('sumdb')($filter('filter')($filter('filter')(vm.tabledata, vm.filtered), { 'day': k[x].day, 'category': series[2].name }), 'pc') / tot * 100);
        series[3].data.push($filter('sumdb')($filter('filter')($filter('filter')(vm.tabledata, vm.filtered), { 'day': k[x].day, 'category': series[3].name }), 'pc') / tot * 100);
        series[4].data.push($filter('sumdb')($filter('filter')($filter('filter')(vm.tabledata, vm.filtered), { 'day': k[x].day, 'category': series[4].name }), 'pc') / tot * 100);
        series[5].data.push(0.75);
        series[6].data.push(scr / tot * 100);
        if(sumscr.length > 1)
          series[7].data.push(sumscr[sumscr.length-1] / sumtot[sumtot.length-1] *  100);
        else
          series[7].data.push(sumscr[0] / sumtot[0] *  100);
      }
      vm.chartconf.series = series;
      vm.loading = false;
    }
    function getData() {
      vm.chartconf={chart:{type:'column'}};
      vm.loading = true;
      var i = smscrService.getbtw(vm.fr, vm.dt);
      i.then(function (resp) {
        vm.tabledata = resp.data;
      });
      vm.sms = ["SheetMaker1", "SheetMaker2", "SheetMaker4", "SheetMaker5", "SheetMaker6", "SheetMaker7", "SheetMaker8", "SheetMaker9"];
      vm.smprod = [];
      for (var sz = 0; sz < vm.sms.length; sz++) {
        var d = smscrService.getprod(vm.sms[sz], vm.fr, vm.dt);
        d.then(function (resp) {
          angular.forEach(resp.data, function (v, k) {
            vm.smprod.push(v);
            if(v.sm == '9'){
              vm.loading = false;
            }
          });
        });
      }
    }

    function activate() {
      vm.dt = $filter('date')(vm.n, 'yyyy-MM-dd');
      vm.fr = $filter('date')(new Date(vm.n).getTime() - 7 * 24 * 3600 * 1000, 'yyyy-MM-dd');
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      getData();

    }
  }
  Controller.$inject = ['$cookies', '$scope', '$state', '$rootScope', '$filter', 'smscrService'];
  return Controller;
});
