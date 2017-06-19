define([], function () {
  'use strict';
  function Controller(mapService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.partnumbers = [];
    vm.data = [];
    vm.osszesmodulbokes = [];
    vm.soroszlopbokes = [];
    vm.startdatum = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.startdatumszam = $filter('date')(new Date().getTime() - (6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddatum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.enddatumszam = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.esetek = ["Bökés", "Bökés/AEQ", "Súlyozott Bökés/AEQ","Modul"];
    vm.tipusok = ["Mind", "FLOW", "CP5"];
    vm.eset = "Bökés";
    vm.acttipus = "Mind";
    vm.tablazatazon = "";
    vm.modulnevazon="";
    vm.putmodul=[];
    vm.tablazat = [];
    vm.allaeq = 0;
    vm.allflowaeq = 0;
    vm.allcp5aeq = 0;
    vm.typedb = [];
    var tanks = ["Bubble point tank5", "Bubble point tank6", "Bubble point tank7", "Bubble point tank15"];
    var betuk = ["A", "B", "C", "D", "E"];
    var szamok = ["1", "2", "3", "4", "5", "6", "8", "9"];
    vm.mtfload = true;
    vm.kadak = tanks;
    vm.sorok = szamok;
    vm.oszlop = betuk;
    vm.load = load;
    vm.beilleszt = beilleszt;
    vm.tabl = tabl;
    vm.drawchart = drawchart;

    function tabl(index) {
      vm.tablazat = $filter('filter')(vm.soroszlopbokes, { azon: index })[0].moduls;
    }

    function beilleszt() {
      var startszam = new Date(vm.startdatum);
      var endszam = new Date(vm.enddatum);
      vm.startdatumszam = $filter('date')(startszam, 'yyyy-MM-dd');
      vm.enddatumszam = $filter('date')(endszam, 'yyyy-MM-dd');
    }

    function feltoltsoroszlop() {
      var a = 0;
      for (var i = 0; i < szamok.length; i++) {
        if (i == 0 || i == 6) {
          for (var j = 0; j < betuk.length; j++) {
            vm.soroszlopbokes[a] = {}
            vm.soroszlopbokes[a].azon = betuk[j] + szamok[i];
            vm.soroszlopbokes[a].bokes = 0;
            vm.soroszlopbokes[a].aeq = 0;
            vm.soroszlopbokes[a].moduls = [];
            a++;
          }
        }
        else {
          for (var j = 0; j < betuk.length - 1; j++) {
            vm.soroszlopbokes[a] = {}
            vm.soroszlopbokes[a].azon = betuk[j] + szamok[i];
            vm.soroszlopbokes[a].bokes = 0;
            vm.soroszlopbokes[a].aeq = 0;
            vm.soroszlopbokes[a].moduls = [];
            a++;
          }
        }
      }
    }

    function getAEQ(tomb, azon) {
      var aeq = 0;
      var szam = azon.substring(2, 9);
      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].id == szam) {
          aeq = parseFloat(tomb[i].aeq);
        }
      }
      return aeq;
    }

    function getModulname(tomb, azon) {
      var name = "";
      var szam = azon.substring(2, 9);
      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].id == szam) {
          name = tomb[i].name;
        }
      }
      return name;
    }

    function loadPartnumbers() {
      vm.partnumbers = [];
      mapService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }

    function load() {
      vm.mtfload = true;
      vm.data = [];
      vm.typedb = [];
      vm.osszesmodulbokes = [];
      vm.soroszlopbokes = [];
      feltoltsoroszlop();
      vm.allaeq = 0;
      var talalat = 0;
      var modok = 0;
      var a = 0;
      var b = 0;

      for (var i = 0; i < tanks.length; i++) {
        mapService.get(vm.startdatum, vm.enddatum, tanks[i]).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].aeq = getAEQ(vm.partnumbers, response.data[j].modul_id1)
            response.data[j].modtype = getModulname(vm.partnumbers, response.data[j].modul_id1)
            response.data[j].tipus = $filter('addtype')(response.data[j].modtype);
            vm.data.push(response.data[j]);
            var actkom = response.data[j].Oszlop + response.data[j].Sor;
            for (var k = 0; k < vm.osszesmodulbokes.length; k++) {
              if (response.data[j].modul_id1 == vm.osszesmodulbokes[k].modul) {
                vm.osszesmodulbokes[k].bokes += response.data[j].bt_kat_db1 * 1;
                var datainter = {}
                datainter.azon = actkom;
                datainter.db = response.data[j].bt_kat_db1*1;
                vm.osszesmodulbokes[k].bokespozbokes.push(datainter);
                talalat++;
              }
            }
            if (talalat == 0) {
              vm.osszesmodulbokes[a] = {}
              vm.osszesmodulbokes[a].modul = response.data[j].modul_id1;
              vm.osszesmodulbokes[a].bokes = response.data[j].bt_kat_db1 * 1;
              vm.osszesmodulbokes[a].aeq = response.data[j].aeq;
              vm.osszesmodulbokes[a].name = response.data[j].modtype;
              vm.osszesmodulbokes[a].bokespozbokes = [];
              var datainter = {}
              datainter.azon = actkom;
              datainter.db = response.data[j].bt_kat_db1*1;
              vm.osszesmodulbokes[a].bokespozbokes.push(datainter);
              a++;
              vm.allaeq += response.data[j].aeq;
              if (response.data[j].tipus == "FLOW") {
                vm.allflowaeq += response.data[j].aeq;
              }
              if (response.data[j].tipus == "CP5") {
                vm.allcp5aeq += response.data[j].aeq;
              }
            }
            else {
              talalat = 0;
            }

            for (var l = 0; l < vm.soroszlopbokes.length; l++) {
              if (actkom == vm.soroszlopbokes[l].azon) {
                var hossz = vm.soroszlopbokes[l].moduls.length;
                var szamvaltozo = new Date(response.data[j].bt_datetime).getHours() * 60 + new Date(response.data[j].bt_datetime).getMinutes();
                var szakszam = 0;
                if (szamvaltozo >= 350 && szamvaltozo < 830) {
                  szakszam = 1;
                }
                else if (szamvaltozo >= 830 && szamvaltozo < 1310) {
                  szakszam = 2;
                }
                else {
                  szakszam = 3;
                }

                vm.soroszlopbokes[l].bokes += response.data[j].bt_kat_db1 * 1;
                vm.soroszlopbokes[l].aeq += response.data[j].aeq;
                vm.soroszlopbokes[l].moduls[hossz] = {}
                vm.soroszlopbokes[l].moduls[hossz].modulazon = response.data[j].modul_id1;
                vm.soroszlopbokes[l].moduls[hossz].modulaeq = response.data[j].aeq;
                vm.soroszlopbokes[l].moduls[hossz].modulname = response.data[j].modtype;
                vm.soroszlopbokes[l].moduls[hossz].modultype = $filter('addtype')(response.data[j].modtype);
                vm.soroszlopbokes[l].moduls[hossz].modulbokes = response.data[j].bt_kat_db1 * 1;
                vm.soroszlopbokes[l].moduls[hossz].modulbokeshiba = response.data[j].KatName1;
                vm.soroszlopbokes[l].moduls[hossz].modultank = response.data[j].tank;
                vm.soroszlopbokes[l].moduls[hossz].moduldatum = $filter('date')(new Date(response.data[j].bt_datetime).getTime(), 'yyyy-MM-dd HH:mm');
                vm.soroszlopbokes[l].moduls[hossz].modulszak = $filter('shift')(szakszam, new Date(response.data[j].bt_datetime).getTime() - (5 * 60 + 50) * 60 * 1000, 'yyyy-MM-dd');
              }
            }


            for (var m = 0; m < vm.typedb.length; m++) {
              if (response.data[j].modtype == vm.typedb[m].typename) {
                for (var n = 0; n < vm.typedb[m].moduls.length; n++) {
                  if (vm.typedb[m].moduls[n] == response.data[j].modul_id1) {
                    modok++
                  }
                }
                if (modok == 0) {
                  vm.typedb[m].moduls.push(response.data[j].modul_id1);
                  vm.typedb[m].db++;
                }
                else {
                  modok = 0;
                }
                talalat++;
              }
            }
            if (talalat == 0) {
              vm.typedb[b] = {}
              vm.typedb[b].typename = response.data[j].modtype;
              vm.typedb[b].db = 1;
              vm.typedb[b].aeq = response.data[j].aeq;
              vm.typedb[b].moduls = [];
              vm.typedb[b].moduls.push(response.data[j].modul_id1);
              b++;
            }
            else {
              talalat = 0;
            }

          }
          // PARETO
          var fir = $filter('limitTo')($filter('orderBy')(vm.soroszlopbokes, 'bokes', true), 20);
          var pdata = [];
          var drills = [];
          var totalbok = $filter('sumField')(vm.soroszlopbokes, 'bokes');
          var cdata = [];
          var cumm = 0;
          for (var d = 0; d < fir.length; d++) {
            pdata[d] = {
              name: fir[d].azon,
              y: fir[d].bokes,
              drilldown: fir[d].azon
            };
            cumm = cumm + fir[d].bokes;
            cdata[d] = {
              name: fir[d].azon,
              y: parseFloat((cumm / totalbok * 100).toFixed(2)),
              dirlldown: null
            }
            var drd = $filter('unique')(fir[d].moduls, 'modulbokeshiba');
            drills[d] = {
              id: fir[d].azon,
              name: fir[d].azon,
              data: []
            };
            var adat = [];
            for (var f = 0; f < drd.length; f++) {
              adat[f] = { x: drd[f].modulbokeshiba, y: $filter('sumField')($filter('filter')(fir[d].moduls, { modulbokeshiba: drd[f].modulbokeshiba }), 'modulbokes') * 1 };
              //drills[d].data[f] = [drd[f].modulbokeshiba, $filter('sumField')($filter('filter')(fir[d].moduls, {modulbokeshiba:drd[f].modulbokeshiba}), 'modulbokes')*1];
            }
            adat = $filter('orderBy')(adat, 'y', true);

            for (var f = 0; f < adat.length; f++) {
              drills[d].data[f] = [adat[f].x, adat[f].y];
            }
          }
          vm.paretoconfig = {
            chart: {
              type: 'column',
              height: 350,
              events: {
                drillup: function (event) {
                  for (var i = 0; i < this.series.length; i++)
                    if (this.series[i].name == "Pareto")
                      this.series[i].show();
                }
              }
            },
            title: {
              text: "Top 20 Hibapozíció"
            },
            xAxis: {
              type: "category"
            },
            yAxis: [
              { title: { text: 'Bökés' } },
              { title: { text: 'Pareto' }, opposite: true }
            ],
            plotOptions: {
              series: {
                events: {
                  click: function (event) {
                    for (var i = 0; i < this.chart.series.length; i++)
                      if (this.chart.series[i].name == "Pareto")
                        this.chart.series[i].hide();
                  }
                }
              }
            },
            series: [{
              name: 'Pozíciók',
              colorByPoint: true,
              data: pdata
            }, {
              name: 'Pareto',
              type: 'line',
              color: 'red',
              data: cdata,
              yAxis: 1
            }],
            drilldown: { series: drills }
          };
          // -- PARETO END

          //console.log(vm.data); 
          //console.log(vm.soroszlopbokes);
          console.log(vm.osszesmodulbokes);
          //console.log(vm.typedb);
          vm.mtfload = false;
        });
      }
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadPartnumbers();
      load();
      vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    }

    function drawchart(index) {
      var dt = $filter('filter')(vm.soroszlopbokes, { azon: index })[0].moduls;
      vm.chartconfig = {
        chart: {
          type: 'column',
          width: 500,
          height: 440
        },
        title: { text: vm.tablazatazon },
        series: [
          {
            name: 'Hibák',
            color: "#3366ff",
            data: feltolthibadarab(dt),
            //dataLabels: {enabled: true, style: {"fontSize": "20px"}},
            tooltip: {
              useHTML: true,
              headerFormat: '<b style="color:{series.color};font-weight:bold;">Hibák</b><br>',
              pointFormat: '<span style="font-size:1.2em">{point.name} </span><br><b>{point.y} db</i>'
            },
          },
        ],
        xAxis: {
          type: 'category'
        },
        yAxis: {
          title: {
            text: "Bökés"
          }
        },
      };
    }

    function feltolthibadarab(tomb) {
      var adatok = [];
      var a = 0;
      var talalat = 0;
      if (vm.acttipus == "Mind") {
        for (var i = 0; i < tomb.length; i++) {
          var acthiba = tomb[i].modulbokeshiba;
          for (var j = 0; j < adatok.length; j++) {
            if (acthiba == adatok[j].nev) {
              adatok[j].y += tomb[i].modulbokes;
              talalat++;
            }
          }
          if (talalat > 0) {
            talalat = 0;
          }
          else {
            adatok[a] = {}
            adatok[a].nev = acthiba;
            adatok[a].y = tomb[i].modulbokes;
            a++;
          }
        }
      }
      else if (vm.acttipus == "FLOW") {
        for (var i = 0; i < tomb.length; i++) {
          var acthiba = tomb[i].modulbokeshiba;
          var tip = tomb[i].modultype;
          for (var j = 0; j < adatok.length; j++) {
            if (acthiba == adatok[j].nev && tip == "FLOW") {
              adatok[j].y += tomb[i].modulbokes;
              talalat++;
            }
          }
          if (talalat > 0) {
            talalat = 0;
          }
          else {
            if (tip == "FLOW") {
              adatok[a] = {}
              adatok[a].nev = acthiba;
              adatok[a].y = tomb[i].modulbokes;
              a++;
            }
          }
        }
      }
      else if (vm.acttipus == "CP5") {
        for (var i = 0; i < tomb.length; i++) {
          var acthiba = tomb[i].modulbokeshiba;
          var tip = tomb[i].modultype;
          for (var j = 0; j < adatok.length; j++) {
            if (acthiba == adatok[j].nev && tip == "CP5") {
              adatok[j].y += tomb[i].modulbokes;
              talalat++;
            }
          }
          if (talalat > 0) {
            talalat = 0;
          }
          else {
            if (tip == "CP5") {
              adatok[a] = {}
              adatok[a].nev = acthiba;
              adatok[a].y = tomb[i].modulbokes;
              a++;
            }
          }
        }
      }
      var res = [];
      var k = $filter('orderBy')(adatok, 'y', true);
      for (var v = 0; v < k.length; v++) {
        res[v] = [k[v].nev, k[v].y];
      }
      return res;
    }



  }
  Controller.$inject = ['mapService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});