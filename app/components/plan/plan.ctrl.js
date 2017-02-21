define([], function () {
  'use strict';
  function Controller(planService, $timeout, $filter, $cookies, $state, $rootScope) {
    var vm = this;
    vm.data = [];
    vm.show = show;
    vm.save = save;
    vm.load = load;
    vm.updateplan=updateplan;
    vm.mutat = false;
    vm.showmessage = false;
    vm.sheetmakers = ["SheetMaker1", "SheetMaker2", "SheetMaker4", "SheetMaker5", "SheetMaker6", "SheetMaker7", "SheetMaker8", "SheetMaker9"];
    vm.act = "SheetMaker4";
    vm.today = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.moduls = [];
    vm.planlist = [];

    function show() {
      vm.datumok = [];
      vm.mezoszam = ((new Date(vm.dateto).getTime() - new Date(vm.datefrom).getTime()) / (1000 * 3600 * 24)) + 1;
      vm.mutat = true;
      vm.data = [];
      for (var i = 0; i < vm.mezoszam; i++) {
        vm.datumok[i] = new Date(vm.datefrom).getTime() + (i * 24 * 3600 * 1000);
        vm.datumok[i] = $filter('date')(vm.datumok[i], 'yyyy-MM-dd');
        vm.data.push({
          "date": vm.datumok[i],
          "id": vm.act,
          "type": vm.acttype,
          "sheetnumber": $filter('filter')(vm.moduls, { 'name': vm.acttype })[0].sheets,
          "amountshift1": vm.darab,
          "amountshift2": vm.darab,
          "amountshift3": vm.darab,
        });
      }
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

    function load() {
      planService.getAll().then(function (response) {
        var res = [];
        angular.forEach(response.data, function(v){
          var d = new Date(v.date).getTime();
          var now = new Date().getTime()-24*3600*1000;
          if(d >= now){
            res.push(v);
          }
        });
        vm.planlist = res;
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      if ($rootScope.user.username != "212434909" && $rootScope.user.username != "502678184" && $rootScope.user.username != "113010451" && $rootScope.user.username != "212422533") {
        $state.go('Forbidden');
      }
      vm.datefrom = new Date().getTime();
      vm.sdate = new Date().getTime();
      vm.dateto = $filter('date')(vm.datefrom + 7 * 24 * 3600 * 1000, 'yyyy-MM-dd');
      vm.datefrom = $filter('date')(vm.datefrom, 'yyyy-MM-dd');
      planService.getpartnumber().then(function (response) {
        vm.moduls = response.data;
      });
      load();
    }

     function updateplan() {
       planService.put(vm.edit).then(function (resp) {
        vm.edit = '';
      });
    }
  }
  Controller.$inject = ['planService', '$timeout', '$filter', '$cookies', '$state', '$rootScope'];
  return Controller;
});