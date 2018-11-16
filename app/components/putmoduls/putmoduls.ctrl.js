define([], function () {
  'use strict';
  function Controller(putmodulsService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.loadpositions=loadpositions;
    //$rootScope.loadpositions = loadpositions;

    function loadpositions(){
      vm.data=[];
      putmodulsService.get().then(function (response) {
        vm.data.push($filter('filter')(response.data,{ code: '1', outname: "" }));
        vm.data.push($filter('filter')(response.data,{ code: '2', outname: "" }));
        vm.data.push($filter('filter')(response.data,{ code: '3', outname: "" }));
        vm.data.push($filter('filter')(response.data,{ code: '4', outname: "" }));
        vm.data.push($filter('filter')(response.data,{ code: '5', outname: "" }));
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadpositions();
    }
  }
  Controller.$inject = ['putmodulsService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
