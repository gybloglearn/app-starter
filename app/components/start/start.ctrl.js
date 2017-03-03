define([], function () {
  'use strict';
  function Controller($cookies, $state, $rootScope, $filter) {
    var vm = this;

    activate();

    function activate() {
      vm.fr = $filter('date')(vm.n, 'yyyy-MM-dd');
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
    }
  }
  Controller.$inject = ['$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
