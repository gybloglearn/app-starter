define([], function () {
  'use strict';
  function Controller($cookies, $state, $rootScope, modulserviceService) {
    var vm = this;
    vm.egyedi = [];
    vm.data = [];
    vm.code = '';
    vm.check = check;
    vm.beviheto = false;
    var code_part;
    vm.load = load;
    vm.create_code = create_code;

    function load(code) {
      vm.dis = true;
      vm.data = [];
      modulserviceService.get(code).then(function (response) {
        vm.data = response.data;
        vm.dis = false;
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      modulserviceService.getpartnumber().then(function (response) {
        vm.egyedi = response.data;
      });
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


    function create_code() {
      var new_code = '99' + vm.part + code_part;
      vm.load(new_code);
    }
  }
  Controller.$inject = ['$cookies', '$state', '$rootScope', 'modulserviceService'];
  return Controller;
});
