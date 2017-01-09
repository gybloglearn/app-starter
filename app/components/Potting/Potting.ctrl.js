define([], function () {
  'use strict';
  function Controller(PottingService,$cookies, $state, $rootScope,$filter) {
    var vm = this;
    vm.p="";
    vm.egyedi=[];
    vm.mch="Potting4"
    vm.datum=$filter('date')(new Date(),'yyyy-MM-dd');
    vm.allpotting=["Potting4","Potting3","Potting2"]
    vm.load=load;


    function load(mch,datum)
        {
            vm.p=[];
               PottingService.get(mch,datum).then(function(response){
                vm.p=response.data;
                vm.egyedi=$filter('unique')(vm.p,'name');
            });
        }
    activate();

    function activate() {
      (!$cookies.getObject('user')?$state.go('login'):$rootScope.user=$cookies.getObject('user'));
      load(vm.mch,vm.datum);
    }
  }
  Controller.$inject = ['PottingService','$cookies', '$state', '$rootScope','$filter'];
  return Controller;
});
