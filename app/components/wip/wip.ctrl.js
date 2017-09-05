define([], function () {
  'use strict';
  function Controller(wipService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.actstat = "All";
    vm.actpl = "AFT";
    vm.actpu = "Report To ERP";
    vm.allstatus = ["All", "Not Scrap", "Unrestricted NM", "Scrap"];
    vm.allpl = ["AFT","ATD","Bubble Test","Cageing","Chamfer","Drying","FiberGlass","FolderReinforcement","Oven","Packing","Prod Init","Prod Plan","Puffer","QC","RawMaterials","Report to ERP","Rework","Rolling","Shipping","Sizing","Soaking","Trim","Welding","Wet Test","WetBP"];
    vm.allpu = ["Report To ERP", "Shipping"];
    vm.load=load;

    function load() {
      vm.data = [];
      wipService.get(vm.actstat, vm.actpl, vm.actpu).then(function (response) {
        vm.data = response.data;
        console.log(vm.data);
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['wipService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
