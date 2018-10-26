define([], function () {
  'use strict';
  function Controller(pdtService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (7 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.load=load;
    vm.loading=false;

    function load() {
      vm.loading=true;
      vm.alldata = [];
      pdtService.get(vm.startdate, vm.enddate).then(function (response) {
        vm.alldata = response.data;
        select();
      });
    }

    function select() {
      var select = [];
      vm.data = [];

      select = $filter('unique')(vm.alldata, 'jobid');
      for (var i = 0; i < select.length; i++) {
        var obj = {
          modul: select[i].jobid,
          pdt: parseInt($filter('filter')(vm.alldata, { jobid: select[i].jobid, propertyname: "PDT, 13 psi, 2 min" }).length),
          fluxus: parseInt($filter('filter')(vm.alldata, { jobid: select[i].jobid, propertyname: "Permeability 30gfd" }).length)
        };

        vm.data.push(obj);
      }
      create_chart();
    }

    function create_chart() {

      var interpdt = $filter('unique')(vm.data, 'pdt');
      var interfluxus = $filter('unique')(vm.data, 'fluxus');
      var pdt_cats = [];
      var fluxus_cats = [];

      for (var a = 0; a < interpdt.length; a++) {
        pdt_cats.push(interpdt[a].pdt);
      }
      for (var a = 0; a < interfluxus.length; a++) {
        fluxus_cats.push(interfluxus[a].fluxus);
      }

      pdt_cats = $filter('orderBy')(pdt_cats);
      fluxus_cats = $filter('orderBy')(fluxus_cats);

      var pdtpie = [];
      var fluxuspie = [];

      for (var i = 0; i < pdt_cats.length; i++) {
        var obj = {
          name: pdt_cats[i],
          y: parseInt($filter('filter')(vm.data, { pdt: pdt_cats[i] }).length)
        }
        pdtpie.push(obj);
      }

      for (var i = 0; i < fluxus_cats.length; i++) {
        var obj = {
          name: fluxus_cats[i],
          y: parseInt($filter('filter')(vm.data, { pdt: fluxus_cats[i] }).length)
        }
        fluxuspie.push(obj);
      }

      vm.chartconfig_pdt = {
        chart: {
          type: 'pie',
          width: 500,
          height: 400
        },
        title: { text: "PDT eloszlás" },
        plotOptions: {
          pie: {
            center: ['50%', '50%'],
            showInLegend: true
          }
        },
        series: [{
          data: pdtpie
        }]
      }

      vm.chartconfig_fluxus = {
        chart: {
          type: 'pie',
          width: 500,
          height: 400
        },
        title: { text: "Fluxus eloszlás" },
        plotOptions: {
          pie: {
            center: ['50%', '50%'],
            showInLegend: true
          }
        },
        series: [{
          data: fluxuspie
        }]
      }
      vm.loading=false;
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['pdtService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
