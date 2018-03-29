define([], function () {
  'use strict';
  function Controller(oeeService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.years = [2017, 2018];
    vm.weeks = [];
    vm.data = [];
    vm.actyear = new Date().getFullYear();

    function putweek() {
      vm.weeks = [];
      vm.weeklwngth = 0;
      var daynum = new Date().getFullYear();
      if (daynum == vm.actyear) {
        var weeknum = $filter('week')($filter('date')(new Date(), 'yyyy-MM-dd'));
        for (var i = 1; i < weeknum; i++) {
          vm.weeks.push(i);
        }
      }
      else {
        weeknum = 53
        for (var i = 1; i < weeknum; i++) {
          vm.weeks.push(i);
        }
      }
      console.log(vm.weeks);
      vm.weeklwngth = vm.weeks.length;
      load(weeknum);
    }

    function load(wn) {
      vm.data = [];
      for (var i = 1; i < wn; i++) {
        var obj = {};
        obj = {
          week: i,
          downtime: 0,
          runtime: 2 * 7 * 1440 * 60,
          scrapmeter: 0,
          scrapaeq: 0,
          slmeter: 0,
          slaeq: 0
        };
        vm.data.push(obj);
      }

      var firstday = vm.actyear.toString() + '-01-01';
      var today = $filter('date')(new Date(), 'yyyy-MM-dd');
      oeeService.getsl(firstday, today).then(function (response) {
        for (var j = 0; j < response.data.length; j++) {
          var substr = parseInt(response.data[j].item1.substring(5, 7));
          for (var k = 0; k < vm.data.length; k++) {
            if (substr == vm.data[k].week) {
              vm.data[k].slmeter += response.data[j].val;
              vm.data[k].slaeq += response.data[j].textbox2;
            }
          }
        }
        create_chartdata();
      });
      for (var l = 1; l < vm.data.length; l++) {
        if (l < 9) {
          var filedate = vm.actyear.toString() + '0' + vm.data[l].week.toString();
        }
        else {
          var filedate = vm.actyear.toString() + vm.data[l].week.toString();
        }
        oeeService.getdowntime(filedate).then(function (resp) {
          for (var m = 0; m < resp.data.length; m++) {
            var dt = resp.data[m].week * 1;
            for (var n = 0; n < vm.data.length; n++) {
              if (vm.data[n].week == dt) {
                vm.data[n].downtime += resp.data[m].Duration_s_ * 1;
                vm.data[n].runtime -= resp.data[m].Duration_s_ * 1;
              }
            }
          }
        });
        oeeService.getscrap(filedate).then(function (rsp) {
          for (var o = 0; o < rsp.data.length; o++) {
            var dt = rsp.data[o].week * 1;
            for (var p = 0; p < vm.data.length; p++) {
              if (vm.data[p].week == dt) {
                vm.data[p].scrapmeter += rsp.data[o].Mennyiseg * 1;
                vm.data[p].scrapaeq += rsp.data[o].Mennyiseg / 9300;
              }
            }
          }
        });

      }
      //console.log(vm.data);
    }

    function create_chartdata(t) {
      vm.cats = [];
      vm.chartData = [
        { name: 'Availability', color: 'rgb(51, 204, 51)', data: [] },
        { name: 'Quality', color: 'rgb(255, 153, 0)', data: [] },
        { name: 'Performance', color: 'rgb(0, 0, 255)', data: [] },
        { name: 'OEE', color: 'rgb(255,0,0)', type: 'line', data: [] }
      ];
      for (var a = 0; a < vm.data.length; a++) {
        vm.cats.push(vm.data[a].week.toString() + ".hét");
        for (var b = 0; b < vm.chartData.length; b++) {
          if (b == 0) {
            vm.chartData[b].data.push({ cat: vm.data[a].week.toString() + ".hét", y: (((vm.data[a].runtime) - (vm.data[a].downtime)) / (vm.data[a].runtime)) * 100 });
          }
          else if (b == 1) {
            vm.chartData[b].data.push({ cat: vm.data[a].week.toString() + ".hét", y: (((vm.data[a].slmeter) - (vm.data[a].scrapmeter)) / (vm.data[a].slmeter)) * 100 });
          }
          else if (b == 2) {
            vm.chartData[b].data.push({ cat: vm.data[a].week.toString() + ".hét", y: (vm.data[a].slaeq / ((7 * 2 * 200)-vm.data[a].downtime/60/60/24*200)) * 100 });
          }
          else if (b == 3) {
            vm.chartData[b].data.push({ cat: vm.data[a].week.toString() + ".hét", y: (((vm.data[a].runtime) - (vm.data[a].downtime)) / (vm.data[a].runtime)) * (((vm.data[a].slmeter) - (vm.data[a].scrapmeter)) / (vm.data[a].slmeter)) * (vm.data[a].slaeq / ((7 * 2 * 200)-vm.data[a].downtime/60/60/24*200)) * 100 });
          }
        }
      }
      console.log(vm.chartData);
      create_chart();
    }

    function create_chart() {
      vm.chartconfig = {
        chart: {
          type: 'column',
          //width: 1800,
          height: 350
        },
        tooltip: { shared: true },
        xAxis: { type: 'category', categories: vm.cats },
        //yAxis: { tickInterval: 2 },
        title: { text: 'Heti lebontás %-ban' },
        series: vm.chartData
      };
    }



    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      console.log(vm.actyear);
      putweek();
    }
  }
  Controller.$inject = ['oeeService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});

