define([], function () {
  'use strict';
  function Controller(RewinderService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.datum=$filter('date')(new Date(), 'yyyy-MM-dd');
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.rw1data=[];
    vm.uniquerw1=[];
    vm.selectdata=[];
    vm.detailsdata=[];
    vm.actmch="";
    vm.actshift="";
    vm.load=load;
    vm.loaddetails=loaddetails;
    vm.beallit=beallit;

    function beallit() {
      vm.datumszam = $filter('date')(new Date(vm.datum), 'yyyy-MM-dd');
    }

    function load(){
      vm.actmch="";
      vm.actshift="";
      vm.rw1data=[];
      vm.uniquerw1=[];
      vm.selectdata=[];
      vm.loading1=true;
      RewinderService.getrw1(vm.datum).then(function (response) {
        vm.rw1data=response.data;
        vm.uniquerw1=$filter('unique')(vm.rw1data,'MachineName');
        for(var i=0;i<vm.uniquerw1.length;i++){
          var obj={};
          obj={
            nev:vm.uniquerw1[i].MachineName,
            meternappal:0,
            cnappal:0,
            meterejszaka:0,
            cejszaka:0,
            meternapi:0,
            cnapi:0,
          }
          vm.selectdata.push(obj);
        }
        for(var i=0;i<vm.selectdata.length;i++){
          for(var j=0;j<vm.rw1data.length;j++){
            if(vm.selectdata[i].nev==vm.rw1data[j].MachineName && vm.rw1data[j].ShiftNum=="1"){
              vm.selectdata[i].meternappal+=vm.rw1data[j].ProducedLength*1;
              vm.selectdata[i].cnappal+=vm.rw1data[j].P_Count*1;
              vm.selectdata[i].meternapi+=vm.rw1data[j].ProducedLength*1;
              vm.selectdata[i].cnapi+=vm.rw1data[j].P_Count*1;
            }
            else if(vm.selectdata[i].nev==vm.rw1data[j].MachineName && vm.rw1data[j].ShiftNum=="3"){
              vm.selectdata[i].meterejszaka+=vm.rw1data[j].ProducedLength*1;
              vm.selectdata[i].cejszaka+=vm.rw1data[j].P_Count*1;
              vm.selectdata[i].meternapi+=vm.rw1data[j].ProducedLength*1;
              vm.selectdata[i].cnapi+=vm.rw1data[j].P_Count*1;
            }
          }
        }
        vm.loading1=false;
      });
    }

    function loaddetails(){
      vm.detailsdata=[];
      vm.loading2=true;
      RewinderService.getrw2(vm.datum,vm.actmch,vm.actshift).then(function (response) {
        vm.detailsdata=response.data;
        vm.loading2=false;
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.edate=$filter('date')(new Date(), 'yyyy-MM-dd');
      load();
    }
  }
  Controller.$inject = ['RewinderService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
