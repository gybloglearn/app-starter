define([], function () {
  'use strict';
  function Controller(wipService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.list=[];
    vm.status=[];
    vm.load=load;

    function load() {
      vm.data = [];
      vm.list=[];
      vm.status=[];

      wipService.get("All", "Rolling", "Report To ERP").then(function (response) {
        vm.data = response.data;
        vm.list=$filter('unique')(vm.data, 'Machine');
        vm.status=$filter('unique')(vm.data, 'Status');
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['wipService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
