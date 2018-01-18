define([], function () {
  'use strict';
  function Controller(planService, $timeout, $filter, $cookies, $state, $rootScope) {
    var vm = this;
    vm.data = [];
    vm.show = show;
    vm.save = save;
    vm.load = load;
    vm.updateplan = updateplan;
    vm.remove = remove;
    vm.reloadwebpage = reloadwebpage;
    vm.mutat = false;
    vm.showmessage = false;
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.today = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.moduls = [];
    vm.planlist = [];

    function show() {
      vm.mutat = true;
      vm.data = [];
      for (var i = 0; i < vm.sheetmakers.length; i++) {
        vm.data.push({
          "id": vm.id = new Date().getTime() + i,
          "sm": vm.sheetmakers[i],
          "amount": vm.darab,
        });
      }
    }

    function save() {
      //for (var i = 0; i < vm.data.length; i++) {
        planService.post(vm.data).then(function (response) {
          vm.showmessage = true;
          vm.data = {};
        });
      //}
      $timeout(function () {
        vm.showmessage = false;
      }, 5000);
    }

    function load() {
      planService.getAll().then(function (response) {
        vm.planlist = response.data;
        console.log(vm.planlist);
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      if ($rootScope.user.username != "212434909" && $rootScope.user.username != "502678184" && $rootScope.user.username != "113010451" && $rootScope.user.username != "212422533") {
        $state.go('Forbidden');
      }
      load();
    }

    function updateplan() {
      planService.put(vm.edit).then(function (resp) {
        vm.edit = '';
      });
    }

    function remove(id, index) {
      planService.erase(id).then(function (resp) {
        vm.planlist.splice(index, 1);
      });

    }

    function reloadwebpage() {
      $state.go('plan', { reload: true });
    }
  }
  Controller.$inject = ['planService', '$timeout', '$filter', '$cookies', '$state', '$rootScope'];
  return Controller;
});