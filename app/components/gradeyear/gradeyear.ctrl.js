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

        for (var i = 0; i < vm.list.length; i++) {
          var actname = vm.list[i].ModulType;
          var actyear = vm.list[i].év;
          var actmonth = vm.list[i].hónap;
          var actgrade = vm.list[i].grade;
          var actdb = vm.list[i].db;

          for (var j = 0; j < vm.datas.length; j++) {
            if (vm.datas[j].name == actname && vm.datas[j].year == actyear && vm.datas[j].month == actmonth) {
              if (actgrade == "A+") {
                vm.datas[j].Aplus = vm.datas[j].Aplus + actdb;
                vm.datas[j].sum = vm.datas[j].sum + actdb;
              }
              else if (actgrade == "A-") {
                vm.datas[j].Aminus = vm.datas[j].Aminus + actdb;
                vm.datas[j].sum = vm.datas[j].sum + actdb;
              }
              else if (actgrade == "B") {
                vm.datas[j].B = vm.datas[j].B + actdb;
                vm.datas[j].sum = vm.datas[j].sum + actdb;
              }
              else if (actgrade == "Scrap") {
                vm.datas[j].Scrap = vm.datas[j].Scrap + actdb;
                vm.datas[j].sum = vm.datas[j].sum + actdb;
              }
              talalat++;
            }
          }
          if (talalat > 0) {
            talalat = 0;
            a = a;
          }
          else {
            vm.datas[a] = {}
            vm.datas[a].name = actname;
            vm.datas[a].year = actyear;
            vm.datas[a].month = actmonth;
            vm.datas[a].Aplus = 0;
            vm.datas[a].Aminus = 0;
            vm.datas[a].B = 0;
            vm.datas[a].Scrap = 0;
            vm.datas[a].sum = 0;
            if (actgrade == "A+") {
              vm.datas[a].Aplus = vm.datas[a].Aplus + actdb;
            }
            else if (actgrade == "A-") {
              vm.datas[a].Aminus = vm.datas[a].Aminus + actdb;
            }
            else if (actgrade == "B") {
              vm.datas[a].B = vm.datas[a].B + actdb;
            }
            else if (actgrade == "Scrap") {
              vm.datas[a].Scrap = vm.datas[a].Scrap + actdb;
            }
            vm.datas[a].sum = vm.datas[a].sum + actdb;
            a++
          }
        }

        //console.log(vm.datas);
        //console.log(vm.list);
        vm.gradechartconfig = {
          chart: {
            type: 'column',
          },
          plotOptions: {
            column: {
              stacking: 'normal'
            }
          },
          title: { text: "Darab arányok" },
          series: [
            {
              name: 'Scrap',
              color: "#ff0000",
              data: feltolt_x_Scrap(vm.datas),
              stack: 'Darab'
            },
            {
              name: 'A-',
              color: "#ff9900",
              data: feltolt_x_Aminus(vm.datas),
              stack: 'Darab'
            },
            {
              name: 'B',
              color: "#ff9900",
              data: feltolt_x_B(vm.datas),
              stack: 'Darab'
            },
            {
              name: 'A+',
              color: "#00cc00",
              data: feltolt_x_Aplus(vm.datas),
              stack: 'Darab'
            }
          ],
          xAxis: [
            {
              categories: feltolt_x_name(vm.datas),
              title: { text: "Év-hónap" }
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
      update_year();
    }

    function feltolt_x_Aplus(tomb) {
      var x_adatok = [];
      for (var i = 0; i < tomb.length; i++) {
        x_adatok[i] = tomb[i].Aplus;
      }
      return x_adatok;
    }
    function feltolt_x_Aminus(tomb) {
      var x_adatok = [];
      for (var i = 0; i < tomb.length; i++) {
        x_adatok[i] = tomb[i].Aminus;
      }
      return x_adatok;
    }
    function feltolt_x_B(tomb) {
      var x_adatok = [];
      for (var i = 0; i < tomb.length; i++) {
        x_adatok[i] = tomb[i].B;
      }
      return x_adatok;
    }
    function feltolt_x_Scrap(tomb) {
      var x_adatok = [];
      for (var i = 0; i < tomb.length; i++) {
        x_adatok[i] = tomb[i].Scrap;
      }
      return x_adatok;
    }
    function feltolt_x_name(tomb) {
      var x_adatok = [];
      for (var i = 0; i < tomb.length; i++) {
        x_adatok[i] = tomb[i].name + "-" + tomb[i].year + "-" + tomb[i].month;
      }
      return x_adatok;
    }
  }
  Controller.$inject = ['gradeyearService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
