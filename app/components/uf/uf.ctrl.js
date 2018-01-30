define([], function () {
  'use strict';
  function Controller(ufService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.days = [];
    vm.data = [];
    vm.bundledata = [];
    vm.load = false;
    vm.createdates = createdates;

    function createdates() {
      vm.days = [];
      var differencedate = 0;
      differencedate = (new Date(vm.enddate).getTime() - new Date(vm.startdate).getTime()) / (24 * 3600 * 1000);
      for (var i = 0; i <= differencedate; i++) {
        vm.days[i] = $filter('date')(new Date(vm.enddate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
      }
      loadetf();
    }

    function loadetf() {
      vm.load = true;
      vm.data = [];
      vm.endate=$filter('date')(new Date(vm.enddate).getTime()+(2*24*3600*1000),'yyyy-MM-dd');
      ufService.getetf(vm.startdate, vm.endate).then(function (response) {
        vm.data = response.data;
        for (var i = 0; i < vm.data.length; i++) {

          vm.data[i].Potting_Start_Shiftnum = $filter('shiftnumber')(vm.data[i].Static_Potting_Start);
          vm.data[i].Static_Potting_Start = $filter('date')($filter('changeDate')(vm.data[i].Static_Potting_Start), 'yyyy-MM-dd');
          vm.data[i].Potting_Start_Shift = $filter('shift')(vm.data[i].Potting_Start_Shiftnum, vm.data[i].Static_Potting_Start);

          vm.data[i].Potting_Flip_Shiftnum = $filter('shiftnumber')(vm.data[i].Static_Potting_Flip);
          vm.data[i].Static_Potting_Flip = $filter('date')($filter('changeDate')(vm.data[i].Static_Potting_Flip), 'yyyy-MM-dd');
          vm.data[i].Potting_Flip_Shift = $filter('shift')(vm.data[i].Potting_Flip_Shiftnum, vm.data[i].Static_Potting_Flip);

          vm.data[i].Centrifuga_Start_Shiftnum = $filter('shiftnumber')(vm.data[i].Centrifuga_Start);
          vm.data[i].Centrifuga_Start = $filter('date')($filter('changeDate')(vm.data[i].Centrifuga_Start), 'yyyy-MM-dd');
          vm.data[i].Centrifuga_Start_Shift = $filter('shift')(vm.data[i].Centrifuga_Start_Shiftnum, vm.data[i].Centrifuga_Start);

          vm.data[i].Centrifuga_End_Shiftnum = $filter('shiftnumber')(vm.data[i].Centrifuga_End);
          vm.data[i].Centrifuga_End = $filter('date')($filter('changeDate')(vm.data[i].Centrifuga_End), 'yyyy-MM-dd');
          vm.data[i].Centrifuga_End_Shift = $filter('shift')(vm.data[i].Centrifuga_End_Shiftnum, vm.data[i].Centrifuga_End);

          vm.data[i].BP_Start_Shiftnum = $filter('shiftnumber')(vm.data[i].BP_start);
          vm.data[i].BP_start = $filter('date')($filter('changeDate')(vm.data[i].BP_start), 'yyyy-MM-dd');
          vm.data[i].BP_Start_Shift = $filter('shift')(vm.data[i].BP_Start_Shiftnum, vm.data[i].BP_start);

          vm.data[i].BP_End_Shiftnum = $filter('shiftnumber')(vm.data[i].BP_end);
          vm.data[i].BP_end = $filter('date')($filter('changeDate')(vm.data[i].BP_end), 'yyyy-MM-dd');
          vm.data[i].BP_End_Shift = $filter('shift')(vm.data[i].BP_End_Shiftnum, vm.data[i].BP_end);

          vm.data[i].Grade_Shiftnum = $filter('shiftnumber')(vm.data[i].Gradedate);
          vm.data[i].Gradedate = $filter('date')($filter('changeDate')(vm.data[i].Gradedate), 'yyyy-MM-dd');
          vm.data[i].Grade_Shift = $filter('shiftnumber')(vm.data[i].Grade_Shiftnum, vm.data[i].Gradedate);

          vm.data[i].Amount = 1;
          vm.data[i].AEQ = 1.2;
        }
        loadbundle();
      });
    }

    function loadbundle() {
      vm.bundledata=[];
      vm.xAxisData = [];
      vm.bundleChartData = [];vm.pstart = []; vm.centri = []; vm.bp = []; vm.grade = [];
      ufService.getbundle(vm.startdate, vm.endate).then(function (rsp) {
          for (var j = 0; j < rsp.data.length; j++) {
            if (rsp.data[j].bundle.includes("3132313")) {
              rsp.data[j].SPL_Start_Shiftnum = $filter('shiftnumber')(rsp.data[j].SPL_start);
              rsp.data[j].SPL_start = $filter('date')($filter('changeDate')(rsp.data[j].SPL_start), 'yyyy-MM-dd');
              rsp.data[j].SPL_Start_Shift = $filter('shift')(rsp.data[j].SPL_Start_Shiftnum, rsp.data[j].SPL_start);

              rsp.data[j].SPL_End_Shiftnum = $filter('shiftnumber')(rsp.data[j].SPL_end);
              rsp.data[j].SPL_end = $filter('date')($filter('changeDate')(rsp.data[j].SPL_end), 'yyyy-MM-dd');
              rsp.data[j].SPL_Start_Shift = $filter('shift')(rsp.data[j].SPL_End_Shiftnum, rsp.data[j].SPL_end);

              rsp.data[j].Amount = 1;
              rsp.data[j].AEQ = 1.2;
              vm.bundledata.push(rsp.data[j]);
            }
        }
        var k = $filter('unique')(vm.bundledata, 'SPL_end');
        console.log(k);
        for(var ki=0;ki<k.length;ki++){
          vm.xAxisData.push(k[ki].SPL_end);
          vm.bundleChartData.push({name:k[ki].SPL_end, y: parseFloat($filter('sumField')($filter('filter')(vm.bundledata, {SPL_end: k[ki].SPL_end}), 'AEQ'))});
          vm.pstart.push({name:k[ki].SPL_end, y: parseFloat($filter('sumField')($filter('filter')(vm.data, {Static_Potting_Start: k[ki].SPL_end}), 'AEQ'))});
          vm.centri.push({name:k[ki].SPL_end, y: parseFloat($filter('sumField')($filter('filter')(vm.data, {Centrifuga_End: k[ki].SPL_end}), 'AEQ'))});
          vm.bp.push({name:k[ki].SPL_end, y: parseFloat($filter('sumField')($filter('filter')(vm.data, {BP_end: k[ki].SPL_end}), 'AEQ'))});
          vm.grade.push({name:k[ki].SPL_end, y: parseFloat($filter('sumField')($filter('filter')(vm.data, {Gradedate: k[ki].SPL_end}), 'AEQ'))});
        }
        console.log(vm.xAxisData);
        vm.chartconfig = {
          chart: {type: 'column'},
          title: {text: 'ZW1500 Termékvonal'},
          subTitle: {text: 'MES adatok megjelenítése'},
          xAxis: { type: 'category', categories: vm.xAxisData},
          series: [
            {name: 'SPL end', data: vm.bundleChartData},
            {name: 'Potting Start', data: vm.pstart},
            {name: 'Centrifuga End', data: vm.centri},
            {name: 'BP End', data: vm.bp},
            {name: 'Grade', data: vm.grade}
          ]
        };
        vm.load = false;
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.chartconfig = {
        chart: {}
      };
      vm.edate = $filter('date')(new Date(), 'yyyy-MM-dd');
      createdates();
    }
  }
  Controller.$inject = ['ufService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
