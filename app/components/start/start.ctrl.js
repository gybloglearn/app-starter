define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.edate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.startdate = $filter('date')(new Date().getTime() - 7 * 24 * 1000 * 60 * 60, 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime() - 24 * 1000 * 60 * 60, 'yyyy-MM-dd');

    function create_dates(){
      vm.dates=[];
      vm.loaddates=[];
      var stnum=new Date(vm.startdate).getTime();
      var endnum=new Date(vm.enddate).getTime();
      while(stnum<=endnum){
        vm.dates.push($filter('date')(stnum,'yyyy-MM-dd'));
        vm.loaddates.push($filter('date')(stnum,'yyyyMMdd'));
        stnum+=(24*3600*1000);
      }
      console.log(vm.dates);
      console.log(vm.loaddates);
      getplans();
    }

    function getplans() {
      vm.allplans = [];
      dataService.getplan().then(function (resp) {
        vm.allplans = resp.data;
        load();
      });
    }

    function load(){
      vm.acttarget=0;
      vm.data=[];
      for(var i=0;i<vm.allplans.length;i++){
        if(vm.allplans[i].startdate<=vm.startdate && vm.allplans[i].enddate>=vm.enddate){
          vm.acttarget=vm.allplans[i].aeq;
        }
      }
      for(var j=0;j<vm.loaddates.length;j++){
        dataService.get(vm.loaddates[j]).then(function(response){
          var d=response.data;
          for(var k=0;k<d.length;k++){
            d[k].ProducedLength_aeq=d[k].ProducedLength/8900;
            vm.data.push(d[k]);
          }
          console.log(vm.data);
        });
      }
      console.log(vm.acttarget);
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      create_dates();
    }
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
