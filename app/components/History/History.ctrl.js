define([], function () {
  'use strict';
  function Controller(historyService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.moduldata = [];
    vm.actphase = "Grade Date";
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    var code_part;
    vm.beviheto = false;
    vm.part = "";
    vm.valid = "";
    vm.create_code = create_code;
    vm.check = check;
    vm.loading = false;
    vm.tablesave = tablesave;

    function create_code() {
      var new_code = '99' + vm.part + code_part;
      vm.code = new_code;
      load(new_code);
    }

    function check(input) {
      if (input.length == 10 && isFinite(input)) {
        vm.beviheto = true;
      }
      else {
        vm.beviheto = false;
      }
      if (vm.beviheto == true) {
        code_part = vm.valid;
      }
    }

    function load(code) {
      vm.loading = true;
      vm.moduldata = [];
      historyService.getmodul(vm.datum, code, vm.actphase).then(function (response) {
        vm.moduldata = response.data;
        vm.d = [];

        for (var property in vm.moduldata[0]) {
          if (vm.moduldata[0].hasOwnProperty(property)) {
            vm.d.push({ "name": property, "value": vm.moduldata[0][property] });
          }
        }
        console.log(vm.moduldata);
        vm.loading = false;
      });
    }

    function tablesave() {
      var doc = new jsPDF('p', 'pt', 'a4', true);
      var specialElementHandlers = {
        'exportTable': function (element, renderer) {
          return true;
        }
      };


      doc.fromHTML($('#exportTable').get(0), 15, 15, {
        'width': 250,
        'margin':1,
        'pagesplit': true,
        'elementHandlers': specialElementHandlers
      });
      doc.save(vm.code + '.pdf');

    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      //load("9931576511000001785")
    }

    vm.moduls = [
      { Label: "ZW1500-RL,600", Values: 3147303 },
      { Label: "MODULE,ZW1500,CLAMP", Values: 3157651 },
      { Label: "ZW1500 RMS adapteres", Values: 3157805 },
      { Label: "MODULE,ZW1500X,CLAMP", Values: 3157806 },
      { Label: "Module ZW 1500 X RMS", Values: 3161831 },

    ];
  }
  Controller.$inject = ['historyService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
