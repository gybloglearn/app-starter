define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.difference = [];
    vm.szakok = [];
    vm.phasenumbers = [0, 1, 2, 3, 4, 5, 6, 7];
    vm.hely = ['Potting be', 'Gélezés', 'Uretán alsó', 'Esztétika alsó', 'Fordítás', 'Uretán felső', 'Esztétika felső', 'Potting ki']
    vm.machine = "Potting4";
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    var szakallando4 = 32;
    vm.actplan = 0;
    vm.places = [];
    vm.szakok[0] = $filter('shift')(1, vm.datum);
    vm.szakok[1] = $filter('shift')(2, vm.datum);
    vm.szakok[2] = $filter('shift')(3, new Date().getTime() - ((5 * 60 + 50) * 60 * 1000));
    vm.actszak = "";

    function load() {
      vm.places = [];
      angular.forEach(vm.phasenumbers, function (v, k) {
        dataService.get(vm.datum, vm.machine, v).then(function (response) {
          vm.data[v] = [];
          //vm.data[v] = response.data;
          for (var i = 0; i < response.data.length; i++) {
            response.data[i].machinename = vm.hely[v];
          }
          vm.data[v] = response.data;
          vm.places.push({
            sor:v,
            place: allomas(vm.data[v]),
            db: szakdb(vm.data[v]),
            plan: plancreator4(szakallando4),
            timelast: last(vm.data[v])
          });
        });
      });
      //plancreator4(szakallando4);
    }

    function allomas(tomb) {
      return tomb[0].machinename;
    }

    function szakdb(tomb) {
      var nowtime = new Date().getHours() * 60 + new Date().getMinutes();
      var szam = 0;

      for (var i = 0; i < tomb.length; i++) {
        var valami = new Date(tomb[i].startdate).getTime();
        var datumka=new Date(valami).getHours()*60+new Date().getMinutes(valami);
        if ((nowtime >= 350 && nowtime < 830) && (datumka >= 350 && datumka < 830)) {
          szam++;
        }
        else if ((nowtime >= 830 && nowtime < 1310) && (datumka >= 830 && datumka < 1310)) {
          szam++;
        }
        else if ((nowtime >= 1310 ||nowtime < 350) && (datumka >= 1310 ||datumka < 350)) {
          szam++;
        }
      }
      return szam/2;

    }

    function last(tomb) {
      var actdata = "";
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
        vm.difference[i] = $filter('date')(maxnumbers[i], "yyyy-MM-dd HH:mm:ss");
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
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
