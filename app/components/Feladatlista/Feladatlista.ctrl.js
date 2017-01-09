define([], function () {
  'use strict';
  function Controller($filter, tasksService, $timeout, $cookies, $rootScope, $state, sprintService) {
    var vm = this;
    vm.updatetask = updatetask;
    vm.duplicate = duplicate;
    vm.oldid = null;
    vm.showmessage = false;

    activate();
    vm.task = [];
    vm.sprint = [];
    vm.goodsprint = [];

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      if ($rootScope.user.username != "212434909" && $rootScope.user.username != "502678184") {
        $state.go('Forbidden');
      }
      tasksService.getAll().then(function (resp) {
        vm.task = $filter('filter')(resp.data, { 'status': '!5' });
      });

      sprintService.getAll().then(function (resp) {
        vm.sprint = resp.data;
        putsprint();
      });
    }

    function putsprint() {
      var nowaday = new Date().getTime();
      var j = 0;

      for (var i = 0; i < vm.sprint.length; i++) {
        if (vm.sprint[i].due > nowaday) {
          vm.goodsprint[j] = vm.sprint[i];
          j++;
        }
      }
    }



    function updatetask() {
      tasksService.put(vm.edit).then(function (resp) {
        vm.edit = '';
      });
    }

    function duplicate(item) {
      vm.oldid = item.id;
      item.id = new Date().getTime();
      item.sprint = null;
      tasksService.post(item).then(function (resp) {
        vm.showmessage = true;
        $timeout(function () {
          vm.showmessage = false;
          vm.oldid = null;
          vm.showtitle = '';
          $state.go("Feladatlista", {}, {reload:true});
        }, 5000);
      });
    }


  }
  Controller.$inject = ['$filter', 'tasksService', '$timeout', '$cookies', '$rootScope', '$state', 'sprintService'];
  return Controller;
});