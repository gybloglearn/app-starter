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
    }

    vm.moduls = [
      { Label: "ZW1000 450 sqft CP5", Values: 3033401 },
      { Label: "ZW1000 500 sqft CP5", Values: 3033402 },
      { Label: "ZW1000 600 sqft CP5", Values: 3033403 },
      { Label: "ZW1000 450 sqft CPX", Values: 3096940 },
      { Label: "ZW1000 550 sqft CPX", Values: 3096955 },
      { Label: "ZW1000 450 sqft CPX", Values: 3111328 },
      { Label: "ZW1000 600 sqft CP5", Values: 3111330 },
      { Label: "ZW1000 500 sqft CP5", Values: 3111331 },
      { Label: "ZW1000 550 sqft CPX", Values: 3111332 },
      { Label: "K+F ZW1000 cpx", Values: 3111333 },
      { Label: "ZW1000 500 sqft CP5", Values: 3111334 },
      { Label: "ZW1000 450 sqft CP5", Values: 3111335 },
      { Label: "ZW1000 450 sqft CP5", Values: 3111336 },
      { Label: "ZW1000 600 sqft CP5", Values: 3111337 },
      { Label: "ExpMod.ZW1000CPX700", Values: 3111340 },
      { Label: "zw1000 450", Values: 3111343 },
      { Label: "CPX5501,5open NS", Values: 3111344 },
      { Label: "zw1000 450 új shroud", Values: 3111346 },
      { Label: "ZW 1000 CPX 500", Values: 3111347 },
      { Label: "ZW1000 CPX-SF 500 sqft 0,8/0,47", Values: 3111356 },
      { Label: "ZW1000 CPX-SF 600 sqft 0,8/0,47", Values: 3111357 },
      { Label: "ZW1000-JUNIOR", Values: 3111358 },
      { Label: "ZW1000-JUNIOR", Values: 3111359 },
      { Label: "700 4 bundle", Values: 3146968 },
      { Label: "MODULE,ZW1000,550,GF", Values: 3158157 },
      { Label: "Mod ZW1K CPX 450 BS", Values: 3161866 },
      { Label: "Mod ZW1K CPX 550 BS", Values: 3161890 }
    ];
  }
  Controller.$inject = ['historyService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
