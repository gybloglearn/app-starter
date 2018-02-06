define([], function () {
  'use strict';
  function Controller(SumserviceService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.startdate = $filter('date')(new Date(vm.datum).getTime() - (30 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.place = ["Potting be", "Gel Prep Also F", "Uret Prep Also F", "Esztetika Also F", "Forgatas", "Uret Prep Felso F", "Esztetika Felso F", "Potting ki"];
    vm.pottinginfo = [];
    vm.selectpottinginfo = [];
    vm.selectinfo=selectinfo;
    vm.updatedowntime=updatedowntime;
    vm.remove=remove;

    function load() {
      vm.pottinginfo = [];

      SumserviceService.getAll().then(function (resp) {
        vm.pottinginfo = resp.data;
        selectinfo(vm.pottinginfo, vm.startdate, vm.enddate);
      });
    }

    function selectinfo(arr, stdate, enddate) {
      vm.selectpottinginfo = [];

      var stnum = new Date(stdate).getTime();
      var endnum = new Date(enddate).getTime() + (24 * 3600 * 1000);

      for (var i = 0; i < arr.length; i++) {
        var actnum = new Date(arr[i].start).getTime();
        if (actnum >= stnum && actnum < endnum) {
          vm.selectpottinginfo.push(arr[i]);
        }
      }
      console.log(vm.selectpottinginfo);
    }

    function updatedowntime(){
      SumserviceService.put(vm.edit).then(function (resp) {
        vm.edit = '';
      });
    }

    function remove(id, index){
      SumserviceService.erase(id).then(function (resp) {
        vm.pottinginfo.splice(index, 1);
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.today = $filter('date')(new Date(), 'yyyy-MM-dd');
      load();
    }
  }
  Controller.$inject = ['SumserviceService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});