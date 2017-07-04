define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
<<<<<<< HEAD
    vm.dryingdata = [];
=======
>>>>>>> 6b0d1e020a01cb7d87a7ffbe01e3770271a6d60f
    vm.difference = [];
    vm.szakok = [];
    vm.smdata = [];
    vm.phasenumbers = [0, 1, 2, 3, 4, 5, 6, 7];
    vm.hely = ['Potting be', 'Előkészítés alsó', 'Gélberakás alsó', 'Esztétika alsó', 'Forgatás', 'Gélberakás felső', 'Esztétika felső', 'Potting ki'];
    vm.datum = $filter('date')(new Date().getTime() - ((5 * 60 + 50) * 60 * 1000), 'yyyy-MM-dd');
    var szakallando4 = 27;
    vm.actplan = 0;
<<<<<<< HEAD
    vm.usenumber = 0;
=======
>>>>>>> 6b0d1e020a01cb7d87a7ffbe01e3770271a6d60f
    vm.places = [];
    vm.szakok[0] = $filter('shift')(1, vm.datum);
    vm.szakok[1] = $filter('shift')(2, vm.datum);
    vm.szakok[2] = $filter('shift')(3, vm.datum);
    vm.actszak = "";
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
    vm.frissites_ideje = $filter('date')(new Date().getTime() + 2 * 60 * 1000, 'yyyy-MM-dd HH:mm');
    vm.pottloading = false;

    function load() {
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

<<<<<<< HEAD
    function loaddrying() {
      vm.dryingdata = [];
      vm.usenumber = 0;
      dataService.getdrying().then(function (response) {
        vm.dryingdata = response.data;
        for(var i=0;i<vm.dryingdata.length;i++){
          if(vm.dryingdata[i].Time_to_Go<4){
            vm.usenumber+=1;
          }
        }
      });
    }

=======
>>>>>>> 6b0d1e020a01cb7d87a7ffbe01e3770271a6d60f
    function feltolt_x() {
      var szoveg = ["Tény/Terv"];
      return szoveg;
    }

    function allomas(tomb) {
      return tomb[0].machinename;
    }

    function szakdb(tomb) {
      var nowtime = new Date().getHours() * 60 + new Date().getMinutes();
      var szamde = 0;
      var szamdu = 0;
      var szamej = 0;

      for (var i = 0; i < tomb.length; i++) {
        var valami = new Date(tomb[i].startdate);
        var datumka = new Date(valami).getHours() * 60 + new Date(valami).getMinutes();
        if (datumka >= 350 && datumka < 830) {
          szamde++;
        }
        else if (datumka >= 830 && datumka < 1310) {
          szamdu++;
        }
        else {
          szamej++;
        }
      }
      if (nowtime >= 350 && nowtime < 830) {
        return szamde / 2;
      }
      else if (nowtime >= 830 && nowtime < 1310) {
        return szamdu / 2;
      }
      else {
        return szamej / 2;
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

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      choose();
<<<<<<< HEAD
      loaddrying();
=======
>>>>>>> 6b0d1e020a01cb7d87a7ffbe01e3770271a6d60f
      load();
    }

    var refreshchoose = setInterval(choose, 2 * 60 * 1000);
<<<<<<< HEAD
    var refreshloaddrying = setInterval(loaddrying, 2 * 60 * 1000);
=======
>>>>>>> 6b0d1e020a01cb7d87a7ffbe01e3770271a6d60f
    var refreshload = setInterval(load, 2 * 60 * 1000);
    var refreshdate = setInterval(date_refresh, 2 * 60 * 1000);

    function date_refresh() {
      vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
      vm.frissites_ideje = $filter('date')(new Date().getTime() + 2 * 60 * 1000, 'yyyy-MM-dd HH:mm');
    }
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
