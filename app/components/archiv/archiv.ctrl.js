define([], function () {
  'use strict';
  function Controller(archivService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.getD = getD;
    vm.chConf = changeconfig;

    var aeqs = {
      "Ds12 FLOW": 0.6,
      //"DS12FLOW": 0.6,
      "ZW220 CP5": 0.44,
      "ZW230 FLOW": 0.46,
      "ZW230 CP5": 0.46,
      "C11CP5": 0.5,
			"C11 CP5": 0.5,
      "C11FLOW": 0.5,
      //"C11 FLOW": 0.5,
      "D11 CP5": 0.68,
      "D13 CP5": 0.88,
      "D12 FLOW": 0.74,
      "D11 FLOW": 0.68,
      "A27 CP5": 1,
      "A27 FLOW": 1,
      "B32 CP5": 1.3,
      "B32 FLOW": 1.3,
      "DS- D13 CP5": 0.7,
      //"DS13CP5": 0.7,
      "ZB500S": 0.6,
				"DX": 0.74
    };

    vm.mods = [
      "ZW220 CP5",
      "ZW230 FLOW",
      "ZW230 CP5",
      "C11CP5",
				"C11 CP5",
      "C11FLOW",
      "D11 CP5",
      "D11 FLOW",
      "D12 FLOW",
      "Ds12 FLOW",
      "D13 CP5",
      "DS- D13 CP5",
      "ZB500S",
				"DX"
    ];
    vm.bokes = {
      "Ds12 FLOW": 30,
      "ZW220 CP5": 20,
      "ZW230 FLOW": 30,
      "ZW230 CP5": 20,
      "C11CP5": 20,
				"C11 CP5": 20,
      "C11FLOW": 30,
      "D11 CP5": 20,
      "D13 CP5": 20,
      "D12 FLOW": 30,
      "D11 FLOW": 30,
      "DS- D13 CP5": 20,
      "ZB500S": 50,
				"DX": 5
    };

    function getD() {
      vm.days = [];
      vm.data = [];
      vm.chartConfig = { chart: { height: 300 } };
      for (var i = new Date(vm.dateto).getTime(); i > new Date(vm.datefrom).getTime(); i = i - 24 * 3600 * 1000) {
        var day = $filter('date')(i, 'MMdd');
        if (($filter('date')(i, 'yyyy')) != $filter('date')(new Date().getTime(), 'yyyy')) {
          var year = $filter('date')(i, 'yyyy');
        } else {
          year = null;
        }

        vm.days.push(day);
        vm.data.push({ for: day, year: year });
      }
      vm.startdatetoshift=new Date(vm.datefrom).getTime();
      getData(vm.data);
    }
		function getData(data) {
      angular.forEach(data, function (v, k) {
        archivService.get(v.for, v.year).then(function (response) {
          v.data = separate(response.data[0].data);
          v.for = response.data[0].data[0].days;
          var dx = new Date(vm.datefrom).getTime();
          if (v.for == (dx - 1 * 3600 * 1000))
            vm.chConf();
        });
      });
    }

    function changeconfig() {
      vm.chartConfig = {
        chart: { height: 300, zoomType: 'x' },
        title: { text: vm.filterer + ' bökések' },
        xAxis: { type: "datetime" },
        yAxis: [
          { title: { text: "AEQ" } },
          { title: { text: "Bökés" }, opposite: true }
        ],
        tooltip: {
          shared: true,
          formatter: function () {
            var s = '<b>' + Highcharts.dateFormat('%e - %b - %Y',
              new Date(this.x)) + '</b>';

            $.each(this.points, function () {
              s += '<br/><span style="color:' + this.series.color + ';">' + this.series.name + ': ' +
                this.y.toFixed(2) + '</span>';
            });

            return s;
          }
        }
      };
      var d = [];
      d[0] = { name: 'BPzett AEQ', data: [], type: 'column', color: "rgba(100,180,50,.5)", yAxis: 0 };
      d[1] = { name: 'Bökés / AEQ', data: [], type: 'line', yAxis: 1, tooltip: { valueDecimals: 2 } };
      d[2] = { name: 'Bökés / AEQ cél', data: [], type: 'line', yAxis: 1, tooltip: { valueDecimals: 2 }, color: "rgba(255,100,100,.8)" };
      angular.forEach(vm.data, function (v, k) {
        var term = 0, bok = 0;
        if (vm.filterer) {
          term = parseInt($filter('sumField')($filter('filter')(v.data.aeq, { "name": vm.filterer }), 'aeq'));
          bok = parseInt($filter('sumField')($filter('filter')(v.data.bokes, { "name": vm.filterer }), 'amount'));
        } else {
          term = parseInt($filter('sumField')(v.data.aeq, 'aeq'));
          bok = parseInt($filter('sumField')(v.data.bokes, 'amount'));
        }

        d[0].data.push({ x: v.for, y: (term ? term : 0) });
        d[0].data = $filter('orderBy')(d[0].data, 'x');
        d[1].data.push({ x: v.for, y: (term > 0 ? parseFloat(bok / term) : 0) });
        d[1].data = $filter('orderBy')(d[1].data, 'x');
        d[2].data.push({ x: v.for, y: vm.filterer ? vm.bokes[vm.filterer] : 25 });
        d[2].data = $filter('orderBy')(d[2].data, 'x');
      });

      vm.chartConfig.series = d;
    }

    function separate(data) {
      data.bokes = [];
      data.aeq = [];
      angular.forEach(data, function (v, k) {
        if (v.name.indexOf("BOK-BOKES") > -1) {
          v.name = v.name.replace("_BOK-BOKES", "");
          v.name = v.name.replace("C11 FLOW", "C11FLOW");
          v.name = v.name.replace("C11 CP5", "C11CP5");
          v.name = v.name.replace("DS12FLOW", "Ds12 FLOW");
          v.name = v.name.replace("DS13CP5", "DS- D13 CP5");
          data.bokes.push(v);
        } else {
          v.name = v.name.replace("_BP-OUT", "");
          v.aeq = parseFloat(aeqs[v.name]) * v.amount;
          data.aeq.push(v);
        }
      });
      return data;
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.changeshiftdate=new Date('2017-09-01').getTime();
      vm.dateto = new Date().getTime();
      vm.datefrom = $filter('date')(vm.dateto - 7 * 24 * 3600 * 1000, 'yyyy-MM-dd');
      vm.dateto = $filter('date')(vm.dateto, 'yyyy-MM-dd');
      vm.getD();
      vm.edate = $filter('date')(new Date().getTime(),'yyyy-MM-dd');
      vm.startdatetoshift=new Date(vm.datefrom).getTime();
    }
  }
  Controller.$inject = ['archivService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
