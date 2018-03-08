define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
    vm.frissites_ideje = $filter('date')(new Date().getTime() + 10 * 60 * 1000, 'yyyy-MM-dd HH:mm');
    vm.sheetmakers = ["SheetMaker4", "SheetMaker5"];
    vm.smcards = [];

    function load() {
      vm.smcards = [];

      var changedaynum=new Date().getHours() * 60 + new Date().getMinutes();
      if(changedaynum<350){
        vm.datum = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
        vm.end = $filter('date')(new Date(vm.datum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      }
      else{
        vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
        vm.end = $filter('date')(new Date(vm.datum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      }
      

      dataService.getplan().then(function (resp) {
        vm.allplan = resp.data;

        angular.forEach(vm.sheetmakers, function (v, k) {
          var ossz = 0;
          var osszaeq = 0;
          var jo = 0;
          var joaeq = 0;
          

          dataService.getsm(vm.datum, vm.end, v).then(function (response) {
            ossz = $filter('sumdb')($filter('filter')(response.data, { 'category': 'TOTAL', 'shiftnum': vm.actshiftnum }));
            jo = $filter('sumdb')($filter('filter')(response.data, { 'category': 'GOOD', 'shiftnum': vm.actshiftnum }));
            var obj = {};
            obj = {
              sm: v[0] + v[5] + v[10],
              osszlap: ossz,
              jolap: jo,

            };

            plancreator(vm.allplan,obj.sm);

            obj.terv = vm.tervezett_darab;
            obj.szaklap=vm.szaklap;


            dataService.getsoesm(vm.datum, v).then(function (respo) {
              var tomb=[];
              for(var i=0;i<respo.data.length;i++){
                respo.data[i].shiftnum=respo.data[i].Shift_ID[respo.data[i].Shift_ID.length-1]
              }
              tomb=$filter('filter')(respo.data,{'shiftnum':vm.actshiftnum});
              var szam = $filter('sumField')($filter('filter')(tomb, { 'Event_type': "Downtime" }), 'Event_time');
              var szerv = $filter('sumField')($filter('filter')(tomb, { 'Ev_Group': "Szervezesi veszteseg" }), 'Event_time');
              var tervez = $filter('sumField')($filter('filter')(tomb, { 'Ev_Group': "Tervezett veszteseg" }), 'Event_time');
              var musz = $filter('sumField')($filter('filter')(tomb, { 'Ev_Group': "Muszaki technikai okok" }), 'Event_time');

              obj.downtime = szam / 60;
              obj.szervezesi = szerv / 60;
              obj.tervezesi = tervez / 60;
              obj.muszaki = musz / 60;
              obj.id = "SMchart" + v,
                obj.chartconfig = {
                  chart: {
                    type: 'column',
                    
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
                      data: [obj.terv],
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
      });
    }

    function choose() {
      var ppg=new Date().getHours() * 60 + new Date().getMinutes();

      if (ppg>=350 && ppg<1070) {
        vm.actshiftnum = 1;
      }
      else  {
        vm.actshiftnum = 3;
      }
    }

    function plancreator(tomb, asm) {
      choose();
      var frissites = $filter('date')(new Date().getTime(), 'yyyy-MM-dd HH:mm');
      vm.tervezett_darab = 0;
      vm.szaklap=0;

      if (tomb == "") {
        vm.tervezett_darab = 0;
        vm.szaklap=0;
      }
      else {
        var szam = 0;
        for (var i = 0; i < tomb.length; i++) {
          if (tomb[i].sm == asm) {
            if (vm.actshiftnum == 1) {
              vm.tervezett = 0;
              vm.szaklap=0;
              var szorzo = new Date(frissites).getHours() * 60 + new Date(frissites).getMinutes();
              vm.tervezett += (tomb[i].amount)*12;
              vm.szaklap+=vm.tervezett;
              szorzo = szorzo - (350);
              szam = (vm.tervezett / 720) * szorzo;
              vm.tervezett_darab += Math.round(szam);
            }
            else if (vm.actshiftnum == 3) {
              vm.tervezett = 0;
              vm.szaklap=0;
              var szorzo = new Date(frissites).getHours() * 60 + new Date(frissites).getMinutes();
              vm.tervezett += (tomb[i].amount)*12;
              vm.szaklap+=vm.tervezett;
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
      }
    }


    function feltolt_x() {
      var szoveg = ["Tény/Terv"];
      return szoveg;
    }

    function date_refresh() {
      vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
      vm.frissites_ideje = $filter('date')(new Date().getTime() + 10 * 60 * 1000, 'yyyy-MM-dd HH:mm');
    }


    var refreshload = setInterval(load, 10 * 60 * 1000);
    var refreshdate = setInterval(date_refresh, 10 * 60 * 1000);


    activate();

    function activate() {
//      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      choose();
      load();
    }
  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
