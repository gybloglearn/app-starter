define([], function () {
  'use strict';
  function Controller(gradeyearService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    var firstyear = 2014;
    var actyear = new Date().getFullYear();
    var actmonth = new Date().getMonth();
    vm.years = [];
    vm.list = [];
    vm.datas = [];
    vm.type = "";
    vm.datum = ""
    vm.load = load;

    function update_year() {
      for (var i = actyear; i >= firstyear; i--) {
        vm.years.push(i);
      }
    }

    function load() {
      var a = 0;
      var talalat = 0;
      vm.dis = true;
      vm.gradeloading = true;
      vm.list = [];
      vm.datas = [];
      gradeyearService.get(vm.type, vm.datum).then(function (response) {
        vm.list = response.data;
        vm.dis = false;
        vm.gradeloading = false;
        for (var i = vm.datum; i <= actyear; i++) {
          if (i < actyear) {
            for (var j = 1; j <= 12; j++) {
              vm.datas[a] = {}
              vm.datas[a].year = i;
              vm.datas[a].month = j;
              vm.datas[a].moduls = [];
              a++;
            }
          }
          else {
            for (var k = 1; k <= actmonth + 1; k++) {
              vm.datas[a] = {}
              vm.datas[a].year = i;
              vm.datas[a].month = k;
              vm.datas[a].moduls = [];
              a++;
            }
          }
        }

        for (var i = 0; i < vm.list.length; i++) {
          for (var j = 0; j < vm.datas.length; j++) {
            if (vm.list[i].év == vm.datas[j].year && vm.list[i].hónap == vm.datas[j].month) {
              var actmodul = vm.list[i].ModulType;
              for (var k = 0; k < vm.datas[j].moduls.length; k++) {
                if (vm.datas[j].moduls[k].name == actmodul) {
                  talalat++;
                }
              }
              if (talalat > 0) {
                talalat = 0;
              }
              else{
                vm.datas[j].moduls[k]={}
                vm.datas[j].moduls[k].name=actmodul;
                vm.datas[j].moduls[k].gradespieces=[];
                vm.datas[j].moduls[k].gradespieces[0]={}
                vm.datas[j].moduls[k].gradespieces[0].grade="A+";
                vm.datas[j].moduls[k].gradespieces[0].piece=0;
                vm.datas[j].moduls[k].gradespieces[1]={}
                vm.datas[j].moduls[k].gradespieces[1].grade="A-";
                vm.datas[j].moduls[k].gradespieces[1].piece=0;
                vm.datas[j].moduls[k].gradespieces[2]={}
                vm.datas[j].moduls[k].gradespieces[2].grade="Scrap";
                vm.datas[j].moduls[k].gradespieces[2].piece=0;
              }

            }
          }
        }

        for(var i=0;i<vm.list.length;i++){
          for(var j=0;j<vm.datas.length;j++){
            if (vm.list[i].év == vm.datas[j].year && vm.list[i].hónap == vm.datas[j].month){
              var actmodul = vm.list[i].ModulType;
              var actgrade=vm.list[i].grade;
              var actpiece=vm.list[i].db;
              for (var k = 0; k < vm.datas[j].moduls.length; k++){
                 if (vm.datas[j].moduls[k].name == actmodul){
                   for(var l=0;l<vm.datas[j].moduls[k].gradespieces.length;l++){
                     if(vm.datas[j].moduls[k].gradespieces[l].grade==actgrade){
                       vm.datas[j].moduls[k].gradespieces[l].piece=vm.datas[j].moduls[k].gradespieces[l].piece+actpiece;
                     }
                   }
                 }
              }
            }
          }
        }
        console.log(vm.datas);
        console.log(vm.list);
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      update_year();
    }
  }
  Controller.$inject = ['gradeyearService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
