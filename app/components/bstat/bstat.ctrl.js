define([], function () {
  'use strict';
  function Controller(statService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.showsumstat = true;
    vm.show2table = true;
    vm.show3table = true;
    vm.showcirclestat = true;
    vm.stat_data = [];
    vm.sumstat = [];
    vm.machines = [];
    vm.allmachines = [];
    vm.rooms = [];
    vm.circles = [];
    vm.cmch = [];
    vm.status = ["Állásidők", "Termek", "Körök"];
    vm.st = "Állásidők";
    vm.startdatum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.enddatum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.difference = 0;
    vm.load = load;
    vm.startdatumszam = vm.startdatum;
    vm.enddatumszam = vm.enddatum;
    vm.beallit = beallit;
    vm.count = count;
    vm.drawchart = drawchart;
    vm.circledetails = circledetails;
    var tomb = [];
    var kodok = [];
    var ok = [];


    function beallit() {
      vm.szam1 = new Date(vm.startdatum);
      vm.szam2 = new Date(vm.enddatum);
      vm.startdatumszam = $filter('date')(vm.szam1, 'yyyy-MM-dd');
      vm.enddatumszam = $filter('date')(vm.szam2, 'yyyy-MM-dd');
      vm.difference = (new Date(vm.enddatumszam).getTime() - new Date(vm.startdatumszam).getTime()) / (60000);
    }

    function load() {
      var act = "";
      var actszam = 0;
      var talalat = 0;
      var a = 0;
      var ido = 0;
      var darab = 0;
      tomb = [];

      vm.dis = true;
      vm.braidtloading = true;
      vm.stat_data = [];
      vm.sumstat = [];
      statService.get(vm.startdatum, vm.enddatum).then(function (response) {
        vm.stat_data = response.data;
        vm.dis = false;
        for (var i = 0; i < vm.stat_data.length; i++) {
          act = vm.stat_data[i].machine_Stat;
          actszam = vm.stat_data[i].Stat_Time * 1;
          for (var j = 0; j < vm.sumstat.length; j++) {
            if (vm.sumstat[j].id == act) {
              vm.sumstat[j].time = vm.sumstat[j].time + actszam;
              vm.sumstat[j].piece++;
              if (vm.sumstat[j].min > actszam) {
                vm.sumstat[j].min = actszam;
              }
              else if (vm.sumstat[j].max < actszam) {
                vm.sumstat[j].max = actszam;
              }
              talalat++;
            }
          }
          if (talalat > 0) {
            talalat = 0;
            a = a;
          }
          else {
            vm.sumstat[a] = {}
            vm.sumstat[a].id = act;
            vm.sumstat[a].time = actszam;
            vm.sumstat[a].piece = 1;
            vm.sumstat[a].min = actszam;
            vm.sumstat[a].max = actszam;
            a++
          }
        }
        for (var k = 0; k < vm.sumstat.length; k++) {
          if (vm.sumstat[k].id != "Aut. Dolgozik ") {
            ido = ido + vm.sumstat[k].time;
            darab = darab + vm.sumstat[k].piece;
          }
        }
        vm.sumstat[a] = {}
        vm.sumstat[a].id = "Összesen";
        vm.sumstat[a].time = ido;
        vm.sumstat[a].piece = darab;

        vm.braidtloading = false;
        tomb = vm.stat_data;
        console.log(tomb);
        machinecount();
      });
    }
    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.edate = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
    }

    function count() {
      vm.machines = [];
      var talalat = 0;
      var a = 0;
      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].machine_Stat == vm.itemtype.id) {
          for (var j = 0; j < vm.machines.length; j++) {
            if (vm.machines[j].nev == tomb[i].MName) {
              vm.machines[j].ido = vm.machines[j].ido + tomb[i].Stat_Time * 1;
              vm.machines[j].darab++;
              talalat++;
            }
          }
          if (talalat > 0) {
            talalat = 0;
            a = a;
          }
          else {
            vm.machines[a] = {}
            vm.machines[a].nev = tomb[i].MName;
            vm.machines[a].ido = tomb[i].Stat_Time * 1;
            vm.machines[a].darab = 1;
            a++
          }
        }
      }
    }

    function machinecount() {
      vm.allmachines = [];
      vm.rooms = [];
      var talalat = 0;
      var a = 0;

      for (var i = 0; i < tomb.length; i++) {
        var actname = tomb[i].MName;
        var actroom = (tomb[i].MName.substring(0, 1)) * 1 + 1;
        if (tomb[i].machine_Stat != "Aut. Dolgozik ") {
          for (var j = 0; j < vm.allmachines.length; j++) {
            if (vm.allmachines[j].name == actname) {
              vm.allmachines[j].badtime = vm.allmachines[j].badtime + tomb[i].Stat_Time * 1;
              vm.allmachines[j].goodtime = vm.allmachines[j].goodtime - tomb[i].Stat_Time * 1;
              talalat++;
            }
          }
          if (talalat > 0) {
            talalat = 0;
            a = a;
          }
          else {
            vm.allmachines[a] = {}
            vm.allmachines[a].name = actname;
            vm.allmachines[a].room = actroom;
            vm.allmachines[a].goodtime = vm.difference - tomb[i].Stat_Time * 1;
            vm.allmachines[a].badtime = tomb[i].Stat_Time * 1;
            vm.allmachines[a].alltime = vm.difference;
            vm.allmachines[a].circle = 0
            a++
          }
        }
      }

      for (var i = 0; i < vm.allmachines.length; i++) {
        for (var j = 0; j < korok.length; j++) {
          for (var k = 0; k < korok[j].length; k++) {
            if (vm.allmachines[i].name == korok[j][k]) {
              vm.allmachines[i].circle = j + 1;
            }
          }
        }
      }

      for (var i = 0; i < 4; i++) {
        vm.rooms[i] = {}
        vm.rooms[i].room = i;
        if (i == 0) {
          vm.rooms[i].goodtime = 509 * vm.difference;
          vm.rooms[i].badtime = 0;
          vm.rooms[i].alltime = 509 * vm.difference;
          vm.rooms[i].piece = 509;
        }
        else if (i == 1) {
          vm.rooms[i].goodtime = 226 * vm.difference;
          vm.rooms[i].badtime = 0;
          vm.rooms[i].alltime = 226 * vm.difference;
          vm.rooms[i].piece = 226;
        }
        else if (i == 2) {
          vm.rooms[i].goodtime = 355 * vm.difference;
          vm.rooms[i].badtime = 0;
          vm.rooms[i].alltime = 355 * vm.difference;
          vm.rooms[i].piece = 355;
        }
        else if (i == 3) {
          vm.rooms[i].goodtime = 380 * vm.difference;
          vm.rooms[i].badtime = 0;
          vm.rooms[i].alltime = 380 * vm.difference;
          vm.rooms[i].piece = 380;
        }
      }

      for (var i = 0; i < vm.allmachines.length; i++) {
        if (vm.allmachines[i].room == 1) {
          vm.rooms[0].goodtime -= vm.allmachines[i].badtime;
          vm.rooms[0].badtime += vm.allmachines[i].badtime;
        }
        else if (vm.allmachines[i].room == 2) {
          vm.rooms[1].goodtime -= vm.allmachines[i].badtime;
          vm.rooms[1].badtime += vm.allmachines[i].badtime;
        }
        else if (vm.allmachines[i].room == 3) {
          vm.rooms[2].goodtime -= vm.allmachines[i].badtime;
          vm.rooms[2].badtime += vm.allmachines[i].badtime;
        }
        else if (vm.allmachines[i].room == 4) {
          vm.rooms[3].goodtime -= vm.allmachines[i].badtime;
          vm.rooms[3].badtime += vm.allmachines[i].badtime;
        }
      }

      for (var i = 0; i < 14; i++) {
        vm.circles[i] = {}
        vm.circles[i].circle = i + 1;
        vm.circles[i].goodtime = 105 * vm.difference;
        vm.circles[i].badtime = 0;
        vm.circles[i].alltime = 105 * vm.difference;
        vm.circles[i].piece = 105;
      }

      for (var i = 0; i < vm.allmachines.length; i++) {
        var actnumber = vm.allmachines[i].circle;
        for (var j = 0; j < vm.circles.length; j++) {
          if (vm.circles[j].circle == actnumber) {
            vm.circles[j].goodtime -= vm.allmachines[i].badtime;
            vm.circles[j].badtime += vm.allmachines[i].badtime;
          }
        }
      }
    }

    function circledetails() {
      vm.cmch = [];
      var szam = vm.itemcircle.circle - 1;
      var a = 0;

      for (var j = 0; j < korok[szam].length; j++) {
        vm.cmch[a] = {}
        vm.cmch[a].nev = korok[szam][j];
        vm.cmch[a].hasznos = vm.difference;
        vm.cmch[a].rossz = 0;
        vm.cmch[a].osszes = vm.difference;
        a++;
      }

      for (var i = 0; i < tomb.length; i++) {
        for (var k = 0; k < vm.cmch.length; k++) {
          if (tomb[i].MName == vm.cmch[k].nev && tomb[i].machine_Stat != "Aut. Dolgozik ") {
            vm.cmch[k].hasznos -= tomb[i].Stat_Time * 1;
            vm.cmch[k].rossz += tomb[i].Stat_Time * 1;
          }
        }
      }
    }

    function drawchart() {
      var hibaido = 0;
      var kodok = [];
      var ok = [];
      var a = 0;
      var b = 0;

      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].MName == vm.drawitem.nev) {

          if (tomb[i].machine_Stat == "Aut. Dolgozik ") {
            ok[a] = {}
            ok[a].name = tomb[i].MName;
            ok[a].code = tomb[i].machine_Stat;
            ok[a].x = new Date(tomb[i].StartDate).getTime();
            ok[a].time = tomb[i].Stat_Time * 1 * 60000;
            ok[a].interval = tomb[i].Stat_Time + " perc";
            ok[a].x2 = new Date(tomb[i].EndDate).getTime();
            ok[a].y = 0;
            a++
          }
          else {
            hibaido = hibaido + tomb[i].Stat_Time * 1;
            kodok[b] = {}
            kodok[b].name = tomb[i].MName;
            kodok[b].code = tomb[i].machine_Stat;
            kodok[b].x = new Date(tomb[i].StartDate).getTime();
            kodok[b].time = tomb[i].Stat_Time * 1 * 60000;
            kodok[b].interval = tomb[i].Stat_Time + " perc";
            kodok[b].x2 = new Date(tomb[i].EndDate).getTime();
            kodok[b].y = 0;
            b++
          }
        }
      }
      setChartpie(vm.drawitem.nev, vm.difference, hibaido);
      setChartxrange(ok, kodok);
    }

    function setChartpie(name, diff, miss) {
      vm.chartconfig_pie = {
        chart: {
          type: 'pie',
          width: 800,
          height: 400
        },
        tooltip: {
          pointFormat: '<b style="color:{point.color};font-size:1.2em;font-weight:bold">{point.percentage:.2f} %</b>'
        },
        title: { text: "Gép: " + name },
        subtitle: { text: "Összes eltelt idő: " + diff + "perc" },
        plotOptions: {
          pie: {
            center: ['50%', '50%'],
            showInLegend: true
          }
        },
        series: [
          {
            data: [{
              name: 'Elérhető idő',
              color: "#00b300",
              y: diff - miss
            },
            {
              name: 'Kiesés',
              color: "#e60000",
              y: miss,
            }]
          }
        ],
      };
    }

    function setChartxrange(ok, kodok) {
      vm.chartconfig_xrange = {
        chart: {
          type: 'xrange',
          width: 1100,
          height: 200,
          zoomType: 'x'
        },
        legend: {
          floating: false,
          align: 'bottom',
        },
        xAxis: { title: { text: 'Idő' }, type: 'datetime', dateTimeLabelFormats: { hour: '%d.<br>%H:%M' }, tickInterval: 3600 * 1000 },
        yAxis: { tickInterval: 1, title: { enabled: false }, visible: false, categories: ["Idő"] },
        series: [
          {
            color: '#e60000',
            name: 'Kiesés',
            tooltip: {
              useHTML: true,
              headerFormat: '<b style="color:{series.color};font-weight:bold;">Kiesés:</b><br>',
              pointFormat: '<span style="color:{series.color};">{point.categ}</span><br><span style="font-size:1.2em">{point.x:%H:%M:%S} - {point.x2:%H:%M:%S}</span><br><b style="font-size:10px">{point.code}</b><br><i style="font-size:10px">{point.interval}</i>'
            },
            data: kodok,
            borderRadius: 0,
            pointWidth: 30,
            borderColor: '#e60000'
          },
          {
            color: '#00b300',
            name: 'Elérhető idő',
            tooltip: {
              useHTML: true,
              headerFormat: '<b style="color:{series.color};font-weight:bold;">Elérhető idő:</b><br>',
              pointFormat: '<span style="color:{series.color};">{point.categ}</span><br><span style="font-size:1.2em">{point.x:%H:%M:%S} - {point.x2:%H:%M:%S}</span><br><b style="font-size:10px">{point.code}</b><br><i style="font-size:10px">{point.interval}</i>'
            },
            data: ok,
            borderRadius: 0,
            pointWidth: 30,
            borderColor: '#00b300'
          }
        ]
      };
    }

    var korok = [["0A01", "0A02", "0A03", "0A04", "0A05", "0A06", "0A07", "0A08", "0A09", "0A10", "0A11", "0A12", "A 03", "0A14", "0A15", "0A16", "0A17", "0A18", "0A19", "0A20", "0A21", "0A22", "0A23", "0A24", "0A25", "0B01", "0B02", "0B03", "0B04", "0B05", "0B06", "0B07", "0B08", "0B09", "0B10", "0B11", "0B12", "0B13", "0B14", "0B15", "0B16", "0B17", "0B18", "0B19", "0B20", "0B21", "0B22", "0B23", "0B24", "0C01", "0C02", "0C03", "0C04", "0C05", "0C06", "0C07", "0C08", "0C09", "0C10", "0C11", "0C12", "0C13", "0C14", "0C15", "0C16", "0C17", "0C18", "0C19", "0C20", "0C21", "0C22", "0C23", "0C24", "0C25", "0C26", "0C27", "0D01", "0D02", "0D03", "0D04", "0D05", "0D06", "0D07", "0D08", "0D09", "0D10", "0D11", "0D12", "0D13", "0D14", "0D15", "0D16", "0D17", "0D18", "0D19", "0D20", "0D21", "0D22", "0D23", "0D24", "0D25", "0D26", "0D27", "0E01", "0E02"]
      , ["0E03", "0E04", "0E05", "0E06", "0E07", "0E08", "0E09", "0E10", "0E11", "0E12", "0E13", "0E14", "0E15", "0E16", "0E17", "0E18", "0E19", "0E20", "0E21", "0E22", "0E23", "0E24", "0E25", "0E26", "0E27", "0F01", "0F02", "0F03", "0F04", "0F05", "0F06", "0F07", "0F08", "0F09", "0F10", "0F11", "0F12", "0F13", "0F14", "0F15", "0F16", "0F17", "0F18", "0F19", "0F20", "0F21", "0F22", "0F23", "0F24", "0F25", "0F26", "0F27", "0G01", "0G02", "0G03", "0G04", "0G05", "0G06", "0G07", "0G08", "0G09", "0G10", "0G11", "0G12", "0G13", "0G14", "0G15", "0G16", "0G17", "0G18", "0G19", "0G20", "0G21", "0G22", "0G23", "0G24", "0G25", "0G26", "0G27", "0H01", "0H02", "0H03", "0H04", "0H05", "0H06", "0H07", "0H08", "0H09", "0H10", "0H11", "0H12", "0H13", "0H14", "0H15", "0H16", "0H17", "0H18", "0H19", "0H20", "0H21", "0H22", "0H23", "0H24", "0H25", "0H26"]
      , ["0I01", "0I02", "0I03", "0I04", "0I05", "0I06", "0I07", "0I08", "0I09", "0I10", "0I11", "0I12", "0I13", "0I14", "0I15", "0I16", "0I17", "0I18", "0I19", "0I20", "0I21", "0I22", "0I23", "0I24", "0I25", "0I26", "0K01", "0K02", "0K03", "0K04", "0K05", "0K06", "0K07", "0K08", "0K09", "0K10", "0K11", "0K12", "0K13", "0K14", "0K15", "0K16", "K 07", "0K18", "0K19", "0K20", "0K21", "0K22", "0K23", "0L01", "0L02", "0L03", "0L04", "0L05", "0L06", "0L07", "0L08", "0L09", "0L10", "0L11", "0L12", "0L13", "0L14", "0L15", "0L16", "0L17", "0L18", "0L19", "0M01", "0M02", "0M03", "0M04", "0M05", "0M06", "0M07", "0M08", "0M09", "0M10", "0M11", "0M12", "0M13", "0M14", "0M15", "0M16", "0M17", "0M18", "0M19", "0M20", "0M21", "0M22", "0M23", "M 04", "0N01", "0N02", "0N03", "0N04", "0N05", "0N06", "0N07", "0N08", "0N09", "0N10", "0N11", "0N12", "0N13"]
      , ["0N14", "0N15", "0N16", "0N17", "0N18", "0N19", "0N20", "0N21", "0N22", "0N23", "0N24", "0O01", "0O02", "0O03", "0O04", "0O05", "0O06", "0O07", "0O08", "0O09", "0O10", "0O11", "0O12", "0O13", "0O14", "0O15", "0O16", "0O17", "0O18", "0O19", "0O20", "0O21", "0O22", "0O23", "0O24", "0O25", "0O26", "0O27", "0O28", "0P01", "0P02", "0P03", "0P04", "0P05", "0P06", "0P07", "0P08", "0P09", "0P10", "0P11", "0P12", "0P13", "0P14", "0P15", "0P16", "0P17", "0P18", "0P19", "0P20", "0P21", "0P22", "0P23", "0P24", "0P25", "0P26", "0P27", "0P28", "0Q01", "0Q02", "0Q03", "0Q04", "0Q05", "0Q06", "0Q07", "0Q08", "0Q09", "0Q10", "0Q11", "0Q12", "0Q13", "0Q14", "0Q15", "0Q16", "0Q17", "0Q18", "0Q19", "0Q20", "0Q21", "0Q22", "0Q23", "0Q24", "0Q25", "0Q26", "0Q27", "0Q28", "0R01", "0R02", "0R03", "0R04", "0R05", "0R06", "0R07", "0R08", "0R09", "0R10"]
      , ["1A01", "1A02", "1A03", "1A04", "1A05", "1A06", "1A07", "1A08", "1A09", "1A10", "1A11", "1A12", "1A13", "1A14", "1A15", "1A16", "1A17", "1A18", "1A19", "1A20", "1A21", "1A22", "1A23", "1A24", "1A25", "1A26", "1A27", "1A28", "1A29", "1B01", "1B02", "1B03", "1B04", "1B05", "1B06", "1B07", "1B08", "1B09", "1B10", "1B11", "1B12", "1B13", "1B14", "1B15", "1B16", "1B17", "1B18", "1B19", "1B20", "1B21", "1B22", "1B23", "1B24", "1B25", "1C01", "1C02", "1C03", "1C04", "1C05", "1C06", "1C07", "1C08", "1C09", "1C10", "1C11", "1C12", "1C13", "1C14", "1C15", "1C16", "1C17", "1C18", "1C19", "1C20", "1C21", "1C22", "1C23", "1C24", "1C25", "1C26", "1C27", "1C28", "1D01", "1D02", "1D03", "1D04", "1D05", "1D06", "1D07", "1D08", "1D09", "1D10", "1D11", "1D12", "1D13", "1D14", "1D15", "1D16", "1D17", "1D18", "1D19", "1D20", "1D21", "1D22", "1D23"]
      , ["1D24", "1D25", "1D26", "1D27", "1D28", "1E01", "1E02", "1E03", "1E04", "1E05", "1E06", "1E07", "1E08", "1E09", "1E10", "1E11", "1E12", "1E13", "1E14", "1E15", "1E16", "1E17", "1E18", "1E19", "1E20", "1E21", "1E22", "1E23", "1E24", "1E25", "1E26", "1E17", "1E28", "1F01", "1F02", "1F03", "1F04", "1F05", "1F06", "1F07", "1F08", "1F09", "1F10", "1F11", "1F12", "1F13", "1F14", "1F15", "1F16", "1F17", "1F18", "1F19", "1F20", "1F21", "1F22", "1F23", "1F24", "1F25", "1F26", "1G01", "1G02", "1G03", "1G04", "1G05", "1G06", "1G07", "1G08", "1G09", "1G10", "1G11", "1G12", "1G13", "1G14", "1G15", "1G16", "1G17", "1G18", "1G19", "1G20", "1G21", "1G22", "1G23", "1G24", "1G25", "1G26", "1H03", "1H04", "1H05", "1H06", "1H07", "1H08", "1H09", "1H10", "1H11", "1H12", "1H13", "1H14", "1H15", "1H16", "1H17", "1H18", "1H19", "1H20", "1H21", "1H22"]
      , ["2A01", "2A02", "2A03", "2A04", "2A05", "2A06", "2A07", "2A0 ", "2A09", "2A10", "2A11", "2A12", "2A13", "2A14", "2A15", "2A16", "2B01", "2B02", "2B03", "2B04", "2B05", "2B06", "2B07", "2B08", "2B09", "2B10", "2B11", "2B12", "2B13", "2B14", "2B15", "2B16", "2C02", "2C03", "2C04", "2C05", "2C06", "2C07", "2C08", "2C09", "2C10", "2C11", "2C12", "2C13", "2C14", "2C15", "2C16", "2D01", "2D02", "2D03", "2D04", "2D05", "2D06", "2D07", "2D08", "2D09", "2D10", "2D11", "2D12", "2D13", "2D14", "2D15", "2D16", "2E03", "2E04", "2E05", "2E06", "2E08", "2E09", "2E11", "2E12", "2E13", "2E14", "2E16", "2F02", "2F03", "2F04", "2F05", "2F06", "2F07", "2F08", "2F09", "2F10", "2F11", "2F12", "2F13", "2F14", "2F15", "2F16", "2G01", "2G02", "2G03", "2G04", "2G05", "2G06", "2G07", "2G08", "2G09", "2G10", "2G11", "2G12", "2G13", "2G14", "2G15", "2G16"]
      , ["2H01", "2H02", "2H03", "2H04", "2H05", "2H06", "2H07", "2H08", "2H09", "2H10", "2H11", "2H12", "2H13", "2H14", "2H15", "2H16", "2I01", "2I02", "2I03", "2I04", "2I05", "2I06", "2I07", "2I08", "2I09", "2I10", "2I11", "2I12", "2I13", "2I14", "2I15", "2I16", "2K01", "2K02", "2K03", "2K04", "2K05", "2K06", "2K07", "2K08", "2K09", "2K10", "2K11", "2K12", "2K13", "2K14", "2K15", "2K16", "2L03", "2L04", "2L05", "2L06", "2L07", "2L08", "2L09", "2L10", "2L11", "2L12", "2L13", "2L14", "2L15", "2L16", "2M03", "2M04", "2M05", "2M06", "2M07", "2M08", "2M09", "2M10", "2M11", "2M12", "2M13", "2M14", "2M15", "2M16", "2N03", "2N04", "2N05", "2N06", "2N07", "2N08", "2N09", "2N10", "2N11", "2N12", "2N13", "2N14", "2N15", "2N16", "2O03", "2O04", "2O05", "2O06", "2O07", "2O08", "2O09", "2O10", "2O11", "2O12", "2O13", "2O14", "2O15", "2O16", "2P03"]
      , ["2P04", "2P05", "2P06", "2P09", "2P11", "2P12", "2P13", "2P14", "2P16", "2Q03", "2Q04", "2Q05", "2Q06", "2Q07", "2Q08", "2Q09", "2Q10", "2Q11", "2Q12", "2Q13", "2Q14", "2Q15", "2Q16", "2R03", "2R04", "2R05", "2R06", "2R07", "2R08", "2R09", "2R10", "2R11", "2R12", "2R13", "2R14", "2R15", "2R16", "2S03", "2S04", "2S05", "2S06", "2S07", "2S08", "2S09", "2S10", "2S11", "2S12", "2S13", "2S14", "2S15", "2S16", "2T03", "2T04", "2T05", "2T06", "2T07", "2T08", "2T09", "2T10", "2T11", "2T12", "2T13", "2T14", "2T15", "2T16", "2U03", "2U04", "2U05", "2U06", "2U08", "2U09", "2U11", "2U12", "2U13", "2U14", "2V03", "2V04", "2V05", "2V06", "2V07", "2V08", "2V09", "2V10", "2V11", "2V12", "2V13", "2V14", "2V15", "2V16", "2X03", "2X04", "2X05", "2X06", "2X07", "2X08", "2X09", "2X10", "2X11", "2X12", "2X13", "2X14", "2X15", "2X16", "2Y03", "2Y04"]
      , ["3A01", "3A02", "3A03", "3A04", "3A05", "3A06", "3A07", "3A08", "3A09", "3A10", "3A11", "3A12", "3A13", "3A14", "3A15", "3A16", "3A17", "3A18", "3A19", "3B01", "3B02", "3B03", "3B04", "3B05", "3B06", "3B07", "3B08", "3B09", "3B10", "3B11", "3B12", "3B13", "3B14", "3B15", "3B16", "3C01", "3C02", "3C03", "3C04", "3C05", "3C06", "3C07", "3C08", "3C09", "3C10", "3C11", "3C12", "3C13", "3C14", "3C15", "3C16", "3D01", "3D02", "3D03", "3D04", "3D05", "3D06", "3D07", "3D08", "3D09", "3D10", "3D11", "3D12", "3D13", "3D14", "3D15", "3D16", "3E01", "3E02", "3E03", "3E04", "3E05", "3E06", "3E07", "3E08", "3E09", "3E10", "3E11", "3E12", "3E13", "3E14", "3E15", "3E16", "3F01", "3F02", "3F03", "3F04", "3F05", "3F06", "3F07", "3F08", "3F09", "3F10", "3F11", "3F12", "3F13", "3F14", "3F15", "3F16", "3G01", "3G02", "3G03", "3G04", "3G05", "3G06"]
      , ["3G07", "3G08", "3G09", "3G10", "3G11", "3G12", "3G13", "3G14", "3G15", "3G16", "3H01", "3H02", "3H03", "3H04", "3H05", "3H06", "3H07", "3H08", "3H09", "3H10", "3H11", "3H12", "3H13", "3H14", "3H15", "3H16", "3I01", "3I02", "3I03", "3I04", "3I05", "3I06", "3I07", "3I08", "3I09", "3I10", "3I11", "3I12", "3I13", "3I14", "3I15", "3I16", "3K01", "3K02", "3K03", "3K04", "3K05", "3K06", "3K07", "3K08", "3K09", "3K10", "3K11", "3K12", "3K13", "3K14", "3K15", "3K16", "3L01", "3L02", "3L03", "3L04", "3L05", "3L06", "3L07", "3L08", "3L09", "3L10", "3L11", "3L12", "3L13", "3L14", "3L15", "3L16", "3M01", "3M02", "3M03", "3M04", "3M05", "3M06", "3M07", "3M08", "3M09", "3M10", "3M11", "3M12", "3M13", "3M14", "3M15", "3M16", "3N01", "3N02", "3N03", "3N04", "3N05", "3N06", "3N07", "3N08", "3N09", "3N10", "3N11", "3N12", "3N13", "3N14", "3N15"]
      , ["3N16", "3O01", "3O02", "3O03", "3O04", "3O05", "3O06", "3O07", "3O08", "3O09", "3O10", "3O11", "3O12", "3O13", "3O14", "3O15", "3O16", "3P01", "3P02", "3P03", "3P04", "3P05", "3P06", "3P07", "3P10", "3P11", "3P12", "3P13", "3P14", "3P15", "3P16", "3Q01", "3Q02", "3Q03", "3Q04", "3Q05", "3Q06", "3Q07", "3Q10", "3Q11", "3Q12", "3Q13", "3Q14", "3Q15", "3Q16", "3R01", "3R02", "3R03", "3R04", "3R05", "3R06", "3R07", "3R08", "3R09", "3R10", "3R11", "3R12", "3R13", "3R14", "3R15", "3R16", "3S01", "3S02", "3S03", "3S04", "3S05", "3S06", "3S07", "3S08", "3S09", "3S10", "3S11", "3S12", "3S13", "3S14", "3S15", "3S16", "3T01", "3T02", "3T03", "3T04", "3T05", "3T06", "3T07", "3T08", "3T09", "3T10", "3T11", "3T12", "3T13", "3T14", "3T15", "3T16", "3U01", "3U02", "3U03", "3U04", "3U05", "3U06", "3U07", "3U08", "3U09", "3U10", "3U11", "3U12"]
      , ["0R11", "0R12", "0R13", "0R14", "0R15", "0R16", "0R17", "0R18", "0R19", "0R20", "0R21", "0R22", "0R23", "0R24", "0R25", "0R26", "0S01", "0S02", "0S03", "0S04", "0S05", "0S06", "0S07", "0S08", "0S09", "0S10", "0S11", "0S12", "0S13", "0S14", "0S15", "0S16", "0S17", "0S18", "0S19", "0S20", "0S21", "0S22", "0S23", "0S24", "0S25", "0S26", "0T01", "0T02", "0T03", "0T04", "0T05", "0T06", "0T07", "0T08", "0T09", "0T10", "0T11", "0T12", "0T13", "0T14", "0T15", "0T16", "0T17", "0T18", "0T19", "0T20", "0T21", "0T22", "0T23", "0T24", "0T25", "0T26", "0U01", "0U03", "0U04", "0U05", "0U06", "0U07", "0U08", "0U09", "0U10", "0U11", "0U12", "0U13", "0U14", "0U15", "0U16", "0U17", "0U18", "0U19", "0U20", "0U21", "0U22", "1H23", "1H24", "1I03", "1I04", "1I05", "1I06", "1I07", "1I08", "1I09", "1I10", "1I11", "1I12", "1I13", "1I14", "1I15", "1I16"]
      , ["2Y05", "2Y06", "2Y07", "2Y08", "2Y09", "2Y10", "2Y11", "2Y12", "2Y13", "2Y14", "2Y15", "2Y16", "2Z03", "2Z04", "2Z05", "2Z06", "2Z07", "2Z08", "2Z09", "2Z10", "2Z11", "2Z12", "2Z13", "2Z14", "2Z15", "2Z16", "2AA3", "2AA4", "2AA5", "2AA6", "2AA7", "2AA8", "2AA9", "2AA10", "2AA11", "2AA12", "2AA13", "2AA14", "2AA15", "2AA16", "3U13", "3U14", "3U15", "3U16", "3V01", "3V02", "3V03", "3V04", "3V05", "3V06", "3V07", "3V08", "3V09", "3V10", "3V11", "3V12", "3V13", "3V14", "3V15", "3V16", "3X02", "3X03", "3X04", "3X05", "3X06", "3X07", "3X08", "3X09", "3X10", "3X11", "3X12", "3X13", "3X14", "3X15", "3X16", "3Y02", "3Y03", "3Y04", "3Y05", "3Y06", "3Y07", "3Y08", "3Y09", "3Y10", "3Y11", "3Y12", "3Y13", "3Y14", "3Y15", "3Y16", "3Z01", "3Z02", "3Z03", "3Z04", "3Z05", "3Z06", "3Z07", "3Z08", "3Z09", "3Z10", "3Z11", "3Z12", "3Z12", "3Z14", "3Z15"]];
  }
  Controller.$inject = ['statService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
