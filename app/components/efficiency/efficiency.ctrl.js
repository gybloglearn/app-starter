define([], function () {
  'use strict';
  function Controller($cookies, $state, $rootScope, efficiencyService, $filter) {
    var vm = this;

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
    }
  }
  Controller.$inject = ['$cookies', '$state', '$rootScope', 'efficiencyService', '$filter'];
  return Controller;
});