define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (7 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.loading = false;

    function loadall() {
      vm.loading = true;
      //loadsl();
      loaddowntime();
    }

    function loadsl(arr) {
      vm.sldata = [];
      dataService.getsl(vm.startdate, vm.enddate).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].machine == "SpinLine #136" || response.data[i].machine == "SpinLine #236") {
            vm.sldata.push(response.data[i]);
          }
        }
        create_amount_chartdata(vm.sldata, arr)
      });
    }

    function create_amount_chartdata(tb, arr) {
      vm.cats = [];
      console.log(arr);
      vm.chartData = [
        { name: 'SpinLine #136_állásidővel csökkentett', color: 'rgb(51, 102, 0)', data: [] },
        { name: 'SpinLine #136', color: 'rgb(51, 204, 51)', data: [] },
        { name: 'SpinLine #236', color: 'rgb(255, 153, 0)', data: [] },
        { name: 'SpinLine #236_állásidővel csökkentett', color: 'rgb(204, 51, 0)', data: [] },
        { name: 'Terv', color: 'rgb(255,0,0)', type: 'line', data: [] }
      ];

      var sdn = new Date(vm.startdate).getTime();
      var edn = new Date(vm.enddate).getTime();
      while (sdn <= edn) {
        if (sdn == edn) {
          vm.cats.push($filter('date')(sdn, 'yyyy-MM-dd'));
          vm.chartData[0].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: 0 });
          vm.chartData[1].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: 0 });
          vm.chartData[2].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: 0 });
          vm.chartData[3].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: 0 });
          vm.chartData[4].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: 110 });
        }
        else {
          vm.cats.push($filter('date')(sdn, 'yyyy-MM-dd'));
          vm.chartData[0].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: 120 });
          vm.chartData[1].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: 0 });
          vm.chartData[2].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: 0 });
          vm.chartData[3].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: 120 });
          vm.chartData[4].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: 110 });
        }
        sdn += (24 * 3600 * 1000);

      }

      for (var i = 0; i < tb.length; i++) {
        for (var j = 0; j < vm.chartData.length - 1; j++) {
          for (var k = 0; k < vm.chartData[j].data.length; k++) {
            if (j == 1 && tb[i].machine == "SpinLine #136" && tb[i].item1 == vm.chartData[j].data[k].cat) {
              vm.chartData[j].data[k].y = tb[i].textbox2;
            }
            else if (j == 2 && tb[i].machine == "SpinLine #236" && tb[i].item1 == vm.chartData[j].data[k].cat) {
              vm.chartData[j].data[k].y = tb[i].textbox2;
            }
          }
        }
      }

      for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < vm.chartData.length; j++) {
          for (var k = 0; k < vm.chartData[j].data.length; k++) {
            if (j == 0 && arr[i].Machine == "SPL101" && arr[i].startdate == vm.chartData[j].data[k].cat) {
              vm.chartData[j].data[k].y -= arr[i].Duration_s_ / 3600 * 5;
            }
            else if (j == 3 && arr[i].Machine == "SPL102" && arr[i].startdate == vm.chartData[j].data[k].cat) {
              vm.chartData[j].data[k].y -= arr[i].Duration_s_ / 3600 * 5;
            }
          }
        }
      }
      create_amount_chart();
    }

    function create_amount_chart() {
      vm.amount_chartconfig = {
        chart: {
          type: 'column',
          height: 350,
        },
        tooltip: { shared: true },
        xAxis: { type: 'category', categories: vm.cats },
        yAxis: {
          title: {
            text: "AEQ"
          }
        },
        title: { text: 'Termelt mennyiség' },
        series: vm.chartData
      };
    }

    function loaddowntime() {
      vm.dtdata = [];
      dataService.getdowntime(vm.startdate, vm.enddate).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].Duration_s_ = response.data[i].Duration_s_ == '' ? 0 : parseInt(response.data[i].Duration_s_);
          response.data[i].Duration_s_ = response.data[i].Duration_s_ * 1;
          var dtvalt = new Date(response.data[i].startdate).getHours() * 60 + new Date(response.data[i].startdate).getMinutes();
          if (dtvalt < 350) {
            response.data[i].startdate = $filter('date')(new Date(response.data[i].startdate).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
          }
          else {
            response.data[i].startdate = $filter('date')(new Date(response.data[i].startdate), 'yyyy-MM-dd');
          }
          vm.dtdata.push(response.data[i]);
        }
        loadsl(vm.dtdata);
        create_downtime_chartdata(vm.dtdata);

        vm.loading = false;
      });
    }

    function create_downtime_chartdata(tb) {

      vm.categ = [];
      vm.alldata = [
        { name: 'SpinLine #136', color: 'rgb(51, 204, 51)', data: [] },
        { name: 'SpinLine #236', color: 'rgb(255, 153, 0)', data: [] }
      ];

      vm.chData = [
        { name: 'Váratlan Gépleállás', color: 'rgb(255,0,0)', data: [], stack: "SpinLine #136", showInLegend: false },
        { name: 'Váratlan Gépleállás', color: 'rgb(255,0,0)', data: [], stack: "SpinLine #236" },
        { name: 'Tervezett állás', color: 'rgb(50,100,200)', data: [], stack: "SpinLine #136", showInLegend: false },
        { name: 'Tervezett állás', color: 'rgb(50,100,200)', data: [], stack: "SpinLine #236" },
        { name: 'Fonatoló hiba', color: 'rgb(150,150,150)', data: [], stack: "SpinLine #136", showInLegend: false },
        { name: 'Fonatoló hiba', color: 'rgb(150,150,150)', data: [], stack: "SpinLine #236" },
        { name: 'Operátor hiba', color: 'rgb(200,50,200)', data: [], stack: "SpinLine #136", showInLegend: false },
        { name: 'Operátor hiba', color: 'rgb(200,50,200)', data: [], stack: "SpinLine #236" }
      ];
      var sdn = new Date(vm.startdate).getTime();
      var edn = new Date(vm.enddate).getTime();
      while (sdn <= edn) {
        var ak = $filter('date')(sdn, 'yyyy-MM-dd');
        vm.categ.push($filter('date')(sdn, 'yyyy-MM-dd'));

        vm.alldata[0].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: 0 });
        vm.alldata[1].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), y: 0 });

        vm.chData[0].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), stack: "SpinLine #136", y: (parseFloat($filter('sumField')($filter('filter')(tb, { Machine: "SPL101", startdate: ak, Reason_group_Name: "Váratlan Gépleállás" }), 'Duration_s_'))) / 3600 });
        vm.chData[1].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), stack: "SpinLine #236", y: (parseFloat($filter('sumField')($filter('filter')(tb, { Machine: "SPL102", startdate: ak, Reason_group_Name: "Váratlan Gépleállás" }), 'Duration_s_'))) / 3600 });
        vm.chData[2].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), stack: "SpinLine #136", y: (parseFloat($filter('sumField')($filter('filter')(tb, { Machine: "SPL101", startdate: ak, Reason_group_Name: "Tervezett állás" }), 'Duration_s_'))) / 3600 });
        vm.chData[3].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), stack: "SpinLine #236", y: (parseFloat($filter('sumField')($filter('filter')(tb, { Machine: "SPL102", startdate: ak, Reason_group_Name: "Tervezett állás" }), 'Duration_s_'))) / 3600 });
        vm.chData[4].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), stack: "SpinLine #136", y: (parseFloat($filter('sumField')($filter('filter')(tb, { Machine: "SPL101", startdate: ak, Reason_group_Name: "Fonatoló hiba" }), 'Duration_s_'))) / 3600 });
        vm.chData[5].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), stack: "SpinLine #236", y: (parseFloat($filter('sumField')($filter('filter')(tb, { Machine: "SPL102", startdate: ak, Reason_group_Name: "Fonatoló hiba" }), 'Duration_s_'))) / 3600 });
        vm.chData[6].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), stack: "SpinLine #136", y: (parseFloat($filter('sumField')($filter('filter')(tb, { Machine: "SPL101", startdate: ak, Reason_group_Name: "Operátor hiba" }), 'Duration_s_'))) / 3600 });
        vm.chData[7].data.push({ cat: $filter('date')(sdn, 'yyyy-MM-dd'), stack: "SpinLine #236", y: (parseFloat($filter('sumField')($filter('filter')(tb, { Machine: "SPL102", startdate: ak, Reason_group_Name: "Operátor hiba" }), 'Duration_s_'))) / 3600 });
        sdn += (24 * 3600 * 1000);
      }

      for (var i = 0; i < tb.length; i++) {
        for (var j = 0; j < vm.alldata.length; j++) {
          for (var k = 0; k < vm.alldata[j].data.length; k++) {
            if (j == 0 && tb[i].Machine == "SPL101" && tb[i].startdate == vm.alldata[j].data[k].cat) {
              vm.alldata[j].data[k].y += tb[i].Duration_s_ / 3600;
            }
            else if (j == 1 && tb[i].Machine == "SPL102" && tb[i].startdate == vm.alldata[j].data[k].cat) {
              vm.alldata[j].data[k].y += tb[i].Duration_s_ / 3600;
            }
          }
        }
      }
      create_downtime_chart();
    }

    function create_downtime_chart() {
      vm.downtimeconfig = {
        chart: {
          type: 'column',
          height: 350,
        },
        plotOptions: { column: { stacking: "normal", grouping: true } },
        tooltip: { shared: true },
        xAxis: { type: 'category', categories: vm.categ },
        yAxis: {
          title: {
            text: "Idő (óra)"
          }
        },
        title: { text: 'Állásidő eloszlás' },
        series: vm.chData
      };
    }

    var refresall = setInterval(loadall, 60 * 60 * 1000);
    activate();

    function activate() {
      //(!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadall();
    }
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
