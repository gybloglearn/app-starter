define([], function () {
  'use strict';
  function Controller($cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.data = [];
    vm.diff = datediff;
    //vm.tablesave = tablesave;

    function datediff() {
      vm.differencedate = 0;
      vm.dates = [];
      vm.data = [];

      vm.differencedate = (new Date(vm.enddate).getTime() - new Date(vm.startdate).getTime()) / (24 * 3600 * 1000);
      for (var i = 0; i <= vm.differencedate; i++) {
        vm.dates[i] = $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.data[i] = {}
        vm.data[i].date = $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.data[i].client = $filter('client')(1, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        vm.data[i].doctor = $filter('doctor')(1, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        var zwdeszak = $filter('shift12')(1, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        var zwejszak = $filter('shift12')(3, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        var fmdeszak = $filter('shiftfm')(1, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        var fmduszak = $filter('shiftfm')(2, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));
        var fmejszak = $filter('shiftfm')(3, $filter('date')(new Date(vm.enddate).getTime() - ((vm.differencedate - i) * 24 * 3600 * 1000), 'yyyy-MM-dd'));

        if (zwdeszak == "A") {
          vm.data[i].zwa = "Nappal";
          vm.data[i].zwb = "Pihenő";
          vm.data[i].zwc = "Pihenő";
        }
        else if (zwdeszak == "B") {
          vm.data[i].zwb = "Nappal";
          vm.data[i].zwa = "Pihenő";
          vm.data[i].zwd = "Pihenő";
        }
        else if (zwdeszak == "C") {
          vm.data[i].zwc = "Nappal";
          vm.data[i].zwa = "Pihenő";
          vm.data[i].zwd = "Pihenő";
        }
        else if (zwdeszak == "D") {
          vm.data[i].zwd = "Nappal";
          vm.data[i].zwb = "Pihenő";
          vm.data[i].zwc = "Pihenő";
        }

        if (zwejszak == "A") {
          vm.data[i].zwa = "Éjszaka";
        }
        else if (zwejszak == "B") {
          vm.data[i].zwb = "Éjszaka";
        }
        else if (zwejszak == "C") {
          vm.data[i].zwc = "Éjszaka";
        }
        else if (zwejszak == "D") {
          vm.data[i].zwd = "Éjszaka";
        }

        if (fmdeszak == "A") {
          vm.data[i].fma = "Délelőtt";
        }
        else if (fmdeszak == "B") {
          vm.data[i].fmb = "Délelőtt";
        }
        else if (fmdeszak == "C") {
          vm.data[i].fmc = "Délelőtt";
        }

        if (fmduszak == "A") {
          vm.data[i].fma = "Délután";
        }
        else if (fmduszak == "B") {
          vm.data[i].fmb = "Délután";
        }
        else if (fmduszak == "C") {
          vm.data[i].fmc = "Délután";
        }

        if (fmejszak == "A") {
          vm.data[i].fma = "Éjszaka";
        }
        else if (fmejszak == "B") {
          vm.data[i].fmb = "Éjszaka";
        }
        else if (fmejszak == "C") {
          vm.data[i].fmc = "Éjszaka";
        }
        if (fmdeszak == "Pihenő") {
          vm.data[i].fma = "Pihenő";
          vm.data[i].fmb = "Pihenő";
          vm.data[i].fmc = "Pihenő";
        }

      }
      console.log(vm.data);
      console.log(vm.dates);
    }

    /*function tablesave() {
      var doc = new jsPDF('l', 'pt', 'a4', true);
      var specialElementHandlers = {
        'exportTable': function (element, renderer) {
          return true;
        }
      };

      doc.fromHTML($('#exportTable').html(), 15, 15, {
        'width': 200,
        'elementHandlers': specialElementHandlers
      });
      doc.save(vm.startdate + '-' + vm.enddate + '.pdf');
    }*/
    


      activate();

      function activate() {
        (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      }
    }
    Controller.$inject = ['$cookies', '$state', '$rootScope', '$filter'];
    return Controller;
  });
