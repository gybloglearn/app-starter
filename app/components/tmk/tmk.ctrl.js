define([], function () {
  'use strict';
  function Controller(updateService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.show = show;
    vm.save = save;
    vm.load = load;
    vm.remove = remove;
    vm.sheetmakers = ["SheetMaker1", "SheetMaker2", "SheetMaker4", "SheetMaker5", "SheetMaker6", "SheetMaker7", "SheetMaker8", "SheetMaker9"];
    vm.actsm = "Sheetmaker1";

    function show() {

      vm.mutat = true;
      vm.data = [];

      vm.data.push({
        "id": vm.id = new Date().getTime(),
        "sm": vm.actsm,
        "lastdate": vm.datefrom,
        "nextdate": vm.dateto,
      });
    }

    function save() {
      updateService.posttmk(vm.data[0]).then(function (response) {
        vm.showmessage = true;
      });
    }

    function load() {
      updateService.getAlltmk().then(function (response) {
        var res = [];
        angular.forEach(response.data, function (v) {
          var d = new Date(v.nextdate).getTime();
          var now = new Date().getTime() - 24 * 3600 * 1000;
          if (d >= now) {
            res.push(v);
          }
        });
        vm.tmklist = res;
      });
    }

    function remove(id, index) {
      updateService.erasetmk(id).then(function (resp) {
        vm.tmklist.splice(index, 1);
      });

    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));

      vm.sdate = new Date().getTime();
      vm.dateto = $filter('date')(vm.sdate + 7 * 24 * 3600 * 1000, 'yyyy-MM-dd');
      vm.datefrom = $filter('date')(vm.sdate, 'yyyy-MM-dd');
      load();
    }
  }
  Controller.$inject = ['updateService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
