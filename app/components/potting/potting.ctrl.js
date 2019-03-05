define([], function () {
  'use strict';
  function Controller(pottingService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.date = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.datenum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.pottings = ["Statik", "Dinamik"];
    vm.categories = [
      { id: "Statik", cat: "Csavarozó gép MH1" },
      { id: "Statik", cat: "Robot" },
      { id: "Statik", cat: "Uretánhőmérséklet" },
      { id: "Statik", cat: "Anyaghiány" },
      { id: "Statik", cat: "Létszámhiány" },
      { id: "Statik", cat: "Mold hiány" },
      { id: "Statik", cat: "Kerethiány" },
      { id: "Statik", cat: "Marriage" },
      { id: "Statik", cat: "Brick vágó" },
      { id: "Statik", cat: "Szárító" },
      { id: "Statik", cat: "Bundlevágó" },
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
      { id: "Dinamik", cat: "Rezgés hiba" },
      { id: "Dinamik", cat: "Retesz hiba" },
      { id: "Dinamik", cat: "Hőmérséklet" },
      { id: "Dinamik", cat: "Egyéb" }
    ];
    vm.subcategories = [
      { main: "Robot", sub: "Megönt, de nem emel" },
      { main: "Robot", sub: "Nem önti meg" },
      { main: "Robot", sub: "Lefagy" },
      { main: "Robot", sub: "Rossz pozícióba önt" },
      { main: "Uretánhőmérséklet", sub: "magas" },
      { main: "Uretánhőmérséklet", sub: "alacsony" },
      { main: "Anyaghiány", sub: "Nedves bundle" },
      { main: "Anyaghiány", sub: "SPL anyaghiány" },
      { main: "Anyaghiány", sub: "Egyéb" },
    ];
    vm.beallit = beallit;
    vm.saveinfo = saveinfo;
    vm.goodsave = goodsave;
    vm.mutat = false;
    vm.loading = false;

    function loadpartnumbers() {
      vm.partnumbers = [];
      pottingService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
        console.log(vm.partnumbers);
      });
    }

    function beallit() {
      vm.datenum = $filter('date')(new Date(vm.date).getTime(), 'yyyy-MM-dd')
      createhours();
    }

    function createhours() {
      vm.cats = [];
      for (var i = 6; i < 24; i++) {
        vm.cats.push(i < 10 ? "0" + i : "" + i);
      }
      for (var j = 0; j < 6; j++) {
        vm.cats.push("0" + j);
      }
      loadpotting();
    }

    function loadpotting() {
      vm.loading = true;

      vm.pottingdata = [];
      vm.centridata = [];

      var sdate = $filter('date')(new Date(vm.date).getTime() - (7 * 24 * 3600 * 1000), 'yyyy-MM-dd');
      var edate = $filter('date')(new Date(vm.date).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');

      pottingService.getpotting(sdate, edate).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          for (var k = 0; k < vm.partnumbers.length; k++) {
            if (response.data[j].jobid.includes(vm.partnumbers[k].modul)) {
              response.data[j].aeq = vm.partnumbers[k].aeq;
              response.data[j].modulname = vm.partnumbers[k].name;
            }
          }
          var pottingendminutes = new Date(response.data[j].Brick_Takeout).getHours() * 60 + new Date(response.data[j].Brick_Takeout).getMinutes();
          var centrifugaminutes = new Date(response.data[j].Centrifuga_Stop).getHours() * 60 + new Date(response.data[j].Centrifuga_Stop).getMinutes();

          if (pottingendminutes < 350) {
            response.data[j].Brick_Takeout_Day = $filter('date')(new Date(response.data[j].Brick_Takeout_Day).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Brick_Takeout_Day = $filter('date')(new Date(response.data[j].Brick_Takeout_Day).getTime(), 'yyyy-MM-dd');
          }

          if (centrifugaminutes < 350) {
            response.data[j].Centrifuga_Stop_Day = $filter('date')(new Date(response.data[j].Centrifuga_Stop).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[j].Centrifuga_Stop_Day = $filter('date')(new Date(response.data[j].Centrifuga_Stop).getTime(), 'yyyy-MM-dd');
          }

          if (pottingendminutes >= 50) {
            response.data[j].Brick_Takeout_Hour = new Date(response.data[j].Brick_Takeout).getHours() + 1;
          }
          else {
            response.data[j].Brick_Takeout_Hour = new Date(response.data[j].Brick_Takeout).getHours()
          }
          if (response.data[j].Brick_Takeout_Day == vm.datenum) {
            vm.pottingdata.push(response.data[j]);
          }

          if (centrifugaminutes >= 50) {
            response.data[j].Centrifuga_Stop_Hour = new Date(response.data[j].Centrifuga_Stop).getHours() + 1;
          }
          else {
            response.data[j].Centrifuga_Stop_Hour = new Date(response.data[j].Centrifuga_Stop).getHours()
          }
          if (response.data[j].Centrifuga_Stop_Day == vm.datenum) {
            vm.centridata.push(response.data[j]);
          }
        }
        create_chart()
        vm.loading = false;
      });
    }

    function create_chart() {
      vm.chartdata =
        [
          { name: 'Potting', color: 'rgb(0,0,255)', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Potting kumulált', color: 'rgb(0,0,255)', type: 'line', yAxis: 1, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Centrifuga', color: 'rgb(102, 0, 102)', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Centrifuga kumulált', color: 'rgb(102,0,102)', type: 'line', yAxis: 1, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Cél', color: 'rgb(255,0,0)', type: 'line', yAxis: 1, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
        ];
      for (var i = 0; i < vm.pottingdata.length; i++) {
        for (var j = 0; j < vm.cats.length; j++) {
          if (vm.pottingdata[i].Brick_Takeout_Hour == parseInt(vm.cats[j])) {
            vm.chartdata[0].data[j]++;
            //vm.chartdata[0].data[j] += vm.data[i].aeq;
          }

        }
      }
      for (var i = 0; i < vm.centridata.length; i++) {
        for (var j = 0; j < vm.cats.length; j++) {
          if (vm.centridata[i].Centrifuga_Stop_Hour == parseInt(vm.cats[j])) {
            vm.chartdata[2].data[j]++;
            //vm.chartdata[1].data[j] += vm.impdata[i].aeq;
          }

        }
        for (var k = 0; k < 24; k++) {
          if (k > 0) {
            vm.chartdata[1].data[k] = vm.chartdata[1].data[k - 1] + vm.chartdata[0].data[k];
            vm.chartdata[3].data[k] = vm.chartdata[3].data[k - 1] + vm.chartdata[2].data[k];
            vm.chartdata[4].data[k] = vm.chartdata[4].data[k - 1] + 3.7;
          } else {
            vm.chartdata[1].data[k] = vm.chartdata[0].data[k];
            vm.chartdata[3].data[k] = vm.chartdata[2].data[k];
            vm.chartdata[4].data[k] = 3.7;
          }
        }
      }
      vm.chartconfig = {
        chart: {
          type: 'column',
          height: 360
        },
        plotOptions: {
          column: {
            borderWidth: 0,
            events: {
              click: function (ev) {
                /*console.log(ev.point.category);
                console.log(ev.point.options.cat + " - " + ev.point.series.name);*/
                createinfo(ev.point.category, ev.point.series.name);
              }
            }
          }
        },
        title: { text: "Potting és centrifuga adatok órai lebontása" },
        tooltip: {
          valueDecimals: 0
        },
        xAxis: { type: 'category', categories: vm.cats },
        yAxis: [{ title: { text: 'Darab' } }, { title: { text: 'Kumulált Darab' }, opposite: true }],
        series: vm.chartdata
      };
    }

    function loadinfo() {
      vm.pottinginfo = [];

      pottingService.get().then(function (resp) {
        vm.pottinginfo = resp.data;
        //console.log(vm.pottinginfo);
      });
    }

    function createinfo(categ, name) {
      if (name == "Potting" || name == "Centrifuga") {
        vm.createinfodata = {};
        vm.actplace = "";
        vm.cat = "";
        vm.descriptioninfo = "";
        vm.startinfo = vm.datenum + " " + categ + ":" + "00";
        vm.endinfo = vm.datenum + " " + categ + ":" + "00";
        /*vm.startinfo = new Date().getFullYear() + "-" + str.substring(0, 2) + "-" + str.substring(2, 7) + ":" + "00";
        vm.endinfo = new Date().getFullYear() + "-" + str.substring(0, 2) + "-" + str.substring(2, 7) + ":" + "00";*/

        loadinfo();
        vm.mutat = true;
      }
    }

    function saveinfo() {

      vm.createinfodata.id = new Date().getTime();
      vm.createinfodata.sso = $rootScope.user.username;
      vm.createinfodata.operator_name = $rootScope.user.displayname;
      vm.createinfodata.start = vm.startinfo;
      vm.createinfodata.end = vm.endinfo;
      vm.createinfodata.time = vm.timeinfo = (new Date(vm.endinfo).getTime() - new Date(vm.startinfo).getTime()) / 60000;
      vm.createinfodata.pottingid = vm.mch;
      vm.createinfodata.category = vm.cat;
      vm.createinfodata.subcategory = vm.scat;
      vm.createinfodata.description = vm.descriptioninfo;

      console.log(vm.createinfodata);
      pottingService.post(vm.createinfodata).then(function (resp) {
        vm.showmessage = true;
        vm.createinfodata = {};
      });
      //loadinfo();
      vm.mutat = false;
    }

    function goodsave() {
      alert("Mentés sikeres!");
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadpartnumbers();
      createhours();
    }
  }
  Controller.$inject = ['pottingService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
