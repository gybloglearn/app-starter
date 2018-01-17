define([], function () {
  'use strict';
  function Controller(sumweekService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.shifts = ["A", "B", "C", "D"];
    vm.data = [];
    vm.weeks = [];
    vm.allando = [];
    vm.createdates = createdates;
    vm.loaddata = false;
    vm.redrawchart = redrawchart;

    function createdates() {
      vm.loaddata = true;
      vm.days = [];
      vm.hetdb = [];
      var differencedate = 0;
      differencedate = (new Date(vm.enddate).getTime() - new Date(vm.startdate).getTime()) / (24 * 3600 * 1000);

      for (var i = 0; i <= differencedate; i++) {
        vm.days[i] = $filter('date')(new Date(vm.enddate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyyMMdd');
        vm.hetdb[i] = $filter('week')($filter('date')(new Date(vm.enddate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
      }
      load();
    }

    function load() {
      vm.data = [];
      for (var i = 0; i < vm.days.length; i++) {
        sumweekService.get(vm.days[i]).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            var d = new Date(response.data[j].timestamp).getDay();
            var dm = new Date(response.data[j].timestamp).getHours() * 60 + new Date(response.data[j].timestamp).getMinutes();
            if(d==1&& dm<550){
              response.data[j].week= (response.data[j].week*1)-1;
              if(response.data[j].week<10){
                response.data[j].week="0"+response.data[j].week;
              }
              else{
                response.data[j].week=response.data[j].week.toString();
              }
              //console.log(response.data[j]);
            }
            vm.data.push(response.data[j]);
          }
          createweeks(vm.data);
        });
      }
    }

    function createweeks(t) {
      vm.weeks = [];
      vm.weeks = $filter('unique')(t, 'week');
      vm.actweek = vm.weeks[0].week;
      createweekchart(vm.data);
      setShiftchart(vm.data, vm.actweek);
    }

    function createweekchart(allarr) {
      vm.weekchartconfig = {
        chart: {
          type: 'column',
        },
        plotOptions: {
          column: {
            stacking: 'normal',
          }
        },
        title: { text: "Heti összesítő %-os arány megoszlás" },
        series: [
          {
            type: "line",
            name: 'Cél',
            color: "#ff0000",
            data: vm.allando
          },
          {
            name: 'Tervezett veszteség',
            color: "#ff9933",
            data: puttervezett(allarr),
            stack: 'Veszteség',
          },
          {
            name: 'Szervezési veszteség',
            color: "#0066ff",
            data: putszervezett(allarr),
            stack: 'Veszteség'
          }
        ],
        xAxis: {
          type: 'category',
        },
        yAxis: {
          title: {
            text: "%"
          }
        },
      };
    }

    function setShiftchart(ar1, sz) {
      vm.shiftchartconfig = {
        chart: {
          type: 'column',
        },
        plotOptions: {
          column: {
            stacking: 'normal',
          }
        },
        title: { text: sz + "-hét szakos lebontása %-osan" },
        series: [
          {
            name: 'Tervezett veszt.',
            color: "#ff9933",
            data: createshifttervezett(ar1, vm.shifts, sz),
            stack: 'Veszt',
          },
          {
            name: 'Szervezési veszt.',
            color: "#0066ff",
            data: createshiftszervezett(ar1, vm.shifts, sz),
            stack: 'Veszt'
          }
        ],
        xAxis: {
          type: 'category',
        },
        yAxis: {
          title: {
            text: "%"
          }
        },
      }
    }

    function redrawchart() {
      setShiftchart(vm.data, vm.actweek);
    }

    function puttervezett(ar) {
      vm.allando = [];
      var dt1 = $filter('unique')(ar, 'week');
      var sum = [];
      for (var j = 0; j < dt1.length; j++) {
        vm.allando[j] = 16;
        var counter = 0;
        for (var k = 0; k < vm.hetdb.length; k++) {
          if (dt1[j].week == vm.hetdb[k]) {
            counter++;
          }
        }
        sum.push({ name: dt1[j].week, y: (($filter('sumField')($filter('filter')(ar, { week: dt1[j].week, Ev_Group: "Tervezett veszteseg" }), 'Event_time') * 1) / (counter * 6 * 24 * 3600) * 100) });
      }
      return sum;
    }
    function putszervezett(ar) {
      var dt1 = $filter('unique')(ar, 'week');
      var sum = [];
      for (var j = 0; j < dt1.length; j++) {
        var counter = 0;
        for (var k = 0; k < vm.hetdb.length; k++) {
          if (dt1[j].week == vm.hetdb[k]) {
            counter++;
          }
        }
        sum.push({ name: dt1[j].week, y: (($filter('sumField')($filter('filter')(ar, { week: dt1[j].week, Ev_Group: "Szervezesi veszteseg" }), 'Event_time') * 1) / (counter * 6 * 24 * 3600) * 100) });
      }
      return sum;
    }

    function createshifttervezett(t1, t2, h) {
      var dd = [];
      for (var i = 0; i < t2.length; i++) {
        var counter = 0;
        for (var k = 0; k < vm.hetdb.length; k++) {
          if (h == vm.hetdb[k]) {
            counter++;
          }
        }
        dd.push({ name: t2[i], y: (($filter('sumField')($filter('filter')(t1, { week: h, Shift_Name: t2[i], Ev_Group: "Tervezett veszteseg" }), 'Event_time') * 1) / (counter * 6 * 12 * 3600) * 100) })
      }
      return dd;
    }
    function createshiftszervezett(t1, t2, h) {
      var dd = [];
      for (var i = 0; i < t2.length; i++) {
        var counter = 0;
        for (var k = 0; k < vm.hetdb.length; k++) {
          if (h == vm.hetdb[k]) {
            counter++;
          }
        }
        dd.push({ name: t2[i], y: (($filter('sumField')($filter('filter')(t1, { week: h, Shift_Name: t2[i], Ev_Group: "Szervezesi veszteseg" }), 'Event_time') * 1) / (counter * 6 * 12 * 3600) * 100) })
      }
      return dd;
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.edate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    }
  }
  Controller.$inject = ['sumweekService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});