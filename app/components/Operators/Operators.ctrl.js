define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter, $http) {
    var vm = this;
    vm.operators = [];
    vm.OP = [];
    vm.data = [];
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.actmachine = "Potting4";
    vm.phasenumbers = [0, 1, 2, 3, 4, 5, 6, 7];
    vm.Pottings = ["Potting3", "Potting4"];
    vm.hely = ["Potting be", "Előkészítés alsó", "Gélberakás alsó", "Esztétika alsó", "Forgatás", "Gélberakás felső", "Esztétika felső", "Potting ki"];
    vm.szakok = [1, 2, 3]
    vm.load = load;
    vm.beallit = beallit;
    vm.actshiftnum = 1;
    vm.switchdate = new Date('2017-09-01').getTime();

    function beallit() {
      vm.datumszam = $filter('date')(new Date(vm.datum).getTime(), 'yyyy-MM-dd');
    }
    function loadops(){
    vm.ops = [];
    $http({ method: 'GET', url: "app/components/Operators/ops.json" }).
      success(function (data, status) {
        vm.ops = data;
      }).
      error(function (data, status) {
        console.log(data || "Request failed");
      });
    }
    function load() {
      vm.dis = true;
      vm.datas = [];
      angular.forEach(vm.Pottings, function(p, i){
        angular.forEach(vm.phasenumbers, function(n, j){
          dataService.get(vm.datum, p, n).
          success(function(response, status){
            for(var k=0;k<response.length;k++){
              response[k].mch = p;
              response[k].pha = vm.hely[n];
              vm.datas.push(response[k]);
            }
            if(i*j==7){
              //console.log(vm.datas);
              vm.dis = false;
            }
          }).
          error(function(data, status){
            console.log(data || "Request failed");
          });
        });
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadops();
      load();
    }

  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter', '$http'];
  return Controller;
});
