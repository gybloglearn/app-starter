define([], function () {
  'use strict';
  function Controller(downtimeimpregnalService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.categories = ["Glicerinsűrűség", "Kádszint", "Segédeszköz hiány", "Szivattyú", "Glicerin hiány", "Anyaghiány", "Létszámhiány", "Áramlási hiba", "Egyéb"];
    vm.cat = "";
    vm.filterload = filterload;

    function load() {
      vm.dbdata = [];
      downtimeimpregnalService.get().then(function (response) {
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

      vm.glicerinsuruseg = [];
      vm.kadszint = [];
      vm.segedeszkozhiany = [];
      vm.szivattyu = [];
      vm.glicerinhiany = [];
      vm.anyaghiany = [];
      vm.letszamhiany = [];
      vm.aramlashiba = [];
      vm.egyeb = [];

      var catnum1 = new Date(vm.startdate).getTime();
      var catnum2 = new Date(vm.enddate).getTime();

      while (catnum1 <= catnum2) {
        vm.cats.push($filter('date')(catnum1, 'yyyy-MM-dd'));
        catnum1 += 24 * 3600 * 1000;
      }

      for (var i = 0; i < vm.cats.length; i++) {
        vm.glicerinsuruseg.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Glicerinsűrűség', day: vm.cats[i] }), 'time')) * 1 });
        vm.kadszint.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Kádszint', day: vm.cats[i] }), 'time')) * 1 });
        vm.segedeszkozhiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Segédeszköz hiány', day: vm.cats[i] }), 'time')) * 1 });
        vm.szivattyu.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Szivattyú', day: vm.cats[i] }), 'time')) * 1 });
        vm.glicerinhiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Glicerin hiány', day: vm.cats[i] }), 'time')) * 1 });
        vm.anyaghiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Anyaghiány', day: vm.cats[i] }), 'time')) * 1 });
        vm.letszamhiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Létszámhiány', day: vm.cats[i] }), 'time')) * 1 });
        vm.aramlashiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Áramláshiba', day: vm.cats[i] }), 'time')) * 1 });
        vm.egyeb.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { category: 'Egyéb', day: vm.cats[i] }), 'time')) * 1 });
      }

      vm.chartconfig = {
        chart: { type: 'column' },
        title: { text: 'Állásidők-impregnálás' },
        plotOptions: {
          column: {
            stacking: 'normal',
          }
        },
        xAxis: { type: 'category', categories: vm.cats },
        yAxis:
          { title: { text: 'Perc' } },
        series: [
          { name: 'Glicerinsűrűség', data: vm.glicerinsuruseg, stack: 'imp' },
          { name: 'Kádszint', data: vm.kadszint, stack: 'imp' },
          { name: 'Segédeszköz hiány', data: vm.segedeszkozhiany, stack: 'imp' },
          { name: 'Szivattyú', data: vm.szivattyu, stack: 'imp' },
          { name: 'Glicerin hiány', data: vm.glicerinhiany, stack: 'imp' },
          { name: 'Anyaghiány', data: vm.anyaghiany, stack: 'imp' },
          { name: 'Létszámhiány', data: vm.letszamhiany, stack: 'imp' },
          { name: 'Áramláshiba', data: vm.aramlashiba, stack: 'imp' },
          { name: 'Egyéb', data: vm.egyeb, stack: 'imp' },
        ],
      };
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['downtimeimpregnalService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
