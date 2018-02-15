define([], function () {
  'use strict';
  function Controller(SumserviceService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.selectdata = [];
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.startdate = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.place = ["Potting be", "Gel Prep Also F", "Uret Prep Also F", "Esztetika Also F", "Forgatas", "Uret Prep Felso F", "Esztetika Felso F", "Potting ki"];
    vm.categories=["Száradási időre várás szárítóban","Száradási időre várás forgatáson","Száradási időre várás esztétikán","Uretánkötési probléma forgatásnál","Egyéb"];
    vm.shifts = ["A", "B", "C", "D"];
    vm.actshift = "";
    vm.selectinfo = selectinfo;

    function load() {
      vm.data = [];
      SumserviceService.getAll().then(function (response) {
        for (var i = 0; i < vm.people.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            var num = new Date(response.data[j].start).getHours() * 60 + new Date(response.data[j].start).getMinutes();
            if (num < 350) {
              response.data[j].day = $filter('date')(new Date(response.data[j].start).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
            }
            else {
              response.data[j].day = $filter('date')(new Date(response.data[j].start), 'yyyy-MM-dd');
            }
            if (vm.people[i].sso == response.data[j].opid) {
              response.data[j].shift = vm.people[i].shift;
              vm.data.push(response.data[j]);
            }
          }
        }
        selectinfo(vm.actshift, vm.data, vm.startdate, vm.enddate);
      });
    }

    function selectinfo(ash, arr, stdate, enddate) {
      vm.selectdata = [];
      vm.dates = [];
      var differencedate = (new Date(enddate).getTime() - new Date(stdate).getTime()) / (24 * 3600 * 1000);

      for (var i = 0; i <= differencedate; i++) {
        vm.dates[i] = $filter('date')(new Date(enddate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
      }

      var stnum = new Date(stdate).getTime();
      var endnum = new Date(enddate).getTime() + (24 * 3600 * 1000);

      if (ash == "") {
        for (var i = 0; i < arr.length; i++) {
          var actnum = new Date(arr[i].day).getTime();
          if (actnum >= stnum && actnum < endnum) {
            vm.selectdata.push(arr[i]);
          }
        }
      }
      else {
        for (var i = 0; i < arr.length; i++) {
          var actnum = new Date(arr[i].day).getTime();
          if (actnum >= stnum && actnum < endnum && arr[i].shift == ash) {
            vm.selectdata.push(arr[i]);
          }
        }
      }
      createChart(vm.selectdata);
    }

    function createChart(ar) {
      vm.chartconfig = {
        chart: {
          type: 'column',
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        title: { text: "Kieső idő" },
        series: [
          {
            name: 'Száradási időre várás szárítóban',
            color: "#ff0000",
            data: feltolt_szarito(ar),
            stack: 'Összes hiba'
          },
          {
            name: 'Száradási időre várás forgatáson',
            color: "#660066",
            data: feltolt_forgatas(ar),
            stack: 'Összes hiba'
          },
          {
            name: 'Száradási időre várás esztétikán',
            color: "#ff9900",
            data: feltolt_esztetika(ar),
            stack: 'Összes hiba'
          },
          {
            name: 'Uretánkötési probléma forgatásnál',
            color: "#3366ff",
            data: feltolt_uretantoltes(ar),
            stack: 'Összes hiba'
          },
          {
            name: 'Egyéb',
            color: "#ff33cc",
            data: feltolt_egyeb(ar),
            stack: 'Összes hiba'
          }
        ],
        xAxis: [
          {
            categories: vm.dates,
            title: { text: "Dátum" }
          },
        ],
        yAxis: {
          title: {
            text: "Perc"
          }
        },
      }
    }

    function feltolt_szarito(t) {
      var dt = [];
      for (var i = 0; i < vm.dates.length; i++) {
        var num = 0;
        for (var j = 0; j < t.length; j++) {
          if (t[j].day == vm.dates[i] && t[j].category == "Száradási időre várás szárítóban") {
            num += t[j].time;
          }
        }
        dt[i] = num;
      }
      return dt;
    }
    function feltolt_forgatas(t) {
      var dt = [];
      for (var i = 0; i < vm.dates.length; i++) {
        var num = 0;
        for (var j = 0; j < t.length; j++) {
          if (t[j].day == vm.dates[i] && t[j].category == "Száradási időre várás forgatáson") {
            num += t[j].time;
          }
        }
        dt[i] = num;
      }
      return dt;
    }
    function feltolt_esztetika(t) {
      var dt = [];
      for (var i = 0; i < vm.dates.length; i++) {
        var num = 0;
        for (var j = 0; j < t.length; j++) {
          if (t[j].day == vm.dates[i] && t[j].category == "Száradási időre várás esztétikán") {
            num += t[j].time;
          }
        }
        dt[i] = num;
      }
      return dt;
    }
    function feltolt_uretantoltes(t) {
      var dt = [];
      for (var i = 0; i < vm.dates.length; i++) {
        var num = 0;
        for (var j = 0; j < t.length; j++) {
          if (t[j].day == vm.dates[i] && t[j].category == "Uretánkötési probléma forgatásnál") {
            num += t[j].time;
          }
        }
        dt[i] = num;
      }
      return dt;
    }
    function feltolt_egyeb(t) {
      var dt = [];
      for (var i = 0; i < vm.dates.length; i++) {
        var num = 0;
        for (var j = 0; j < t.length; j++) {
          if (t[j].day == vm.dates[i] && t[j].category == "Egyéb") {
            num += t[j].time;
          }
        }
        dt[i] = num;
      }
      return dt;
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }

    vm.people = [
      { sso: "212319674", shift: "A" },
      { sso: "113005432", shift: "A" },
      { sso: "113010453", shift: "A" },
      { sso: "113009480", shift: "B" },
      { sso: "212674695", shift: "B" },
      { sso: "212404564", shift: "B" },
      { sso: "212437547", shift: "C" },
      { sso: "113005514", shift: "C" },
      { sso: "212546986", shift: "C" },
      { sso: "113011028", shift: "D" },
      { sso: "113008226", shift: "D" },
      { sso: "113008995", shift: "D" },
      { sso: "502678184", shift: "A" },
      { sso: "502678187", shift: "D" },
    ];
  }
  Controller.$inject = ['SumserviceService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});