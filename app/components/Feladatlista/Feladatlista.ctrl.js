define([], function () {
  'use strict';
  function Controller($filter, tasksService, $cookies, $rootScope, $state, sprintService) {
    var vm = this;
    vm.updatetask = updatetask;

    activate();
    vm.task = [];
    vm.sprint = [];
    vm.goodsprint = [];

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      if ($rootScope.user.username != "212434909" && $rootScope.user.username != "502678184")
      {
        $state.go('Forbidden');
      }
      tasksService.getAll().then(function (resp) {
        vm.task = $filter('filter')(resp.data, {'status': '!5'});
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


  }
  Controller.$inject = ['$filter', 'tasksService', '$cookies', '$rootScope', '$state', 'sprintService'];
  return Controller;
});