define([], function () {
  'use strict';
  function Controller(downtimechlorService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.categories = ["Anyaghiány Pottingról", "Létszámhiány", "PH beállítás", "Áramláshiba", "Szivárgás", "Hőmérséklet", "Beadagolás hiba", "Sósav tartály levegőre fut", "Segédeszköz hiány", "Egyéb"];
    vm.cat = "";
    vm.filterload = filterload;
    vm.remove=remove;

    function load() {
      vm.dbdata = [];
      downtimechlorService.get().then(function (response) {
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

      vm.anyaghianypottingrol = [];
      vm.letszamhiany = [];
      vm.phbeallitas = [];
      vm.aramlashiba = [];
      vm.szivargas = [];
      vm.homerseklet = [];
      vm.beadagolashiba = [];
      vm.sosavtartalylevegorefut = [];
      vm.segedeszkozhiany = [];
      vm.egyeb = [];

      var catnum1 = new Date(vm.startdate).getTime();
      var catnum2 = new Date(vm.enddate).getTime();

      while (catnum1 <= catnum2) {
        vm.cats.push($filter('date')(catnum1, 'yyyy-MM-dd'));
        catnum1 += 24 * 3600 * 1000;
      }

      for (var i = 0; i < vm.cats.length; i++) {
        vm.anyaghianypottingrol.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Anyaghiány Pottingról', day: vm.cats[i] }), 'time')) * 1 });
        vm.letszamhiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Létszámhiány', day: vm.cats[i] }), 'time')) * 1 });
        vm.phbeallitas.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'PH beállítás', day: vm.cats[i] }), 'time')) * 1 });
        vm.aramlashiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Áramláshiba', day: vm.cats[i] }), 'time')) * 1 });
        vm.szivargas.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Szivárgás', day: vm.cats[i] }), 'time')) * 1 });
        vm.homerseklet.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Hőmérséklet', day: vm.cats[i] }), 'time')) * 1 });
        vm.beadagolashiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Beadagolás hiba', day: vm.cats[i] }), 'time')) * 1 });
        vm.sosavtartalylevegorefut.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Sósav tartály levegőre fut', day: vm.cats[i] }), 'time')) * 1 });
        vm.segedeszkozhiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Segédeszköz hiány', day: vm.cats[i] }), 'time')) * 1 });
        vm.egyeb.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Egyéb', day: vm.cats[i] }), 'time')) * 1 });
      }

      vm.chartconfig = {
        chart: { type: 'column' },
        title: { text: 'Állásidők-klórozó' },
        plotOptions: {
          column: {
            stacking: 'normal',
          }
        },
        xAxis: { type: 'category', categories: vm.cats },
        yAxis:
          { title: { text: 'Perc' } },
        series: [
          { name: 'Anyaghiány Pottingról', data: vm.anyaghianypottingrol, stack: 'cl' },
          { name: 'Létszámhiány', data: vm.letszamhiany, stack: 'cl' },
          { name: 'PH beállítás', data: vm.phbeallitas, stack: 'cl' },
          { name: 'Áramláshiba', data: vm.aramlashiba, stack: 'cl' },
          { name: 'Szivárgás', data: vm.szivargas, stack: 'cl' },
          { name: 'Hőmérséklet', data: vm.homerseklet, stack: 'cl' },
          { name: 'Beadagolás hiba', data: vm.beadagolashiba, stack: 'cl' },
          { name: 'Sósav tartály levegőre fut', data: vm.sosavtartalylevegorefut, stack: 'cl' },
          { name: 'Segédeszköz hiány', data: vm.segedeszkozhiany, stack: 'cl' },
          { name: 'Egyéb', data: vm.egyeb, stack: 'cl' },
        ],
      };
    }

    function remove(id, index){
      downtimechlorService.erase(id).then(function (resp) {
        vm.guidata.splice(index, 1);
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['downtimechlorService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
