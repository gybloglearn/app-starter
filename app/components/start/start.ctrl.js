define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.difference = [];
    vm.szakok = [];
    vm.smdata = [];
    vm.phasenumbers = [0, 1, 2, 3, 4, 5, 6, 7];
    vm.sheetmakers = ["SheetMaker6", "SheetMaker7", "SheetMaker8"];
    vm.hely = ['Potting be', 'Előkészítés alsó', 'Gélberakás alsó', 'Esztétika alsó', 'Forgatás', 'Gélberakás felső', 'Esztétika felső', 'Potting ki']
    vm.machine = "Potting4";
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    var szakallando4 = 27;
    vm.actplan = 0;
    vm.places = [];
    vm.szakok[0] = $filter('shift')(1, vm.datum);
    vm.szakok[1] = $filter('shift')(2, vm.datum);
    vm.szakok[2] = $filter('shift')(3, new Date().getTime() - ((5 * 60 + 50) * 60 * 1000));
    vm.actszak = "";
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
    vm.frissites_ideje = $filter('date')(new Date().getTime() + 2 * 60 * 1000, 'yyyy-MM-dd HH:mm');
    vm.pottloading = false;

    function load() {
      vm.places = [];
      vm.data = [];
      vm.pottloading = true;
      angular.forEach(vm.phasenumbers, function (v, k) {
        dataService.get(vm.datum, vm.machine, v).then(function (response) {
          vm.data[v] = [];
          for (var i = 0; i < response.data.length; i++) {
            response.data[i].machinename = vm.hely[v];
          }
          vm.data[v] = response.data;
          vm.places.push({
            sor: v,
            place: allomas(vm.data[v]),
            db: szakdb(vm.data[v]),
            plan: plancreator4(szakallando4),
            timelast: last(vm.data[v]),
            id: "Pottingplace" + v,
            chartconfig: {
              chart: {
                type: 'bar',
                height: 150
              },
              legend: { verticalAlign: "top", align: "top", floating: false },
              series: [
                {
                  name: 'Tény',
                  color: "rgba(150,230,50, .5)",
                  data: [szakdb(vm.data[v])]
                },
                {
                  name: 'Terv',
                  color: "rgba(50,150,230,.5)",
                  data: [plancreator4(szakallando4)]
                }],

              xAxis: [
                { categories: feltolt_x() },
              ],
              yAxis: {
                title: {
                  text: "Darab"
                }
              }
            }
          });
          vm.pottloading = false;
        });
      });
    }

    function loadsheetmakers() {
      var valami = 0;
      var lekerdezszaknum = 1;
      var substring = "GOOD"
      vm.smdata = [];

      var hour = new Date().getHours();
      var minute = new Date().getMinutes();
      var downdate = $filter('date')(new Date(), 'yyyy-MM-dd');

      if ((hour == 5 && minute >= 50) || (hour < 13) || (hour == 13 && minute < 50)) {
        lekerdezszaknum = 3;
        downdate = $filter('date')((new Date().getTime() - 24 * 3600 * 1000), 'yyyy-MM-dd');
      }
      else if ((hour == 13 && minute >= 50) || (hour < 21) || (hour == 21 && minute < 50)) {
        lekerdezszaknum = 1;
      }
      else if ((hour == 21 && minute >= 50) || (hour > 21) || (hour < 5) || (hour == 5 && minute < 50)) {
        lekerdezszaknum = 2;
        if ((hour >= 0) || (hour < 5) || (hour == 5 && minute < 50)) {
          downdate = $filter('date')((new Date().getTime() - 24 * 3600 * 1000), 'yyyy-MM-dd');
        }
      }

      var hany = 0;
      angular.forEach(vm.sheetmakers, function (v, k) {
        dataService.getsm(v, downdate).then(function (response) {
          hany++;
          vm.smdata = response.data;
          for (var i = 0; i < vm.smdata.length; i++) {
            if (vm.smdata[i].amount > 0 && vm.smdata[i].name.includes(substring) && lekerdezszaknum == vm.smdata[i].shiftnum) {
              valami += Math.floor((Math.floor((vm.smdata[i].amount) / 12)) / 2);
            }
          }
          if (hany == 3) {
          }
        });
      });

    }

    function feltolt_x() {
      var szoveg = ["Tény/Terv"];
      return szoveg;
    }

    function allomas(tomb) {
      return tomb[0].machinename;
    }

    function szakdb(tomb) {
      var nowtime = new Date().getHours() * 60 + new Date().getMinutes();
      var szam = 0;

      for (var i = 0; i < tomb.length; i++) {
        var valami = new Date(tomb[i].startdate);
        var datumka = new Date(valami).getHours() * 60 + new Date(valami).getMinutes();
        if ((nowtime >= 350 && nowtime < 830) && (datumka >= 350 && datumka < 830)) {
          szam++;
        }
        else if ((nowtime >= 830 && nowtime < 1310) && (datumka >= 830 && datumka < 1310)) {
          szam++;
        }
        else if ((nowtime >= 1310 || nowtime < 350) && (datumka >= 1310 || datumka < 350)) {
          szam++;
        }
      }
      return szam / 2;
    }

    function szakddb(tomb) {
      var now = new Date();
      var nh = now.getHours();
      var nm = now.getMinutes();
      var nt = nh * 60 + nm;
      var sz = 0;
      for (var i = 0; i < tomb.length; i++) {
        var d = new Date(tomb[i].startdate);
        var h = d.getHours();
        var m = d.getMinutes();
        var t = (h * 60 + m);
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

    function plancreator4(szam) {
      var nowhour = new Date().getHours();
      var nowminute = new Date().getMinutes();
      var nowtime = nowhour * 60 + nowminute;
      vm.actplan = 0;

      if (nowtime >= 350 && nowtime < 830) {
        vm.actplan = Math.round((szam / 480) * (nowtime - 350));
      }
      else if (nowtime >= 830 && nowtime < 1310) {
        vm.actplan = Math.round((szam / 480) * (nowtime - 830));
      }
      else if (nowtime >= 1310) {
        vm.actplan = Math.round((szam / 480) * (nowtime - 1310));
      }
      else if (nowtime < 350) {
        vm.actplan = Math.round((szam / 480) * (130 + nowtime));
      }
      return vm.actplan;
    }

    function choose() {
      var hour = new Date().getHours();
      var minute = new Date().getMinutes();

      if ((hour == 5 && minute >= 50) || (hour < 13) || (hour == 13 && minute < 50)) {
        vm.actszak = vm.szakok[0];
      }
      else if ((hour == 13 && minute >= 50) || (hour < 21) || (hour == 21 && minute < 50)) {
        vm.actszak = vm.szakok[1];
      }
      else if ((hour == 21 && minute >= 50) || (hour > 21) || (hour < 5) || (hour == 5 && minute < 50)) {
        vm.actszak = vm.szakok[2];
      }
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
      choose();
    }

    var refreshload = setInterval(load, 2 * 60 * 1000);
    var refreshchoose = setInterval(choose, 2 * 60 * 1000);
    var refreshdate = setInterval(date_refresh, 2 * 60 * 1000);

    function date_refresh() {
      vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
      vm.frissites_ideje = $filter('date')(new Date().getTime() + 2 * 60 * 1000, 'yyyy-MM-dd HH:mm');
    }
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
