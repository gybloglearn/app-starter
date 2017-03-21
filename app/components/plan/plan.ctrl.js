define([], function () {
  'use strict';
  function Controller(planService, $timeout, $cookies, $state, $rootScope, $filter) {
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
          "projectname": vm.projectname,
          "type": vm.type,
          "amountshift1": vm.darab,
          "amountshift2": vm.darab,
          "amountshift3": vm.darab,
          "description": vm.description,
          "attempt": vm.attempt,
          "whogo": vm.whogo,
          "where": vm.where,
          "period": vm.period,
          "person": vm.person,
        });
      }
    }

    function load() {
      planService.getAll().then(function (response) {
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

        planService.post(vm.data[i]).then(function (response) {
          vm.showmessage = true;
          vm.data = {};
        });
      }
      $timeout(function () {
        vm.showmessage = false;
      }, 5000);
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      if ($rootScope.user.username != "212434909" && $rootScope.user.username != "502678184" && $rootScope.user.username != "212597831" && $rootScope.user.username != "212422533") {
        $state.go('Forbidden');
      }
      vm.datefrom = new Date().getTime();
      // vm.sdate = new Date().getTime();
      vm.dateto = $filter('date')(vm.datefrom + 7 * 24 * 3600 * 1000, 'yyyy-MM-dd');
      vm.datefrom = $filter('date')(vm.datefrom, 'yyyy-MM-dd');
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

  }
  Controller.$inject = ['planService', '$timeout', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
