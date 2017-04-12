define([], function () {
  'use strict';
  function Controller(planService, $timeout, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.planlist = [];
    vm.alleventtype=["újrateszt","kísérlet"];
    vm.eventtype = "újrateszt";
    vm.show = show;
    vm.save = save;
    vm.load = load;
    vm.updatenewtest = updatenewtest;
    vm.updateattempt = updateattempt;
    vm.remove = remove;
    vm.reloadwebpage=reloadwebpage;
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
          "eventtype": vm.eventtype,
          "description": vm.description,
          "projectname": vm.projectname,
          "type": vm.type,
          "amountshift1": vm.darab,
          "amountshift2": vm.darab,
          "amountshift3": vm.darab,
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
      vm.datefrom = new Date().getTime();
      vm.dateto = $filter('date')(vm.datefrom + 7 * 24 * 3600 * 1000, 'yyyy-MM-dd');
      vm.datefrom = $filter('date')(vm.datefrom, 'yyyy-MM-dd');
      load();
      vm.sdate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    }

    function updatenewtest() {
      planService.put(vm.editnewtest).then(function (resp) {
        vm.editnewtest = '';
      });
    }

    function updateattempt() {
      planService.put(vm.editattempt).then(function (resp) {
        vm.editattempt = '';
      });
    }

    function remove(id, index) {
      planService.erase(id).then(function (resp) {
        vm.planlist.splice(index, 1);
      });
    }

    function reloadwebpage()
    {
       $state.go('plan', {reload: true});
    }

  }
  Controller.$inject = ['planService', '$timeout', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
