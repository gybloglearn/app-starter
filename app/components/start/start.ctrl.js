define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.chdata = [];
    vm.dryingdata = [];
    vm.difference = [];
    vm.szakok = [];
    vm.drynumdata = [];
    vm.phasenumbers = [0, 1, 2, 3, 4, 5, 6, 7];
    vm.hely = ['Potting be', 'Előkészítés alsó', 'Gélberakás alsó', 'Esztétika alsó', 'Forgatás', 'Gélberakás felső', 'Esztétika felső', 'Potting ki'];
    vm.datum = $filter('date')(new Date().getTime() - ((5 * 60 + 50) * 60 * 1000), 'yyyy-MM-dd');
    vm.actplan = 0;
    vm.usenumber = 0;
    vm.savedate = "";
    vm.places = [];
    vm.szakok[0] = $filter('shift')(1, vm.datum);
    vm.szakok[1] = $filter('shift')(2, vm.datum);
    vm.szakok[2] = $filter('shift')(3, vm.datum);
    vm.actszak = "";
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
    vm.frissites_ideje = $filter('date')(new Date().getTime() + 2 * 60 * 1000, 'yyyy-MM-dd HH:mm');
    vm.pottloading = false;

    function load(sz4) {
      vm.places = [];
      vm.data = [];
      vm.pottloading = true;
      angular.forEach(vm.phasenumbers, function (v, k) {
        dataService.get(vm.datum, v).then(function (response) {
          vm.data[v] = [];
          for (var i = 0; i < response.data.length; i++) {
            response.data[i].machinename = vm.hely[v];
          }
          vm.data[v] = response.data;
          vm.places.push({
            sor: v,
            place: allomas(vm.data[v]),
            db: szakdb(vm.data[v]),
            plan: plancreator4(sz4),
            timelast: last(vm.data[v]),
            id: "Pottingplace" + v,
          });
          vm.pottloading = false;
        });
      });
    }

    function loadchartdata() {
      vm.kezdo = new Date(vm.datum + " 05:50:50").getTime();
      vm.vege = vm.kezdo + 24 * 60 * 60 * 1000;
      vm.chdata = [];
      vm.cats = [];
      vm.chartData = [
        { name: 'Potting Be', color: 'rgb(250,150,100)', data: [] },
        { visible: false, showInLegend: false, name: 'Gel_PREP', color: 'rgb(100,200,50)', data: [] },
        { visible: false, showInLegend: false, name: 'Uret PREP A', color: 'rgb(30,130,180)', data: [] },
        { visible: false, showInLegend: false, name: 'Esztetika A', color: 'rgb(200,50,50)', data: [] },
        { name: 'Fordit', color: 'rgb(150,220,100)', data: [] },
        { visible: false, showInLegend: false, name: 'Uret PREP F', color: 'rgb(50,150,200)', data: [] },
        { visible: false, showInLegend: false, name: 'Esztetika F', color: 'rgb(250,100,100)', data: [] },
        { name: 'Potting Ki', color: 'rgb(250,200,150)', data: [] },
        { name: 'Cél', color: 'rgb(255,0,0)', type: 'line', data: [] }
      ];
      for (var k = 1; k < 25; k++) {
        vm.cats.push($filter('date')(vm.kezdo + k * 60 * 60 * 1000, "MMdd HH"));
        for (var i = 0; i < vm.chartData.length - 1; i++) {
          vm.chartData[i].data.push({ cat: $filter('date')(vm.kezdo + k * 60 * 60 * 1000, "MMdd HH"), y: 0, sh: 0 });
        }
      }

      var minutes = new Date().getHours() * 60 + new Date().getMinutes();

      if (minutes >= 350) {
        var datenum1 = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
        var datenum2 = $filter('date')(new Date().getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      }
      else {
        var datenum1 = $filter('date')(new Date().getTime() - (2 * 24 * 3600 * 1000), 'yyyy-MM-dd');
        var datenum2 = $filter('date')(new Date().getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      }

      dataService.getchart(datenum1, datenum2).then(function (response) {
        vm.chdata = response.data;
        for (var i = 0; i < vm.chdata.length; i++) {
          vm.chdata[i].PT_Start_DT = new Date(vm.chdata[i].PT_Start_DT).getTime();
          populate(vm.chdata[i].PT_Start_DT, 0);

          vm.chdata[i].PT_GEL_PREP_DT = new Date(vm.chdata[i].PT_GEL_PREP_DT).getTime();
          populate(vm.chdata[i].PT_GEL_PREP_DT, 1);

          vm.chdata[i].PT_URET_PREP_A_DT = new Date(vm.chdata[i].PT_URET_PREP_A_DT).getTime();
          populate(vm.chdata[i].PT_URET_PREP_A_DT, 2);

          vm.chdata[i].PT_POST_URET_A_DT = new Date(vm.chdata[i].PT_POST_URET_A_DT).getTime();
          populate(vm.chdata[i].PT_POST_URET_A_DT, 3);

          vm.chdata[i].PT_ROT_DT = new Date(vm.chdata[i].PT_ROT_DT).getTime();
          populate(vm.chdata[i].PT_ROT_DT, 4);

          vm.chdata[i].PT_URET_PREP_F_DT = new Date(vm.chdata[i].PT_URET_PREP_F_DT).getTime();
          populate(vm.chdata[i].PT_URET_PREP_F_DT, 5);

          vm.chdata[i].PT_POST_URET_F_DT = new Date(vm.chdata[i].PT_POST_URET_F_DT).getTime();
          populate(vm.chdata[i].PT_POST_URET_F_DT, 6);

          vm.chdata[i].PT_OUT = new Date(vm.chdata[i].PT_OUT).getTime();
          populate(vm.chdata[i].PT_OUT, 7);
        }
        loadarchivefile();
      });
    }


    function populate(datapoint, index) {
      if (datapoint < vm.vege && datapoint >= vm.kezdo) {
        for (var j = 0; j < vm.chartData[index].data.length; j++) {
          if (vm.chartData[index].data[j].cat == $filter('date')(datapoint, 'MMdd HH')) {
            if (new Date(vm.datum) < new Date("2017-09-01")) {
              if (parseInt($filter('date')(datapoint, 'HH')) > 5 && parseInt($filter('date')(datapoint, 'HH')) < 14) {
                vm.chartData[index].data[j].sh = 1;
              } else if (parseInt($filter('date')(datapoint, 'HH')) > 13 && parseInt($filter('date')(datapoint, 'HH')) < 22) {
                vm.chartData[index].data[j].sh = 2;
              } else {
                vm.chartData[index].data[j].sh = 3;
              }
            } else {
              if (parseInt($filter('date')(datapoint, 'HH')) > 5 && parseInt($filter('date')(datapoint, 'HH')) < 18) {
                vm.chartData[index].data[j].sh = 1;
              } else {
                vm.chartData[index].data[j].sh = 3;
              }
            }
            vm.chartData[index].data[j].y++;
          }
        }
      }
    }

    function allomas(tomb) {
      return tomb[0].machinename;
    }

    function szakdb(tomb) {
      var nowtime = new Date().getHours() * 60 + new Date().getMinutes();
      var elsohat = 0;
      var másodikhat = 0;
      var harmadikhat = 0;
      var negyedikhat = 0;

      for (var i = 0; i < tomb.length; i++) {
        var valami = new Date(tomb[i].startdate);
        var datumka = new Date(valami).getHours() * 60 + new Date(valami).getMinutes();
        if (datumka >= 350 && datumka < 710) {
          elsohat++;
        }
        else if (datumka >= 710 && datumka < 1070) {
          másodikhat++;
        }
        else if (datumka >= 1070 && datumka < 1430) {
          harmadikhat++;
        }
        else {
          negyedikhat++;
        }
      }
      if (nowtime >= 350 && nowtime < 710) {
        return elsohat / 2;
      }
      else if (nowtime >= 710 && nowtime < 1070) {
        return másodikhat / 2;
      }
      else if (nowtime >= 1070 && nowtime < 1430) {
        return harmadikhat / 2;
      }
      else {
        return negyedikhat / 2;
      }
    }

    function last(tomb) {
      var maxnumbers = [];
      vm.difference = [];
      for (var i = 0; i < tomb.length; i++) {
        maxnumbers[i] = 0;
        var actszam = new Date(tomb[i].startdate).getTime();
        if (actszam > maxnumbers[i]) {
          maxnumbers[i] = actszam;
        }
      }
      for (var i = 0; i < maxnumbers.length; i++) {
        vm.difference[i] = $filter('date')(maxnumbers[i], "yyyy-MM-dd HH:mm");
      }
      return vm.difference[vm.difference.length - 1];
    }

    function loaddrynum() {
      vm.usenumber = 0;
      vm.savedate = "";
      vm.drynumdata = [];
      dataService.getdrynum().then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].drying == "Drying3") {
            vm.drynumdata = response.data[i];
          }
        }
        if (vm.drynumdata.frame <= 24) {
          vm.usenumber = vm.drynumdata.frame;
        }
        else{
          vm.usenumber=24;
        }
        vm.savedate = vm.drynumdata.save;
        vm.todate=$filter('date')(new Date(vm.savedate).getTime()+(6*3600*1000), 'yyyy-MM-dd HH:mm');
        load(vm.usenumber);
      });

    }

    function plancreator4(szam) {
      var nowhour = new Date().getHours();
      var nowminute = new Date().getMinutes();
      var nowtime = nowhour * 60 + nowminute;
      vm.actplan = 0;

      if (nowtime >= 350 && nowtime < 710) {
        vm.actplan = Math.round((szam / 360) * (nowtime - 350));
      }
      else if (nowtime >= 710 && nowtime < 1070) {
        vm.actplan = Math.round((szam / 360) * (nowtime - 710));
      }
      else if (nowtime >= 1070 && nowtime < 1430) {
        vm.actplan = Math.round((szam / 360) * (nowtime - 1070));
      }
      else if (nowtime >= 1430 && nowtime < 1440) {
        vm.actplan = Math.round((szam / 360) * (nowtime - 1430));
      }
      else if (nowtime < 350) {
        vm.actplan = Math.round((szam / 360) * (10 + nowtime));
      }
      return vm.actplan;
    }

    function choose() {
      var szamvaltozo = new Date().getHours() * 60 + new Date().getMinutes();

      if (szamvaltozo >= 350 && szamvaltozo < 830) {
        vm.actszak = vm.szakok[0];
      }
      else if (szamvaltozo >= 830 && szamvaltozo < 1310) {
        vm.actszak = vm.szakok[1];
      }
      else {
        vm.actszak = vm.szakok[2];
      }
    }

    function loadarchivefile() {
      vm.dryarchivedata = [];
      var cycles = []

      var today = $filter('date')(new Date(), 'yyyy-MM-dd');
      var num1 = $filter('date')(new Date(vm.datum).getTime(), 'yyyyMMdd' + '05');
      var num2 = $filter('date')(new Date(vm.datum).getTime(), 'yyyyMMdd' + '11');
      var num3 = $filter('date')(new Date(vm.datum).getTime(), 'yyyyMMdd' + '17');
      var num4 = $filter('date')(new Date(vm.datum).getTime(), 'yyyyMMdd' + '23');

      if (new Date().getHours() >= 5 && new Date().getHours() < 12) {
        cycles.push(num1);
      }
      else if (new Date().getHours() >= 12 && new Date().getHours() < 18) {
        cycles.push(num1);
        cycles.push(num2);
      }
      else if (new Date().getHours() >= 18) {
        cycles.push(num1);
        cycles.push(num2);
        cycles.push(num3);
      }
      else {
        cycles.push(num1);
        cycles.push(num2);
        cycles.push(num3);
        cycles.push(num4);
      }
      var k = 0;
      for (var i = 0; i < cycles.length; i++) {
        dataService.getArchive(cycles[i]).then(function (rsp) {
          k = k + 1;
          for (var j = 0; j < rsp.data.length; j++) {
            if (rsp.data[j].machinename == "Drying3" && rsp.data[j].Time_to_Go < 6) {
              rsp.data[j].category = k;
              vm.dryarchivedata.push(rsp.data[j]);
            }
          }
          updateline(vm.dryarchivedata);
        });
      }
    }

    function updateline(arr) {
      vm.linenumbers = [];
      //console.log(arr);

      var number1 = 0;
      var number2 = 0;
      var number3 = 0;
      var number4 = 0;

      for (var i = 0; i < 24; i++) {
        vm.linenumbers[i] = 0;
      }

      for (var i = 0; i < arr.length; i++) {
        if (arr[i].category == 1) {
          number1++;
        }
        if (arr[i].category == 2) {
          number2++;
        }
        if (arr[i].category == 3) {
          number3++;
        }
        if (arr[i].category == 4) {
          number4++;
        }
      }
      if (vm.mch == "Potting4") {
        if (number1 > 24) {
          number1 = 24;
        }
        if (number2 > 24) {
          number2 = 24;
        }
        if (number3 > 24) {
          number3 = 24;
        }
        if (number4 > 24) {
          number4 = 24;
        }
      }
      for (var i = 0; i < 24; i++) {
        if (i >= 0 && i < 6) {
          vm.linenumbers[i] = Math.round(number1 / 6) * 2;
        }
        else if (i >= 6 && i < 12) {
          vm.linenumbers[i] = Math.round(number2 / 6) * 2;
        }
        else if (i >= 12 && i < 18) {
          vm.linenumbers[i] = Math.round(number3 / 6) * 2;
        }
        else {
          vm.linenumbers[i] = Math.round(number4 / 6) * 2;
        }
      }
      vm.chartData[vm.chartData.length - 1].data = vm.linenumbers;
      create_chart();
    }

    function create_chart() {
      vm.chartconfig = {
        chart: {
          type: 'column',
          height: 350
        },
        tooltip: { shared: true },
        xAxis: { type: 'category', categories: vm.cats },
        yAxis: { tickInterval: 2 },
        title: { text: 'Termelt modulok óránként' },
        series: vm.chartData
      };
    }


    activate();

    function activate() {
      //(!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      choose();
      loaddrynum();
      loadchartdata();
    }

    var refreshchoose = setInterval(choose, 2 * 60 * 1000);
    var refreshloaddrying = setInterval(loaddrynum, 2 * 60 * 1000);
    var refreshdate = setInterval(date_refresh, 2 * 60 * 1000);
    var refreshchart = setInterval(loadchartdata, 2 * 60 * 1000);

    function date_refresh() {
      vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
      vm.frissites_ideje = $filter('date')(new Date().getTime() + 2 * 60 * 1000, 'yyyy-MM-dd HH:mm');
    }
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
