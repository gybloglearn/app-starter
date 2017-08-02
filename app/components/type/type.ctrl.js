define([], function () {
  'use strict';
  function Controller(updateService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.load=load;

    function load() {
      updateService.getAlltype().then(function (response) {
        var res = [];
        angular.forEach(response.data, function (v) {
          var d = new Date(v.nextdate).getTime();
          var now = new Date().getTime() - 24 * 3600 * 1000;
          if (d >= now) {
            res.push(v);
          }
        });
        vm.tmklist = res;
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));

      vm.sdate = new Date().getTime();
      vm.dateto = $filter('date')(vm.sdate + 7 * 24 * 3600 * 1000, 'yyyy-MM-dd');
      vm.datefrom = $filter('date')(vm.sdate, 'yyyy-MM-dd');
      load();
    }
  }
  Controller.$inject = ['updateService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
