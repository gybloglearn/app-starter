define([], function () {
  'use strict';
  function Controller(planService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.amount = 0;
    vm.aeq = 0;
    vm.edit="";
    vm.createaeq = createaeq;
    vm.createamount = createamount;
    vm.save = save;
    vm.update=update;
    vm.remove = remove;
    vm.load = load;

    function createaeq(am) {
      vm.aeq = am / 8900;
      vm.amount = am * 1;
    }

    function createamount(aeq) {
      vm.amount = aeq * 8900;
      vm.aeq = aeq * 1;
    }

    function load() {
      planService.get().then(function (response) {
        vm.data = response.data
      });
    }

    function save() {
      var data = [];
      var obj = {};
      obj = {
        "id": new Date().getTime(),
        "amount": vm.amount,
        "aeq": vm.aeq,
        "startdate": vm.startdate,
        "enddate": vm.enddate
      };
      data.push(obj);
      console.log(obj);
      planService.post(data[0]).then(function (resp) {
        data = [];
        vm.amount = 0;
        vm.aeq = 0;
        vm.startdate = $filter('date')(new Date(), 'yyyy-MM-dd');
        vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
      });
      load();
    }

    function update(it){
      console.log(it);
      planService.put(vm.edit).then(function (resp) {
        vm.edit = '';
      });
    }

    function remove(id, index) {
      planService.erase(id).then(function (resp) {
        vm.data.splice(index, 1);
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['planService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
