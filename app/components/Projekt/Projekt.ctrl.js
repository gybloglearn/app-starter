define([], function () {
  'use strict';
  function Controller($cookies, $state, $rootScope,$stateParams) {
    var vm = this;
    vm.project={};

    activate();
    function activate() {
      (!$cookies.getObject('user')?$state.go('login'):$rootScope.user=$cookies.getObject('user'));
      if($stateParams.project)
      {
        vm.project=$stateParams.project;
      }
      else
      {
        $state.go("start");
      }
    }

  }
  Controller.$inject = ['$cookies', '$state', '$rootScope','$stateParams'];
  return Controller;
});
