define([], function () {
  'use strict';
  function Controller(planserviceService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.planlist = [];
    vm.show = show;
    vm.save = save;
    vm.load = load;
    vm.updateplan = updateplan;
    vm.remove = remove;
    vm.mutat = false;

    function show() {
      vm.datumok = [];
      vm.mezoszam = ((new Date(vm.dateto).getTime() - new Date(vm.datefrom).getTime()) / (1000 * 3600 * 24)) + 1;
      vm.mutat = true;
      vm.data = [];
      for (var i = 0; i < vm.mezoszam; i++) {
        vm.datumok[i] = new Date(vm.datefrom).getTime() + (i * 24 * 3600 * 1000);
        vm.datumok[i] = $filter('date')(vm.datumok[i], 'yyyy-MM-dd');
        vm.data.push({
          "id": vm.id = new Date().getTime() + i,
          "date": vm.datumok[i],
          "circle": vm.circle,
          "value": vm.value,
        });
      }
    }

    function load() {
      planserviceService.getAll().then(function (response) {
        var res = [];
        angular.forEach(response.data, function (v) {
          var d = new Date(v.date).getTime();
          var now = new Date().getTime() - 24 * 3600 * 1000;
          if (d >= now) {
            res.push(v);
          }
        });
        vm.planlist = res;
      });
    }

    function save() {
      for (var i = 0; i < vm.data.length; i++) {
        planserviceService.post(vm.data[i]).then(function (response) {
          vm.data = {};
        });
      }
    }

    function updateplan() {
      planserviceService.put(vm.edit).then(function (resp) {
        vm.edit = '';
      });
    }

    function remove(id, index) {
       planserviceService.erase(id).then(function (resp) {
        vm.planlist.splice(index, 1);
      });
    }

    function reloadwebpage()
    {
       $state.go('Plan', {reload: true});
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.sdate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    }
  }
  Controller.$inject = ['planserviceService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
