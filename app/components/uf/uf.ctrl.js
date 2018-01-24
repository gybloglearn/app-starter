define([], function () {
  'use strict';
  function Controller(ufService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.days = [];
    vm.data = [];
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
      ufService.getetf(vm.startdate, vm.enddate).then(function (response) {
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
      vm.start = $filter('date')(new Date(vm.startdate).getTime() - (3 * 24 * 3600 * 1000), 'yyyy-MM-dd');
      ufService.getbundle(vm.start, vm.enddate).then(function (rsp) {
        for (var i = 0; i < vm.data.length; i++) {
          for (var j = 0; j < rsp.data.length; j++) {
            if (rsp.data[j].bundle == vm.data[i].Bundle1) {
              vm.data[i].SPL = rsp.data[j].SPL_line;
              vm.data[i].SPL_Start_Shiftnum = $filter('shiftnumber')(rsp.data[j].SPL_start);
              vm.data[i].SPL_Start = $filter('date')($filter('changeDate')(rsp.data[j].SPL_start), 'yyyy-MM-dd');
              vm.data[i].SPL_Start_Shift = $filter('shift')(vm.data[i].SPL_Start_Shiftnum, vm.data[i].SPL_Start);

              vm.data[i].SPL_End_Shiftnum = $filter('shiftnumber')(rsp.data[j].SPL_end);
              vm.data[i].SPL_End = $filter('date')($filter('changeDate')(rsp.data[j].SPL_end), 'yyyy-MM-dd');
              vm.data[i].SPL_Start_Shift = $filter('shift')(vm.data[i].SPL_End_Shiftnum, vm.data[i].SPL_End);
            }
          }
        }
        vm.load = false;
        console.log(vm.data);
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.edate = $filter('date')(new Date(), 'yyyy-MM-dd');
      createdates();
    }
  }
  Controller.$inject = ['ufService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
