define([], function () {
  'use strict';
  function Controller(downloadService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.type = ["ETF", "Gradeing"];
    vm.times = ["nap", "hét", "hónap", "negyedév", "év"];
    vm.data = [];
    vm.startdate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.acttime = "nap";
    vm.acttype = "ETF";
    vm.load = load;

    function load() {
      vm.data = [];
      vm.dis = true;
      vm.QCloading = true;

      downloadService.get(vm.startdate, vm.enddate, vm.acttype, vm.acttime).then(function (response) {
        vm.data = response.data;
        vm.dis = false;
        vm.QCloading = false;

        vm.QCchartconfig = {
          chart: {
            type: 'column',
          },
          plotOptions: {
            column: {
              stacking: 'normal'
            }
          },
          title: { text: "Valami" },
          series: [
            {
              name: 'Scrap',
              color: "#ff0000",
              data: feltolt_Scrap(vm.data),
              stack: 'Összes címke'
            },
            {
              name: 'Not graded',
              color: "#660066",
              data: feltolt_Not_graded(vm.data),
              stack: 'Összes címke'
            },
            {
              name: 'B',
              color: "#ff9900",
              data: feltolt_B(vm.data),
              stack: 'Összes címke'
            },
            {
              name: 'A+',
              color: "#00cc00",
              data: feltolt_A(vm.data),
              stack: 'Összes címke'
            }
          ],
          xAxis: [
            {
              categories: feltolt_x_datum(vm.data),
              title: { text: "Dátum" }
            },
          ],
          yAxis: {
            title: {
              text: "Darab"
            }
          },
        }
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
    }

    function feltolt_Scrap(tomb){
      var x_scrap=[];

      for(var i=0;i<tomb.length;i++){
        if(tomb[i].Label=="Scrap"){
          x_scrap.push(tomb[i].Value);
        }
      }
      return x_scrap;
    }

    function feltolt_Not_graded(tomb){
      var x_ngraded=[];

      for(var i=0;i<tomb.length;i++){
        if(tomb[i].Label=="Not graded"){
          x_ngraded.push(tomb[i].Value);
        }
      }
      return x_ngraded;
    }

    function feltolt_B(tomb){
      var x_B=[];

      for(var i=0;i<tomb.length;i++){
        if(tomb[i].Label=="B"){
          x_B.push(tomb[i].Value);
        }
      }
      return x_B;
    }

    function feltolt_A(tomb){
      var x_A=[];

      for(var i=0;i<tomb.length;i++){
        if(tomb[i].Label=="A+"){
          x_A.push(tomb[i].Value);
        }
      }
      return x_A;
    }

    function feltolt_x_datum(tomb){
      var x_datum=[];
      var talalat=0;
      var a=0;
      var act="";
      for(var i=0;i<tomb.length;i++){
        act=tomb[i].Date;
        console.log(tomb[i].Date);
        for(var j=0;j<x_datum.length;j++){
          if(act==x_datum[j]){
            talalat++;
          }
        }
        if(talalat==0){
          x_datum.push(act);
        }
        else{
          talalat=0;
        }
      }
      return x_datum;
    }
  }
  Controller.$inject = ['downloadService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
