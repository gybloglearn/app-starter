define([], function () {
  'use strict';
  function Controller($cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.data=[];
    vm.diff=datediff;

    function datediff() {
      vm.differencedate = 0;
      vm.dates = [];
      vm.data=[];
     
      vm.differencedate = (new Date(vm.enddate).getTime() - new Date(vm.startdate).getTime()) / (24 * 3600 * 1000);
      for (var i = 0; i <= vm.differencedate; i++) {
        vm.dates[i] = $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.data[i] = {}
        vm.data[i].date = $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.data[i].zwde = $filter('shift12')(1, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        vm.data[i].zwej = $filter('shift12')(3, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        vm.data[i].fmde = $filter('shiftfm')(1, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        vm.data[i].fmdu = $filter('shiftfm')(2, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        vm.data[i].fmej = $filter('shiftfm')(3, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        
      }
      console.log(vm.data);
      console.log(vm.dates);
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
    }
  }
  Controller.$inject = ['$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
