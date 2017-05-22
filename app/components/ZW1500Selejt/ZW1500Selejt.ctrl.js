define([], function () {
  'use strict';
  function Controller(ZW1500SelejtService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.times = ["nap", "hét", "hónap"];
    vm.data = [];
    vm.selectdata = [];
    vm.acttime = "nap";
    vm.load = load;

    function load() {
      vm.data = [];
      vm.selectdata = [];
      var a = 0;
      var talalat = 0;
      var celallando=[];
      vm.dis = true;
      vm.loading = true;

      ZW1500SelejtService.get(vm.startdate, vm.enddate, vm.acttime).then(function (response) {
        vm.data = response.data;

        for (var i = 0; i < vm.data.length; i++) {
          var actdate = vm.data[i].item;
          for (var j = 0; j < vm.selectdata.length; j++) {
            if (actdate == vm.selectdata[j].date) {
              talalat++
              if (vm.data[i].gradename == "A+") {
                vm.selectdata[j].Aplus += vm.data[i].amount * 1;
              }
              else if (vm.data[i].gradename == "A") {
                vm.selectdata[j].A += vm.data[i].amount * 1;
              }
              else if (vm.data[i].gradename == "B") {
                vm.selectdata[j].B += vm.data[i].amount * 1;
              }
              else if (vm.data[i].ScrapReason == "AH") {
                vm.selectdata[j].AH += vm.data[i].amount * 1;
              }
              else if (vm.data[i].ScrapReason == "Egyéb") {
                vm.selectdata[j].Egyeb += vm.data[i].amount * 1;
              }
              else if (vm.data[i].ScrapReason == "OH") {
                vm.selectdata[j].OH += vm.data[i].amount * 1;
              }
              else if (vm.data[i].ScrapReason == "OHSL") {
                vm.selectdata[j].OHSL += vm.data[i].amount * 1;
              }
              else if (vm.data[i].ScrapReason == "SEH") {
                vm.selectdata[j].SEH += vm.data[i].amount * 1;
              }
              else if (vm.data[i].ScrapReason == "SL") {
                vm.selectdata[j].SL += vm.data[i].amount * 1;
              }
              else if (vm.data[i].ScrapReason == "Vegyes (OH+GH)") {
                vm.selectdata[j].VegyesOHGH += vm.data[i].amount * 1;
              }
              else if (vm.data[i].ScrapReason == "GH") {
                vm.selectdata[j].GH += vm.data[i].amount * 1;
              }
            }
          }
          if (talalat > 0) {
            a = a;
            talalat = 0;
          }
          else {
            vm.selectdata[a] = {}
            vm.selectdata[a].date = actdate;
            vm.selectdata[a].Aplus = 0;
            vm.selectdata[a].AH = 0;
            vm.selectdata[a].Egyeb = 0;
            vm.selectdata[a].OH = 0;
            vm.selectdata[a].OHSL = 0;
            vm.selectdata[a].SEH = 0;
            vm.selectdata[a].SL = 0;
            vm.selectdata[a].VegyesOHGH = 0;
            vm.selectdata[a].GH = 0;
            vm.selectdata[a].A = 0;
            vm.selectdata[a].B = 0;
            vm.selectdata[a].OsszesSelejt = 0;
            vm.selectdata[a].Osszes = 0;
            vm.selectdata[a].Kumulalt = 0;

            if (vm.data[i].gradename == "A+") {
              vm.selectdata[a].Aplus += vm.data[i].amount * 1;
            }
            else if (vm.data[i].gradename == "A") {
              vm.selectdata[a].A += vm.data[i].amount * 1;
            }
            else if (vm.data[i].gradename == "B") {
              vm.selectdata[a].B += vm.data[i].amount * 1;
            }
            else if (vm.data[i].ScrapReason == "AH") {
              vm.selectdata[a].AH += vm.data[i].amount * 1;
            }
            else if (vm.data[i].ScrapReason == "Egyéb") {
              vm.selectdata[j].Egyeb += vm.data[i].amount * 1;
            }
            else if (vm.data[i].ScrapReason == "OH") {
              vm.selectdata[j].OH += vm.data[i].amount * 1;
            }
            else if (vm.data[i].ScrapReason == "OHSL") {
              vm.selectdata[j].OHSL += vm.data[i].amount * 1;
            }
            else if (vm.data[i].ScrapReason == "SEH") {
              vm.selectdata[j].SEH += vm.data[i].amount * 1;
            }
            else if (vm.data[i].ScrapReason == "SL") {
              vm.selectdata[j].SL += vm.data[i].amount * 1;
            }
            else if (vm.data[i].ScrapReason == "Vegyes (OH+GH)") {
              vm.selectdata[j].VegyesOHGH += vm.data[i].amount * 1;
            }
            else if (vm.data[i].ScrapReason == "GH") {
              vm.selectdata[j].GH += vm.data[i].amount * 1;
            }
            a++;
          }
        }

        var kuma=0;
        var kumb=0;

        for (var i = 0; i < vm.selectdata.length; i++) {
          vm.selectdata[i].Osszes += (vm.selectdata[i].Aplus + vm.selectdata[i].A + vm.selectdata[i].B + vm.selectdata[i].AH + vm.selectdata[i].Egyeb + vm.selectdata[i].OH + vm.selectdata[i].OHSL + vm.selectdata[i].SEH + vm.selectdata[i].SL + vm.selectdata[i].VegyesOHGH + vm.selectdata[i].GH);
          vm.selectdata[i].OsszesSelejt += (vm.selectdata[i].AH + vm.selectdata[i].Egyeb + vm.selectdata[i].OH + vm.selectdata[i].OHSL + vm.selectdata[i].SEH + vm.selectdata[i].SL + vm.selectdata[i].VegyesOHGH + vm.selectdata[i].GH);
          kuma+=vm.selectdata[i].OsszesSelejt;
          kumb+=vm.selectdata[i].Osszes;
          vm.selectdata[i].Kumulalt=(kuma/kumb)*100;
          celallando[i]=0.8;
        }
        console.log(vm.selectdata);
        vm.dis = false;
        vm.loading = false;

        vm.chartconfig = {
          chart: {
            type: 'column',
          },
          plotOptions: {
            column: {
              stacking: 'normal'
            }
          },
          title: { text: "ZW1000 Selejt" },
          tooltip: {
            shared: true,
            valueDecimals: 2
          },
          series: [
            {
              type: "line",
              name: 'Kumulált',
              color: "#e46d0a",
              data: feltolt_Kum(vm.selectdata)
            },
            {
              type: "line",
              name: 'Cél',
              color: "#ff0000",
              data: celallando
            },
            {
              name: 'Vegyes (OH+GH)',
              color: "#92d151",
              data: feltolt_OHGH(vm.selectdata),
              stack: 'Összes típus'
            },
            {
              name: 'SL',
              color: "#c0514d",
              data: feltolt_SL(vm.selectdata),
              stack: 'Összes típus'
            },
            {
              name: 'SEH',
              color: "#ffff01",
              data: feltolt_SEH(vm.selectdata),
              stack: 'Összes típus'
            },
            {
              name: 'OHSL',
              color: "#c0514d",
              data: feltolt_OHSL(vm.selectdata),
              stack: 'Összes típus'
            },
            {
              name: 'OH',
              color: "#4572a7",
              data: feltolt_OH(vm.selectdata),
              stack: 'Összes típus'
            },
            {
              name: 'GH',
              color: "#e46d0a",
              data: feltolt_GH(vm.selectdata),
              stack: 'Összes típus'
            },
            {
              name: 'Egyéb',
              color: "#7030a0",
              data: feltolt_Egyeb(vm.selectdata),
              stack: 'Összes típus'
            },
            {
              name: 'AH',
              color: "#7030a0",
              data: feltolt_AH(vm.selectdata),
              stack: 'Összes típus'
            }
          ],
          xAxis: [
            {
              categories: feltolt_x_datum(vm.selectdata),
              title: { text: "Dátum" }
            },
          ],
          yAxis: {
            title: {
              text: "Arány"
            },
          },
        }
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.enddate = new Date().getTime();
      vm.startdate = $filter('date')(vm.enddate - (10 * 24 * 3600 * 1000), 'yyyy-MM-dd');
      vm.enddate = $filter('date')(vm.enddate, 'yyyy-MM-dd');
      load();
      vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    }

    function feltolt_Kum(tomb) {
      var x_Kum = [];

      for (var i = 0; i < tomb.length; i++) {
        x_Kum.push(tomb[i].Kumulalt);
      }
      return x_Kum;
    }

    function feltolt_OHGH(tomb) {
      var x_OHGH = [];

      for (var i = 0; i < tomb.length; i++) {
        x_OHGH.push((tomb[i].OHGH / tomb[i].Osszes)* 100);
      }
      return x_OHGH;
    }

    function feltolt_SL(tomb) {
      var x_SL = [];

      for (var i = 0; i < tomb.length; i++) {
        x_SL.push((tomb[i].SL / tomb[i].Osszes)* 100);
      }
      return x_SL;
    }

    function feltolt_SEH(tomb) {
      var x_SEH = [];

      for (var i = 0; i < tomb.length; i++) {
        x_SEH.push((tomb[i].SEH / tomb[i].Osszes)* 100);
      }
      return x_SEH;
    }
    function feltolt_OHSL(tomb) {
      var x_OHSL = [];

      for (var i = 0; i < tomb.length; i++) {
        x_OHSL.push((tomb[i].OHSL / tomb[i].Osszes)* 100);
      }
      return x_OHSL;
    }

    function feltolt_OH(tomb) {
      var x_OH = [];

      for (var i = 0; i < tomb.length; i++) {
        x_OH.push((tomb[i].OH / tomb[i].Osszes)* 100);
      }
      return x_OH;
    }

    function feltolt_GH(tomb) {
      var x_GH = [];

      for (var i = 0; i < tomb.length; i++) {
        x_GH.push((tomb[i].GH / tomb[i].Osszes)* 100);
      }
      return x_GH;
    }

    function feltolt_Egyeb(tomb) {
      var x_Egy = [];

      for (var i = 0; i < tomb.length; i++) {
        x_Egy.push((tomb[i].Egyeb / tomb[i].Osszes) * 100);
      }
      return x_Egy;
    }

    function feltolt_AH(tomb) {
      var x_AH = [];

      for (var i = 0; i < tomb.length; i++) {
        x_AH.push((tomb[i].AH / tomb[i].Osszes)* 100);
      }
      return x_AH;
    }

    function feltolt_x_datum(tomb) {
      var x_Datum = [];

      for (var i = 0; i < tomb.length; i++) {
        x_Datum.push(tomb[i].date);
      }
      return x_Datum;
    }
  }
  Controller.$inject = ['ZW1500SelejtService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
