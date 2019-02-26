define([], function () {
  'use strict';
  function Controller(dryService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.drydata = [];
    vm.drylist = ["Drying3", "Drying2"];
    vm.actdry = "Drying3";
    vm.load = load;
    vm.loadarchive = loadarchive;
    vm.loadarchivefile = loadarchivefile;
    vm.dryarchivedata = [];

    function loadarchivefile(){
      console.log(vm.link);
      vm.dryarchivedata = [];
      dryService.getArchive(vm.link).then(function(response){
        console.log(response.data);
        vm.dryarchivedata = response.data;
      });
    }

    function loadarchive(){
      //var sttime = new Date('2017-12-12 05:50:00').getTime(); //első nap
      var stime = $filter('date')(new Date().getTime()-(45*24*3600*1000),'yyyy-MM-dd');
      var sttime = new Date(stime+' 05:50:00').getTime();
      var enddate = new Date().getTime();
      var loadstodo = Math.floor((enddate - sttime) / (6*60*60*1000));
      vm.loads = [];
      for(var i = 0; i<loadstodo ; i++){
        vm.loads.push({name: $filter('date')(new Date(sttime + (i+1)*6*60*60*1000).getTime(), 'yyyy-MM-dd HH:mm'), link: $filter('date')(new Date(sttime + (i+1)*6*60*60*1000).getTime(), 'yyyyMMddHH')});
      }
    }

    function load() {
      vm.drydata = [];
      vm.dis = true;

      dryService.get(vm.actdry).then(function (response) {
        vm.drydata = response.data;
        vm.dis = false;
      });
    }


    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.archive = false;
      load();
    }
  }
  Controller.$inject = ['dryService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});