define([], function () {
  'use strict';
  function Controller(updateService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.show = show;
    vm.load = load;
    vm.save = save;
    vm.remove = remove;
    vm.sheetmakers = ["SheetMaker1", "SheetMaker2", "SheetMaker4", "SheetMaker5", "SheetMaker6", "SheetMaker7", "SheetMaker8", "SheetMaker9"];
    vm.hours = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
    vm.moduls = [];
    vm.actsm = "SheetMaker1";
    vm.acthour = "8";
    vm.actproduct = "";

    function show() {

      vm.mutat = true;
      vm.data = [];

      vm.data.push({
        "id": vm.id = new Date().getTime(),
        "sm": vm.actsm,
        "nextdate": vm.datefrom + " " + vm.acthour + ":00",
        "nextproduct": vm.actproduct,
      });
    }

    function save() {
      updateService.posttype(vm.data[0]).then(function (response) {
      });
    }

    function load() {
      updateService.getAlltype().then(function (response) {
        var res = [];
        angular.forEach(response.data, function (v) {
          var d = new Date(v.nextdate).getTime();
          var now = new Date().getTime() - 24 * 3600 * 1000;
          if (d >= now) {
            res.push(v);
          }
        });
        vm.typelist = res;
      });
    }

    function remove(id, index) {
      updateService.erasetype(id).then(function (resp) {
        vm.typelist.splice(index, 1);
      });

    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));

      vm.sdate = new Date().getTime();
      vm.datefrom = $filter('date')(vm.sdate, 'yyyy-MM-dd');
      updateService.getpartnumber().then(function (response) {
        vm.moduls = response.data;
      });
      load();
    }
  }
  Controller.$inject = ['updateService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
