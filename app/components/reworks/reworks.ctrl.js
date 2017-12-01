define([], function () {
  'use strict';
  function Controller(mapService, reworksService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    vm.getdata = load;
    vm.pns = [];
    function loadpns(){
      mapService.getpartnumber().then(function(resp){
        for(var i = 0; i < resp.data.length; i++){
          resp.data.aeq = parseFloat(resp.data.aeq);
        }
        vm.pns = resp.data;
      });
    }
    function load(){
      vm.data = [];
      if(vm.enddate == vm.startdate) {
        vm.enddate = $filter('date')(new Date(vm.enddate).getTime() + 24*60*60*1000, 'yyyy-MM-dd');
      }
      reworksService.get(vm.startdate, vm.enddate).then(function(response){
        for(var i = 0; i < response.data.length; i++){
          response.data[i].aeq = response.data[i].cnt * parseFloat($filter('filter')(vm.pns, {id: response.data[i].BaaNCode})[0].aeq)
        }
        vm.data = response.data;
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.edate=$filter('date')(new Date().getTime(), 'yyyy-MM-dd');
      loadpns();
      load();
    }

  }
  Controller.$inject = ['mapService', 'reworksService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
