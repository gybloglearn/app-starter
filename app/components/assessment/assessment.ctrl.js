define([], function () {
  'use strict';
  function Controller(usersService) {
    var vm = this;
    vm.users = [];
    activate();

    function activate() {
      usersService.get().then(function(response){
        vm.users = response.data;
      });
    }
  }
  Controller.$inject = ['usersService'];
  return Controller;
});