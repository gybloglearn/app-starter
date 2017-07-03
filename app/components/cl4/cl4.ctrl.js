define([], function () {
  'use strict';
  function Controller(cl4Service, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.selectday = [];
    vm.charlist = [];
    vm.chartstate = "A keretet elvitték (nyugtázás a fénykapunál)"
    //vm.startdate = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.load = load;
    vm.selectchart = selectchart;

    function update_selectday() {
      for (var i = 0; i < 24; i++) {
        vm.selectday[i] = {}
        if (i < 18) {
          vm.selectday[i].hour = i + 6;
        }
        else {
          vm.selectday[i].hour = i - 18;
        }
        vm.selectday[i].cases = [];
      }
    }

    function load() {
      vm.mtfld=true;
      update_selectday();
      vm.data = [];
      var talalt = false;


      cl4Service.get(vm.enddate).then(function (response) {
        vm.data = response.data;
        for (var i = 0; i < vm.data.length; i++) {
          var actstate = vm.data[i].Status_name1;
          var acthour = new Date(vm.data[i].PLC_Timestamp).getHours();
          var actminute = new Date(vm.data[i].PLC_Timestamp).getMinutes();
          vm.charlist.push(actstate);
          if (actminute < 50) {
            if (acthour < 6) {
              for (var j = 0; j < vm.selectday[acthour + 17].cases.length; j++) {
                if (vm.selectday[acthour + 17].cases[j].state == actstate) {
                  vm.selectday[acthour + 17].cases[j].db++;
                  talalt = true;
                }
              }
              if (talalt == true) {
                talalt = false;
              }
              else {
                var obj = {}
                obj.state = actstate;
                obj.db = 1;
                vm.selectday[acthour + 17].cases.push(obj);
              }
            }
            else {
              for (var j = 0; j < vm.selectday[acthour - 6].cases.length; j++) {
                if (vm.selectday[acthour - 6].cases[j].state == actstate) {
                  vm.selectday[acthour - 6].cases[j].db++;
                  talalt = true;
                }
              }
              if (talalt == true) {
                talalt = false;
              }
              else {
                var obj = {}
                obj.state = actstate;
                obj.db = 1;
                vm.selectday[acthour - 6].cases.push(obj);
              }
            }
          }
          else {
            if (acthour < 6) {
              for (var j = 0; j < vm.selectday[acthour + 18].cases.length; j++) {
                if (vm.selectday[acthour + 18].cases[j].state == actstate) {
                  vm.selectday[acthour + 18].cases[j].db++;
                  talalt = true;
                }
              }
              if (talalt == true) {
                talalt = false;
              }
              else {
                var obj = {}
                obj.state = actstate;
                obj.db = 1;
                vm.selectday[acthour + 18].cases.push(obj);
              }
            }
            else {
              for (var j = 0; j < vm.selectday[acthour - 5].cases.length; j++) {
                if (vm.selectday[acthour - 5].cases[j].state == actstate) {
                  vm.selectday[acthour - 5].cases[j].db++;
                  talalt = true;
                }
              }
              if (talalt == true) {
                talalt = false;
              }
              else {
                var obj = {}
                obj.state = actstate;
                obj.db = 1;
                vm.selectday[acthour - 5].cases.push(obj);
              }
            }
          }
        }
        selectchart(vm.selectday);
        vm.mtfld=false;
      });
    }

    function selectchart(tomb) {
      var resault = [];
      for (var i = 0; i < 24; i++) {
        for (var j = 0; j < tomb[i].cases.length; j++) {
          if (tomb[i].cases[j].state == vm.chartstate) {
            resault.push(tomb[i].cases[j].db);
          }
        }
      }
      setChart(resault);
    }

    function setChart(re) {
      vm.chartconfig = {
        chart: {
          type: 'column',
        },
        title: { text: vm.chartstate },
        series: [
          {
            name: 'Termelt mennyiség',
            color: "#00b300",
            data: re
          }
        ],


        xAxis: [
          { categories: feltolt_hour() },
        ],
        yAxis: {
          title: {
            text: "Keret"
          }
        },
      };
    }
    function feltolt_hour() {
      var szamok = [];
      for (var i = 6; i < 24; i++) {
        szamok.push(i < 10 ? "0" + i : "" + i);
      }
      for (var j = 0; j < 6; j++) {
        szamok.push("0" + j);
      }
      return szamok;
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['cl4Service', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
