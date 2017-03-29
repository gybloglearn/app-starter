define([], function () {
  'use strict';
  function Controller($cookies, $state, $rootScope, $stateParams, $filter) {
    var vm = this;
    vm.attemptpage = {};

    activate();
    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      if ($stateParams.newtestobject) {
        vm.attemptpage = $stateParams.attemptobject;
      }
      else {
        $state.go("start");
      }

    }
  }

  Controller.$inject = ['$cookies', '$state', '$rootScope', '$stateParams', '$filter',];
  return Controller;
});