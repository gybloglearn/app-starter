define([], function () {
  'use strict';
  function Controller(downloadService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.type = ["ETF", "Gradeing"];
    vm.times = ["nap", "hét", "hónap", "negyedév", "év"];
    vm.data = [];
    vm.startdate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.acttime = "nap";
    vm.acttype = "ETF";
    vm.load = load;
    console.log(vm.enddate);

    /*function beallit(){
      if(vm.acttime=="nap"){
      }
    }*/

    function load() {
      vm.data = [];

      downloadService.get(vm.startdate, vm.enddate, vm.acttype, vm.acttime).then(function (response) {
        vm.data = response.data;
        console.log(vm.data);
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['downloadService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
