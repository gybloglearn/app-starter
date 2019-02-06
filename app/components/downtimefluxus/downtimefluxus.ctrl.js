define([], function () {
  'use strict';
  function Controller(downtimefluxusService,$cookies, $state, $rootScope,$filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.categories = ["Anyaghiány", "Létszámhiány", "Szivattyú", "Szűrő", "Áramláshiba", "Hőmérséklet", "Egyéb"];
    vm.cat = "";
    vm.filterload = filterload;

    function load() {
      vm.dbdata = [];
      downtimefluxusService.get().then(function (response) {
        vm.dbdata = response.data;
        for (var i = 0; i < vm.dbdata.length; i++) {
          var num = (new Date(vm.dbdata[i].start_date).getHours() * 60) + (new Date(vm.dbdata[i].start_date).getMinutes());
          if (num > 350) {
            vm.dbdata[i].day = $filter('date')(new Date(vm.dbdata[i].start_date).getTime(), 'yyyy-MM-dd');
          }
          else {
            vm.dbdata[i].day = $filter('date')(new Date(vm.dbdata[i].start_date).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
        }
        filterload();
      });
    }


    function filterload() {
      vm.guidata = [];
      var dnum1 = new Date(vm.startdate).getTime();
      var dnum2 = new Date(vm.enddate).getTime();
      for (var i = 0; i < vm.dbdata.length; i++) {
        var dnum3 = new Date(vm.dbdata[i].day).getTime();
        if (dnum3 >= dnum1 && dnum3 <= dnum2) {
          vm.guidata.push(vm.dbdata[i]);
        }
      }
      vm.guidata = $filter('filter')(vm.guidata, { category: vm.cat });
      createchart();
    }

    function createchart() {
      vm.cats = [];

      vm.anyaghiany = [];
      vm.letszamhiany = [];
      vm.szivattyu=[];
      vm.szuro=[];
      vm.aramlashiba = [];
      vm.homerseklet = [];
      vm.egyeb = [];

      var catnum1 = new Date(vm.startdate).getTime();
      var catnum2 = new Date(vm.enddate).getTime();

      while (catnum1 <= catnum2) {
        vm.cats.push($filter('date')(catnum1, 'yyyy-MM-dd'));
        catnum1 += 24 * 3600 * 1000;
      }

      for (var i = 0; i < vm.cats.length; i++) {
        vm.anyaghiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Anyaghiány', day: vm.cats[i] }), 'time')) * 1 });
        vm.letszamhiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Létszámhiány', day: vm.cats[i] }), 'time')) * 1 });
        vm.szivattyu.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Szivattyú', day: vm.cats[i] }), 'time')) * 1 });
        vm.szuro.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Szűrő', day: vm.cats[i] }), 'time')) * 1 }); 
        vm.aramlashiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Áramláshiba', day: vm.cats[i] }), 'time')) * 1 });
        vm.homerseklet.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Hőmérséklet', day: vm.cats[i] }), 'time')) * 1 });
        vm.egyeb.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Egyéb', day: vm.cats[i] }), 'time')) * 1 });
      }

      vm.chartconfig = {
        chart: { type: 'column' },
        title: { text: 'Állásidők-fluxus' },
        plotOptions: {
          column: {
            stacking: 'normal',
          }
        },
        xAxis: { type: 'category', categories: vm.cats },
        yAxis:
          { title: { text: 'Perc' } },
        series: [
          { name: 'Anyaghiány', data: vm.anyaghiany, stack: 'flux' },
          { name: 'Létszámhiány', data: vm.letszamhiany, stack: 'flux' },
          { name: 'PH beállítás', data: vm.phbeallitas, stack: 'flux' },
          { name: 'Szivattyú', data: vm.szivattyu, stack: 'flux' },
          { name: 'Szűrő', data: vm.szuro, stack: 'flux' },
          { name: 'Áramláshiba', data: vm.aramlashiba, stack: 'flux' },
          { name: 'Hőmérséklet', data: vm.homerseklet, stack: 'flux' },
          { name: 'Egyéb', data: vm.egyeb, stack: 'flux' },
        ],
      };
    }

    activate();

    function activate() {
      (!$cookies.getObject('user')?$state.go('login'):$rootScope.user=$cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['downtimefluxusService','$cookies', '$state', '$rootScope','$filter'];
  return Controller;
});
