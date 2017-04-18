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
    vm.chartsum = [];
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
      vm.chartsum = [];
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
              else if (actgrade == "A") {
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
            else if (actgrade == "A") {
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

        var ok = 0;
        var b = 0;

        for (var i = 0; i < vm.datas.length; i++) {
          var nowyear = vm.datas[i].year;
          var nowmonth = vm.datas[i].month;
          for (var j = 0; j < vm.chartsum.length; j++) {
            if (vm.chartsum[j].allyear == nowyear && vm.chartsum[j].allmonth == nowmonth) {
              vm.chartsum[j].sumplusa = vm.chartsum[j].sumplusa + vm.datas[i].Aplus;
              vm.chartsum[j].summinusa = vm.chartsum[j].summinusa + vm.datas[i].Aminus;
              vm.chartsum[j].sumB = vm.chartsum[j].sumB + vm.datas[i].B;
              vm.chartsum[j].sumscrap = vm.chartsum[j].sumscrap + vm.datas[i].Scrap;
              vm.chartsum[j].sumall = vm.chartsum[j].sumall + vm.datas[i].sum;
              ok++;
            }
          }
          if (ok > 0) {
            ok = 0;
            b = b;
          }
          else {
            vm.chartsum[b] = {}
            vm.chartsum[b].allyear = nowyear;
            vm.chartsum[b].allmonth = nowmonth;
            vm.chartsum[b].sumplusa = 0;
            vm.chartsum[b].sumplusa = vm.chartsum[b].sumplusa + vm.datas[i].Aplus;
            vm.chartsum[b].summinusa = 0;
            vm.chartsum[b].summinusa = vm.chartsum[b].summinusa + vm.datas[i].Aminus;
            vm.chartsum[b].sumB = 0;
            vm.chartsum[b].sumB = vm.chartsum[b].sumB + vm.datas[i].B;
            vm.chartsum[b].sumscrap = 0;
            vm.chartsum[b].sumscrap = vm.chartsum[b].sumscrap + vm.datas[i].Scrap;
            vm.chartsum[b].sumall = 0;
            vm.chartsum[b].sumall = vm.chartsum[b].sumall + vm.datas[i].sum;
            b++
          }
        }

        vm.gradechartconfig = {
          chart: {
            type: 'area',
            width: 1100,
            height: 400
          },
          plotOptions: {
            series: {
              stacking: 'normal'
            }
          },
          title: {
            text: "Grade százalékos megoszlása"
          },
          yAxis: {
            title: {
              text: "Százalék"
            },
            tickInterval: 5,
            max: 100,
            min: 75 
          },
          xAxis: {
            categories: feltolt_X_day(vm.chartsum)
          },
          tooltip: { shared: true,
                     valueDecimals: 2
                   },
          series: [
            {
              name: 'Scrap',
              color: '#ff0000',
              data: feltolt_scrap(vm.chartsum)
            },
            {
              name: 'B',
              color: '#ff9900',
              data: feltolt_B(vm.chartsum)
            },
            {
              name: 'A-',
              color: '#ff9900',
              data: feltolt_A_minus(vm.chartsum)
            },
            {
              name: 'A+',
              color: '#00ff00',
              data: feltolt_A_plus(vm.chartsum)
            }
          ]
        }

        //console.log(vm.datas);
        //console.log(vm.list);
        console.log(vm.chartsum);
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      update_year();
    }

    function feltolt_X_day(tomb) {
      var x_adatok = [];
      for (var i = 0; i < tomb.length; i++) {
        x_adatok[i] = tomb[i].allyear + "-" + tomb[i].allmonth;
      }
      return x_adatok;
    }
    function feltolt_scrap(tomb) {
      var x_adatok = [];
      for (var i = 0; i < tomb.length; i++) {
        x_adatok[i] = (tomb[i].sumscrap/tomb[i].sumall)*100;
      }
      return x_adatok;
    }
    function feltolt_B(tomb) {
      var x_adatok = [];
      for (var i = 0; i < tomb.length; i++) {
        x_adatok[i] = (tomb[i].sumB/tomb[i].sumall)*100;
      }
      return x_adatok;
    }
    function feltolt_A_minus(tomb) {
      var x_adatok = [];
      for (var i = 0; i < tomb.length; i++) {
        x_adatok[i] = (tomb[i].summinusa/tomb[i].sumall)*100;
      }
      return x_adatok;
    }
    function feltolt_A_plus(tomb) {
      var x_adatok = [];
      for (var i = 0; i < tomb.length; i++) {
        x_adatok[i] = (tomb[i].sumplusa/tomb[i].sumall)*100;
      }
      return x_adatok;
    }

  }
  Controller.$inject = ['gradeyearService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
