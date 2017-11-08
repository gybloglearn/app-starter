define([], function () {
  'use strict';
  function Controller(rewindersumService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    
    vm.startdate=$filter('date')(new Date().getTime()-7*24*3600*1000, 'yyyy-MM-dd');
    vm.enddate=$filter('date')(new Date().getTime()-24*3600*1000, 'yyyy-MM-dd');
    vm.startdatenum=$filter('date')(new Date().getTime()-7*24*3600*1000, 'yyyy-MM-dd');
    vm.enddatenum=$filter('date')(new Date().getTime()-24*3600*1000, 'yyyy-MM-dd');
    vm.data=[];
    vm.load=load;
    vm.beallit=beallit;

    function beallit(){
      vm.startdatenum = $filter('date')(new Date(vm.startdate), 'yyyy-MM-dd');
      vm.enddatenum = $filter('date')(new Date(vm.enddate), 'yyyy-MM-dd');
    }

    function load(){
      vm.data=[];

      var datediff=(new Date(vm.enddate).getTime()-new Date(vm.startdate).getTime())/(24*3600*1000)+1;
      for(var i=1;i<=datediff;i++){
        var actnum=$filter('date')(new Date().getTime()-i*24*3600*1000, 'yyyyMMdd');
        
        rewindersumService.get(actnum).then(function (response) {
          for(var j=0;j<response.data.length;j++){
            response.data[j].shift=$filter('shift')(response.data[j].ShiftNum,response.data[j].date);
            response.data[j].ProducedLength=response.data[j].ProducedLength*1;
            response.data[j].P_Count=response.data[j].P_Count*1;
            vm.data.push(response.data[j])
          }
          console.log(vm.data);
        });
      }
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.edate=$filter('date')(new Date().getTime()-24*3600*1000, 'yyyy-MM-dd');
      load();
    }
  }
  Controller.$inject = ['rewindersumService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
