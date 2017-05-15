define([], function () {
  'use strict';
  function Controller(SumserviceService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.selectdatas = [];
    vm.mch = "Potting4"
    vm.pottings = ["Potting3", "Potting4"];
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.startdate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.load = load;
    vm.beallit=beallit;

    function beallit(){
      vm.enddate= $filter('date')(new Date(vm.datum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      vm.startdate= $filter('date')(new Date(vm.datum).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      vm.datumszam=vm.datum;
    }

    function load() {
      createdatenumber();

      vm.dis = true;
      vm.data = [];
      vm.selectdatas = [];
      for(var i=0;i<3;i++){
      vm.selectdatas[i] = {}
      vm.selectdatas[i].SHIFT = $filter('shift')(i+1, vm.datum)+" ";
      vm.selectdatas[i].GEL_PREP = 0;
      vm.selectdatas[i].URET_PREP_A = 0;
      vm.selectdatas[i].POST_URET_A = 0;
      vm.selectdatas[i].ROT = 0;
      vm.selectdatas[i].URET_PREP_F = 0;
      vm.selectdatas[i].POST_URET_F = 0;
      }

      SumserviceService.get(vm.startdate, vm.enddate, vm.mch).then(function (response) {
        vm.data = response.data;
        vm.dis = false;
        for(var i=0;i<vm.data.length;i++){
          for(var j=0;j<vm.selectdatas.length;j++){
            if(vm.selectdatas[j].SHIFT==vm.data[i].PT_GEL_PREP_S && (new Date(vm.data[i].PT_GEL_PREP_DT).getTime()<vm.vege) && (new Date(vm.data[i].PT_GEL_PREP_DT).getTime()>=vm.kezdo)){
              vm.selectdatas[j].GEL_PREP++;
            }
            if(vm.selectdatas[j].SHIFT==vm.data[i].PT_URET_PREP_A_S && (new Date(vm.data[i].PT_URET_PREP_A_DT).getTime()<vm.vege) && (new Date(vm.data[i].PT_URET_PREP_A_DT).getTime()>=vm.kezdo)){
              vm.selectdatas[j].URET_PREP_A++;
            }
            if(vm.selectdatas[j].SHIFT==vm.data[i].PT_POST_URET_A_S && (new Date(vm.data[i].PT_POST_URET_A_DT).getTime()<vm.vege) && (new Date(vm.data[i].PT_POST_URET_A_DT).getTime()>=vm.kezdo)){
              vm.selectdatas[j].POST_URET_A++;
            }
            if(vm.selectdatas[j].SHIFT==vm.data[i].PT_ROT_S && (new Date(vm.data[i].PT_ROT_DT).getTime()<vm.vege) && (new Date(vm.data[i].PT_ROT_DT).getTime()>=vm.kezdo)){
              vm.selectdatas[j].ROT++;
            }
            if(vm.selectdatas[j].SHIFT==vm.data[i].PT_URET_PREP_F_S && (new Date(vm.data[i].PT_URET_PREP_F_DT).getTime()<vm.vege) && (new Date(vm.data[i].PT_URET_PREP_F_DT).getTime()>=vm.kezdo)){
              vm.selectdatas[j].URET_PREP_F++;
            }
            if(vm.selectdatas[j].SHIFT==vm.data[i].PT_POST_URET_F_S && (new Date(vm.data[i].PT_POST_URET_F_DT).getTime()<vm.vege) && (new Date(vm.data[i].PT_POST_URET_F_DT).getTime()>=vm.kezdo)){
              vm.selectdatas[j].POST_URET_F++;
            }
          }
        }
        console.log(vm.selectdatas);
      });
    }

    function createdatenumber(){
      var year=new Date(vm.datum).getFullYear();
      var month=new Date(vm.datum).getMonth()+1;
      var day=new Date(vm.datum).getDate();
      var kezdo=year+"-0"+month+"-"+day+" 05:50:00";
      var vege=year+"-0"+month+"-"+(day+1)+" 05:50:00";
      vm.kezdo=new Date(kezdo).getTime();
      vm.vege=new Date(vege).getTime();
    }


    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['SumserviceService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
