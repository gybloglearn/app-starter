define([], function () {
  'use strict';
  function Controller(weeklyService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.today = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.beforesix = $filter('date')(new Date().getTime() - 6 * 24 * 3600 * 1000, 'yyyy-MM-dd');
    var sheets = ["SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.sheets = sheets;
    vm.data = [];

    function load() {
      vm.data = [];
     
      angular.forEach(sheets, function(v,k){
        weeklyService.get(vm.beforesix, vm.today, v).then(function(response){
          vm.data = vm.data.concat(response.data);
        });
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['weeklyService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
