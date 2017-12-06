define([], function () {
  'use strict';
  function Controller(moduldataService, $cookies, $state, $rootScope, $filter,$stateParams) {
    var vm = this;
    vm.code = '';
    vm.check = check;
    var beviheto = false;
    var code_part;
    vm.load = load;
    vm.create_code = create_code;
    vm.egyedi = [];
    vm.machine = [];
    vm.phase = [];
    vm.loading = false;

    function load(code) {
      vm.loading = true;
      vm.dis = true;
      vm.data = [];
      moduldataService.get(code).then(function (response) {
        vm.data = response.data;
        vm.dis = false;
        vm.machine = $filter('unique')(vm.data, 'machinename');
        vm.phase = $filter('unique')(vm.data, 'phasename');
        vm.loading = false;
      });
    }

    function check(input) {
      if (input.length == 10 && isFinite(input)) {
        beviheto = true;
        vm.in = "Helyes adat";
      }
      else {
        vm.in = "Helytelen adat";
        beviheto = false;
      }
      if (beviheto == true) {
        code_part = vm.valid;
      }
    }


    function create_code() {
      var new_code = '99' + vm.part + code_part;
      vm.code = new_code;
      vm.load(new_code);
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      moduldataService.getpartnumber().then(function (response) {
        vm.egyedi = response.data;
      });
      
      if ($stateParams.modulid) {
        var modid = $stateParams.modulid;
        vm.code = modid;
        vm.part = modid.substr(2, 7);
        vm.valid = modid.substr(9, 18);
        load(modid);
      }

    }
  }
  Controller.$inject = ['moduldataService', '$cookies', '$state', '$rootScope', '$filter','$stateParams'];
  return Controller;
});
