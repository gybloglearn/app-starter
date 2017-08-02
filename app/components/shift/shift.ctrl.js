define([], function () {
  'use strict';
  function Controller(updateService, $timeout, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.show = show;
    vm.save = save;
    vm.load = load;
    vm.remove=remove;

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
          "numbera": vm.darab,
          "numberb": vm.darab,
          "numberc": vm.darab,
          "numberd": vm.darab,
        });
      }
    }

    function savedata(i) {
      updateService.postshift(vm.data[i]).then(function (reponse) {
        i++;
        if (i < vm.data.length) {
          savedata(i);
        }
      });
      load();
    }

    function save() {

      var i = 0;
      var b = vm.data.length;
      savedata(i);
    }

    function load() {
      updateService.getAllshift().then(function (response) {
        var res = [];
        angular.forEach(response.data, function (v) {
          var d = new Date(v.date).getTime();
          var now = new Date().getTime() - 24 * 3600 * 1000;
          if (d >= now) {
            res.push(v);
          }
        });
        vm.shiftlist = res;
      });
    }

    function remove(id, index) {
      updateService.eraseshift(id).then(function (resp) {
        vm.tmklist.splice(index, 1);
      });
      load();
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
  Controller.$inject = ['updateService', '$timeout', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
