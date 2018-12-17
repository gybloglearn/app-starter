define([], function () {
  'use strict';
  function Controller(downtimepottingService,$cookies, $state, $rootScope,$filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.mch = "";
    vm.cat = "";
    vm.filterload = filterload;

    function load() {
      vm.dbdata = [];
      downtimepottingService.get().then(function (response) {
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
      vm.guidata = $filter('filter')(vm.guidata, { pottingid: vm.mch });
      vm.guidata = $filter('filter')(vm.guidata, { category: vm.cat });
      createchart();
    }

    function createchart() {
      vm.cats = [];
      //statik
      vm.statikcsavarozogepmh1 = [];
      vm.statikrobot = [];
      vm.statikuretanhomerseklet = [];
      vm.statikanyaghiany = [];
      vm.statikletszamhiany = [];
      vm.statikmoldhiany = [];
      vm.statikkerethiany=[];
      vm.statikegyeb = [];
      //dinamik
      vm.dinamikfrekvenciavaltohiba=[];
      vm.dinamikrobot=[];
      vm.dinamiknemporogacentrifuga=[];
      vm.dinamikkalaphiba=[];
      vm.dinamikburkolathiba=[];
      vm.dinamikmagasnyomas=[];
      vm.dinamikuretanhomerseklet=[];
      vm.dinamikkeveresiaranyhiba=[];
      vm.dinamikanyaghianystatikrol = [];
      vm.dinamikletszamhiany = [];
      vm.dinamikplchiba=[];
      vm.dinamikegyeb = [];

      var catnum1 = new Date(vm.startdate).getTime();
      var catnum2 = new Date(vm.enddate).getTime();

      while (catnum1 <= catnum2) {
        vm.cats.push($filter('date')(catnum1, 'yyyy-MM-dd'));
        catnum1 += 24 * 3600 * 1000;
      }

      for (var i = 0; i < vm.cats.length; i++) {
        //statik
        vm.statikcsavarozogepmh1.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Csavarozó gép MH1', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikrobot.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Robot', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikuretanhomerseklet.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Uretánhőmérséklet', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikanyaghiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Anyaghiány', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikletszamhiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Létszámhiány', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikmoldhiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Mold hiány', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikkerethiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Kerethiány', day: vm.cats[i] }), 'time')) * 1 });
        vm.statikegyeb.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Statik', category: 'Egyéb', day: vm.cats[i] }), 'time')) * 1 });
        //dinamik
        vm.dinamikfrekvenciavaltohiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Frekvencia váltó hiba', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikrobot.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Robot', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamiknemporogacentrifuga.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Nem pörög a centrifuga', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikkalaphiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Kalap hiba', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikburkolathiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Burkolat hiba', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikmagasnyomas.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Magas nyomás', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikuretanhomerseklet.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Uretánhőmérséklet', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikkeveresiaranyhiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Keverési arány hiba', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikanyaghianystatikrol.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Anyaghiány Statikról', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikletszamhiany.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Létszámhiány', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikplchiba.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'PLC hiba', day: vm.cats[i] }), 'time')) * 1 })
        vm.dinamikegyeb.push({ cat: vm.cats[i], y: ($filter('sumField')($filter('filter')(vm.guidata, { pottingid: 'Dinamik', category: 'Egyéb', day: vm.cats[i] }), 'time')) * 1 })
      }
      console.log(vm.statikrobot);

      vm.chartconfig_statik = {
        chart: { type: 'column' },
        title: { text: 'Állásidők-statik' },
        plotOptions: {
          column: {
            stacking: 'normal',
          }
        },
        xAxis: { type: 'category', categories: vm.cats },
        yAxis: 
          { title: { text: 'Perc' } },
        series: [
          { name: 'Csavarozó gép MH1', data: vm.statikcsavarozogepmh1, stack: 'Statik' },
          { name: 'Robot', data: vm.statikrobot, stack: 'Statik' },
          { name: 'Uretánhőmérséklet', data: vm.statikuretanhomerseklet, stack: 'Statik' },
          { name: 'Anyaghiány', data: vm.statikanyaghiany, stack: 'Statik' },
          { name: 'Létszámhiány', data: vm.statikletszamhiany, stack: 'Statik' },
          { name: 'Mold hiány', data: vm.statikmoldhiany, stack: 'Statik' },
          { name: 'Kerethiány', data: vm.statikkerethiany, stack: 'Statik' },
          { name: 'Egyéb', data: vm.statikegyeb, stack: 'Statik' },
        ],
      };
      vm.chartconfig_dinamik = {
        chart: { type: 'column' },
        title: { text: 'Állásidők-dinamik' },
        plotOptions: {
          column: {
            stacking: 'normal',
          }
        },
        xAxis: { type: 'category', categories: vm.cats },
        yAxis: 
          { title: { text: 'Perc' } },
        series: [
          { name: 'Frekvencia váltó hiba', data: vm.dinamikfrekvenciavaltohiba, stack: 'Dinamik' },
          { name: 'Robot', data: vm.dinamikrobot, stack: 'Dinamik' },
          { name: 'Nem pörög a centrifuga', data: vm.dinamiknemporogacentrifuga, stack: 'Dinamik' },
          { name: 'Kalap hiba', data: vm.dinamikkalaphiba, stack: 'Dinamik' },
          { name: 'Burkolat hiba', data: vm.dinamikburkolathiba, stack: 'Dinamik' },
          { name: 'Magas nyomás', data: vm.dinamikmagasnyomas, stack: 'Dinamik' },
          { name: 'Uretánhőmérséklet', data: vm.dinamikuretanhomerseklet, stack: 'Dinamik' },
          { name: 'Keverési arány hiba', data: vm.dinamikkeveresiaranyhiba, stack: 'Dinamik' },
          { name: 'Anyaghiány Statikról', data: vm.dinamikanyaghianystatikrol, stack: 'Dinamik' },
          { name: 'Létszámhiány', data: vm.dinamikletszamhiany, stack: 'Dinamik' },
          { name: 'PLC hiba', data: vm.dinamikplchiba, stack: 'Dinamik' },
          { name: 'Egyéb', data: vm.dinamikegyeb, stack: 'Dinamik' },
        ],
      };
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }

   vm.pottings = ["Statik", "Dinamik"];
    vm.categories = [
      { id: "Statik", cat: "Csavarozó gép MH1" },
      { id: "Statik", cat: "Robot" },
      { id: "Statik", cat: "Uretánhőmérséklet" },
      { id: "Statik", cat: "Anyaghiány" },
      { id: "Statik", cat: "Létszámhiány" },
      { id: "Statik", cat: "Mold hiány" },
      { id: "Statik", cat: "Kerethiány" },
      { id: "Statik", cat: "Egyéb" },
      { id: "Dinamik", cat: "Frekvencia váltó hiba" },
      { id: "Dinamik", cat: "Robot" },
      { id: "Dinamik", cat: "Nem pörög a centrifuga" },
      { id: "Dinamik", cat: "Kalap hiba" },
      { id: "Dinamik", cat: "Burkolat hiba" },
      { id: "Dinamik", cat: "Magas nyomás" },
      { id: "Dinamik", cat: "Uretánhőmérséklet" },
      { id: "Dinamik", cat: "Keverési arány hiba" },
      { id: "Dinamik", cat: "Anyaghiány Statikról" },
      { id: "Dinamik", cat: "Létszámhiány" },
      { id: "Dinamik", cat: "PLC hiba" },
      { id: "Dinamik", cat: "Egyéb" }
    ];
  }
  Controller.$inject = ['downtimepottingService','$cookies', '$state', '$rootScope','$filter'];
  return Controller;
});
