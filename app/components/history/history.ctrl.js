define([], function () {
  'use strict';
  function Controller(historyService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    var datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    var code_part;
    vm.beviheto=false;
    vm.code = '';
    vm.partnumbers = [];
    vm.moduldata = [];
    vm.create_code = create_code;
    vm.load = load;
    vm.check = check;
    vm.loading = false;

    function create_code() {
      var new_code = '99' + vm.part + code_part;
      vm.code = new_code;
      vm.load(new_code);
    }

    function check(input) {
      if (input.length == 10 && isFinite(input)) {
        vm.beviheto = true;
      }
      else {
        vm.beviheto = false;
      }
      if (vm.beviheto == true) {
        code_part = vm.valid;
      }
    }

    function load(code) {
      vm.loading = true;
      vm.moduldata = [];
       historyService.getmodul(datum, code).then(function (response) {
        vm.moduldata = response.data;
        console.log(vm.moduldata);
        vm.loading = false;
      });
    }

    function loadPartnumber() {
      historyService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadPartnumber();
    }
  }
  Controller.$inject = ['historyService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
