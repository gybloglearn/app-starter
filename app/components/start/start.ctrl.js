define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.end = $filter('date')(new Date().getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
    vm.frissites_ideje = $filter('date')(new Date().getTime() + 15 * 60 * 1000, 'yyyy-MM-dd HH:mm');
    vm.sheetmakers = ["SM4", "SM5"];
    vm.smcards = [];

    function load() {
      vm.smcards = [];
      var frissites = $filter('date')(new Date().getTime(), 'yyyy-MM-dd HH:mm');


      angular.forEach(vm.sheetmakers, function (v, k) {
        var ossz = 0;
        var osszaeq = 0;
        var jo = 0;
        var joaeq = 0;
        load++;

        dataService.getsm(vm.datum, vm.end, v).then(function (response) {
          ossz = $filter('sumdb')($filter('filter')(response.data, { 'category': 'TOTAL' }));
          jo = $filter('sumdb')($filter('filter')(response.data, { 'category': 'GOOD' }));

          var obj = {};
          obj = {
            sm: v,
            osszlap: ossz,
            jolap: jo,

          };

          dataService.getplan(v, vm.datum).then(function (resp) {
            vm.allplan = response.data;
            vm.tervezett_darab = 0;

            if (vm.allplan == "") {
              vm.tervezett_darab = 0;
            }
            else {
              var szorzo = new Date(frissites).getHours() * 60 + new Date(frissites).getMinutes();
              for (var i = 0; i < vm.allplan.length; i++) {
                vm.tervezett = 0;
                var szam = 0;
                vm.tervezett_darab = 0;

                if (vm.actshiftnum == 1) {
                  var szorzo = new Date(frissites).getHours() * 60 + new Date(frissites).getMinutes();
                  vm.tervezett = vm.tervezett + (parseInt(vm.allplan[i].amountshift1) * parseInt(vm.allplan[i].sheetnumber));
                  szorzo = szorzo - (350);
                  szam = (vm.tervezett / 720) * szorzo;
                  vm.tervezett_darab = Math.round(szam);
                }
                else if (vm.actshiftnum == 3) {
                  var szorzo = new Date(frissites).getHours() * 60 + new Date(frissites).getMinutes();
                  vm.tervezett = vm.tervezett + (parseInt(vm.allplan[i].amountshift3) * parseInt(vm.allplan[i].sheetnumber));
                  if (szorzo >= 1070) {
                    szorzo = szorzo - (1070);
                    szam = (vm.tervezett / 720) * szorzo;
                    vm.tervezett_darab = Math.round(szam);
                    if (vm.tervezett_darab > vm.tervezett) {
                      vm.tervezett_darab = vm.tervezett;
                    }
                  }
                  else {
                    var plus = 370;
                    szorzo = szorzo + plus;
                    szam = (vm.tervezett / 720) * szorzo;
                    vm.tervezett_darab = Math.round(szam);
                    if (vm.tervezett_darab > vm.tervezett) {
                      vm.tervezett_darab = vm.tervezett;
                    }
                  }
                }
              }
            }
            obj.terv = vm.tervezett_darab;
          });
          dataService.getsoesm(vm.datum, v).then(function (resp) {
            var szam = $filter('sumField')($filter('filter')(resp.data, { 'Event_type': "Downtime" }), 'Event_time');
            var szerv = $filter('sumField')($filter('filter')(resp.data, { 'Ev_Group': "Szervezesi veszteseg" }), 'Event_time');
            var terv = $filter('sumField')($filter('filter')(resp.data, { 'Ev_Group': "Tervezett veszteseg" }), 'Event_time');
            var musz = $filter('sumField')($filter('filter')(resp.data, { 'Ev_Group': "Muszaki technikai okok" }), 'Event_time');

            obj.downtime = szam / 60;
            obj.szervezesi = szerv / 60;
            obj.tervezesi = terv / 60;
            obj.muszaki = musz / 60;
            obj.id= "SMchart" + v,
            obj.chartconfig= {
              chart: {
                type: 'column',
                width: 300,
                height: 300
              },
              plotOptions: {
                column: {
                  stacking: 'normal'
                }
              },
              title: { text: v },
              series: [
                {
                  name: 'Selejt lap',
                  color: "#990000",
                  data: [ossz - jo],
                  stack: 'Összes lap'
                },
                {
                  name: 'Jó lap',
                  color: "#00b300",
                  data: [jo],
                  stack: 'Összes lap'
                },
                {
                  name: 'Terv',
                  color: "#0033cc",
                  data: [terv]
                }],

              xAxis: [
                { categories: feltolt_x() },
              ],
              yAxis: {
                title: {
                  text: "Darab"
                }
              }
            }
            vm.smcards.push(obj);
          });
        });
      });
    }

    function feltolt_x() {
      var szoveg = ["Tény/Terv"];
      return szoveg;
    }

    function date_refresh() {
      vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
      vm.frissites_ideje = $filter('date')(new Date().getTime() + 15 * 60 * 1000, 'yyyy-MM-dd HH:mm');
    }

    var refreshload = setInterval(load, 15 * 60 * 1000);
    var refreshdate = setInterval(date_refresh, 15 * 60 * 1000);


    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load()
    }
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
