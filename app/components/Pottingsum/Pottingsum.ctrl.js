define([], function () {
  'use strict';
  function Controller(SumserviceService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.selectdatas = [];
    vm.selecthour = [];
    vm.mch = "Potting4"
    vm.pottings = ["Potting3", "Potting4"];
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.startdate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.load = load;
    vm.beallit = beallit;

    function beallit() {
      vm.enddate = $filter('date')(new Date(vm.datum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      vm.startdate = $filter('date')(new Date(vm.datum).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      vm.datumszam = vm.datum;
    }

    function load() {
      createdatenumber();

      vm.dis = true;
      vm.Pottingloading = true;
      vm.data = [];
      vm.selectdatas = [];
      vm.selecthour = [];

      for (var i = 0; i < 3; i++) {
        vm.selectdatas[i] = {}
        vm.selectdatas[i].SHIFT = $filter('shift')(i + 1, vm.datum) + " ";
        vm.selectdatas[i].START = 0;
        vm.selectdatas[i].GEL_PREP = 0;
        vm.selectdatas[i].URET_PREP_A = 0;
        vm.selectdatas[i].POST_URET_A = 0;
        vm.selectdatas[i].ROT = 0;
        vm.selectdatas[i].URET_PREP_F = 0;
        vm.selectdatas[i].POST_URET_F = 0;
        vm.selectdatas[i].END = 0;
        vm.selectdatas[i].MODULS = [[], [], [], [], [], [], [], []];
      }

      for (var i = 0; i < 24; i++) {
        vm.selecthour[i] = {}
        if (i < 19) {
          vm.selecthour[i].TIME = (i + 5) * 60 + 50;
        }
        else {
          vm.selecthour[i].TIME = (i - 19) * 60 + 50;
        }
        vm.selecthour[i].START = 0;
        vm.selecthour[i].GEL = 0;
        vm.selecthour[i].URETA = 0;
        vm.selecthour[i].PURETA = 0;
        vm.selecthour[i].ROT = 0;
        vm.selecthour[i].URETF = 0;
        vm.selecthour[i].PURETF = 0;
        vm.selecthour[i].END = 0;
      }

      SumserviceService.get(vm.startdate, vm.enddate, vm.mch).then(function (response) {
        vm.data = response.data;
        vm.dis = false;
        var start1 = 0;
        var gelszam1 = 0;
        var uretalso1 = 0;
        var uretalsoesztetika1 = 0;
        var ford1 = 0;
        var uretfelso1 = 0;
        var uretfelsoesztetika1 = 0;
        var end1 = 0;

        for (var i = 0; i < vm.data.length; i++) {
          var startdate = new Date(vm.data[i].PT_Start_DT).getTime();
          var actszam = new Date(vm.data[i].PT_Start_DT).getHours() * 60 + new Date(vm.data[i].PT_Start_DT).getMinutes();
          var startszam = 0;
          if (actszam >= 350 && actszam < 830) {
            startszam = 1;
          }
          else if (actszam >= 830 && actszam < 1310) {
            startszam = 2;
          }
          else {
            startszam = 3;
          }

          if (actszam < 350 || actszam >= 1310) {
            vm.data[i].PT_START_S = $filter('shift')(startszam, (startdate - 24 * 3600 * 1000)) + " ";
          }
          else {
            vm.data[i].PT_START_S = $filter('shift')(startszam, startdate) + " ";
          }

          var enddate = new Date(vm.data[i].PT_OUT).getTime();
          var actszamend = new Date(vm.data[i].PT_OUT).getHours() * 60 + new Date(vm.data[i].PT_OUT).getMinutes();
          var endszam = 0;
          if (actszamend >= 350 && actszamend < 830) {
            endszam = 1;
          }
          else if (actszamend >= 830 && actszamend < 1310) {
            endszam = 2;
          }
          else {
            endszam = 3;
          }

          if (actszamend < 350 || actszamend >= 1310) {
            vm.data[i].PT_END_S = $filter('shift')(endszam, (enddate - 24 * 3600 * 1000)) + " ";
          }
          else {
            vm.data[i].PT_END_S = $filter('shift')(endszam, enddate) + " ";
          }
        }

        for (var i = 0; i < vm.data.length; i++) {
          for (var j = 0; j < vm.selectdatas.length; j++) {
            if (vm.selectdatas[j].SHIFT == vm.data[i].PT_START_S && (new Date(vm.data[i].PT_Start_DT).getTime() < vm.vege) && (new Date(vm.data[i].PT_Start_DT).getTime() >= vm.kezdo)) {
              vm.selectdatas[j].START++;
              vm.selectdatas[j].MODULS[0].push(vm.data[i].JobID);
              start1++;
            }
            if (vm.selectdatas[j].SHIFT == vm.data[i].PT_GEL_PREP_S && (new Date(vm.data[i].PT_GEL_PREP_DT).getTime() < vm.vege) && (new Date(vm.data[i].PT_GEL_PREP_DT).getTime() >= vm.kezdo)) {
              vm.selectdatas[j].GEL_PREP++;
              vm.selectdatas[j].MODULS[1].push(vm.data[i].JobID);
              gelszam1++;
            }
            if (vm.selectdatas[j].SHIFT == vm.data[i].PT_URET_PREP_A_S && (new Date(vm.data[i].PT_URET_PREP_A_DT).getTime() < vm.vege) && (new Date(vm.data[i].PT_URET_PREP_A_DT).getTime() >= vm.kezdo)) {
              vm.selectdatas[j].URET_PREP_A++;
              vm.selectdatas[j].MODULS[2].push(vm.data[i].JobID);
              uretalso1++;
            }
            if (vm.selectdatas[j].SHIFT == vm.data[i].PT_POST_URET_A_S && (new Date(vm.data[i].PT_POST_URET_A_DT).getTime() < vm.vege) && (new Date(vm.data[i].PT_POST_URET_A_DT).getTime() >= vm.kezdo)) {
              vm.selectdatas[j].POST_URET_A++;
              vm.selectdatas[j].MODULS[3].push(vm.data[i].JobID);
              uretalsoesztetika1++;
            }
            if (vm.selectdatas[j].SHIFT == vm.data[i].PT_ROT_S && (new Date(vm.data[i].PT_ROT_DT).getTime() < vm.vege) && (new Date(vm.data[i].PT_ROT_DT).getTime() >= vm.kezdo)) {
              vm.selectdatas[j].ROT++;
              vm.selectdatas[j].MODULS[4].push(vm.data[i].JobID);
              ford1++;
            }
            if (vm.selectdatas[j].SHIFT == vm.data[i].PT_URET_PREP_F_S && (new Date(vm.data[i].PT_URET_PREP_F_DT).getTime() < vm.vege) && (new Date(vm.data[i].PT_URET_PREP_F_DT).getTime() >= vm.kezdo)) {
              vm.selectdatas[j].URET_PREP_F++;
              vm.selectdatas[j].MODULS[5].push(vm.data[i].JobID);
              uretfelso1++;
            }
            if (vm.selectdatas[j].SHIFT == vm.data[i].PT_POST_URET_F_S && (new Date(vm.data[i].PT_POST_URET_F_DT).getTime() < vm.vege) && (new Date(vm.data[i].PT_POST_URET_F_DT).getTime() >= vm.kezdo)) {
              vm.selectdatas[j].POST_URET_F++;
              vm.selectdatas[j].MODULS[6].push(vm.data[i].JobID);
              uretfelsoesztetika1++;
            }
            if (vm.selectdatas[j].SHIFT == vm.data[i].PT_END_S && (new Date(vm.data[i].PT_OUT).getTime() < vm.vege) && (new Date(vm.data[i].PT_OUT).getTime() >= vm.kezdo)) {
              vm.selectdatas[j].END++;
              vm.selectdatas[j].MODULS[7].push(vm.data[i].JobID);
              end1++;
            }
          }
        }

        var start2 = 0;
        var gelszam2 = 0;
        var uretalso2 = 0;
        var uretalsoesztetika2 = 0;
        var ford2 = 0;
        var uretfelso2 = 0;
        var uretfelsoesztetika2 = 0;
        var end2 = 0;

        for (var i = 0; i < vm.data.length; i++) {
          for (var j = 0; j < vm.selecthour.length; j++) {
            if ((new Date(vm.data[i].PT_Start_DT).getTime() < vm.vege) && (new Date(vm.data[i].PT_Start_DT).getTime() >= vm.kezdo)) {
              var startszamvaltozo = new Date(vm.data[i].PT_Start_DT).getHours() * 60 + new Date(vm.data[i].PT_Start_DT).getMinutes();
              if (startszamvaltozo >= vm.selecthour[j].TIME && startszamvaltozo < vm.selecthour[j].TIME + 60) {
                vm.selecthour[j].START++;
                start2++;
              }
            }
            if ((new Date(vm.data[i].PT_GEL_PREP_DT).getTime() < vm.vege) && (new Date(vm.data[i].PT_GEL_PREP_DT).getTime() >= vm.kezdo)) {
              var gelszamvaltozo = new Date(vm.data[i].PT_GEL_PREP_DT).getHours() * 60 + new Date(vm.data[i].PT_GEL_PREP_DT).getMinutes();
              if (gelszamvaltozo >= vm.selecthour[j].TIME && gelszamvaltozo < vm.selecthour[j].TIME + 60) {
                vm.selecthour[j].GEL++;
                gelszam2++;
              }
            }
            if ((new Date(vm.data[i].PT_URET_PREP_A_DT).getTime() < vm.vege) && (new Date(vm.data[i].PT_URET_PREP_A_DT).getTime() >= vm.kezdo)) {
              var uretaszamvaltozo = new Date(vm.data[i].PT_URET_PREP_A_DT).getHours() * 60 + new Date(vm.data[i].PT_URET_PREP_A_DT).getMinutes();
              if (uretaszamvaltozo >= vm.selecthour[j].TIME && uretaszamvaltozo < vm.selecthour[j].TIME + 60) {
                vm.selecthour[j].URETA++;
                uretalso2++
              }
            }
            if ((new Date(vm.data[i].PT_POST_URET_A_DT).getTime() < vm.vege) && (new Date(vm.data[i].PT_POST_URET_A_DT).getTime() >= vm.kezdo)) {
              var puretaszamvaltozo = new Date(vm.data[i].PT_POST_URET_A_DT).getHours() * 60 + new Date(vm.data[i].PT_POST_URET_A_DT).getMinutes();
              if (puretaszamvaltozo >= vm.selecthour[j].TIME && puretaszamvaltozo < vm.selecthour[j].TIME + 60) {
                vm.selecthour[j].PURETA++;
                uretalsoesztetika2++;
              }
            }
            if ((new Date(vm.data[i].PT_ROT_DT).getTime() < vm.vege) && (new Date(vm.data[i].PT_ROT_DT).getTime() >= vm.kezdo)) {
              var rotszamvaltozo = new Date(vm.data[i].PT_ROT_DT).getHours() * 60 + new Date(vm.data[i].PT_ROT_DT).getMinutes();
              if (rotszamvaltozo >= vm.selecthour[j].TIME && rotszamvaltozo < vm.selecthour[j].TIME + 60) {
                vm.selecthour[j].ROT++;
                ford2++;
              }
            }
            if ((new Date(vm.data[i].PT_URET_PREP_F_DT).getTime() < vm.vege) && (new Date(vm.data[i].PT_URET_PREP_F_DT).getTime() >= vm.kezdo)) {
              var uretfszamvaltozo = new Date(vm.data[i].PT_URET_PREP_F_DT).getHours() * 60 + new Date(vm.data[i].PT_URET_PREP_F_DT).getMinutes();
              if (uretfszamvaltozo >= vm.selecthour[j].TIME && uretfszamvaltozo < vm.selecthour[j].TIME + 60) {
                vm.selecthour[j].URETF++;
                uretfelso2++;
              }
            }
            if ((new Date(vm.data[i].PT_POST_URET_F_DT).getTime() < vm.vege) && (new Date(vm.data[i].PT_POST_URET_F_DT).getTime() >= vm.kezdo)) {
              var puretfszamvaltozo = new Date(vm.data[i].PT_POST_URET_F_DT).getHours() * 60 + new Date(vm.data[i].PT_POST_URET_F_DT).getMinutes();
              if (puretfszamvaltozo >= vm.selecthour[j].TIME && puretfszamvaltozo < vm.selecthour[j].TIME + 60) {
                vm.selecthour[j].PURETF++;
                uretfelsoesztetika2++;
              }
            }
            if ((new Date(vm.data[i].PT_OUT).getTime() < vm.vege) && (new Date(vm.data[i].PT_OUT).getTime() >= vm.kezdo)) {
              var endszamvaltozo = new Date(vm.data[i].PT_OUT).getHours() * 60 + new Date(vm.data[i].PT_OUT).getMinutes();
              if (endszamvaltozo >= vm.selecthour[j].TIME && endszamvaltozo < vm.selecthour[j].TIME + 60) {
                vm.selecthour[j].END++;
                end2++;
              }
            }
          }
        }
        vm.selecthour[18].START += (start1 - start2);
        vm.selecthour[18].GEL += (gelszam1 - gelszam2);
        vm.selecthour[18].URETA += (uretalso1 - uretalso2);
        vm.selecthour[18].PURETA += (uretalsoesztetika1 - uretalsoesztetika2);
        vm.selecthour[18].ROT += (ford1 - ford2);
        vm.selecthour[18].URETF += (uretfelso1 - uretfelso2);
        vm.selecthour[18].PURETF += (uretfelsoesztetika1 - uretfelsoesztetika2);
        vm.selecthour[18].END += (end1 - end2);

        setChart(vm.mch);
        vm.Pottingloading = false;
        console.log(vm.data);
        console.log(vm.selectdatas);
      });
    }

    function createdatenumber() {
      var year = new Date(vm.datum).getFullYear();
      var month = new Date(vm.datum).getMonth() + 1;
      var day = new Date(vm.datum).getDate();
      if (month < 10) {
        var kezdo = year + "-0" + month + "-" + (day) + " 05:50:00";
        var vege = year + "-0" + month + "-" + (day + 1) + " 05:50:00";
      }
      else {
        var kezdo = year + "-" + month + "-" + day + " 05:50:00";
        var vege = year + "-" + month + "-" + (day + 1) + " 05:50:00";
      }
      vm.kezdo = new Date(kezdo).getTime();
      vm.vege = new Date(vege).getTime();
    }

    function setChart(nowpotting) {
      vm.chartconfig = {
        chart: {
          type: 'column'
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        title: { text: nowpotting + " Report" },
        series: [
          {
            name: 'Potting ki',
            color: "#66ff33",
            data: feltoltki(vm.selecthour),
            stack: 'Modulok'
          },
          {
            name: 'Felső rész esztétika',
            color: "#9933ff",
            data: feltoltpuretf(vm.selecthour),
            stack: 'Modulok'
          },
          {
            name: 'Uretán felső rész',
            color: "#660066",
            data: feltolturetf(vm.selecthour),
            stack: 'Modulok'
          },
          {
            name: 'Fordítás',
            color: "#cccc00",
            data: feltoltrot(vm.selecthour),
            stack: 'Modulok'
          },
          {
            name: 'Alsó rész esztétika',
            color: "#cc3300",
            data: feltoltpureta(vm.selecthour),
            stack: 'Modulok'
          },
          {
            name: 'Uretán alsó rész',
            color: "#ff9900",
            data: feltoltureta(vm.selecthour),
            stack: 'Modulok'
          },
          {
            name: 'Gél',
            color: "#33ccff",
            data: feltoltgel(vm.selecthour),
            stack: 'Modulok'
          },
          {
            name: 'Pottingbe',
            color: "#006600",
            data: feltoltbe(vm.selecthour),
            stack: 'Modulok'
          }
        ],
        xAxis: [
          {
            categories: feltolt_hour(),
            title: {
              text: "Óra"
            }
          },
        ],
        yAxis: {
          title: {
            text: "Modul"
          }
        },
      };
    }

    function feltoltki(tomb) {
      var ki = [];
      for (var i = 0; i < tomb.length; i++) {
        ki.push(tomb[i].END);
      }
      return ki;
    }

    function feltoltpuretf(tomb) {
      var puretf = [];
      for (var i = 0; i < tomb.length; i++) {
        puretf.push(tomb[i].PURETF);
      }
      return puretf;
    }

    function feltolturetf(tomb) {
      var uretf = [];
      for (var i = 0; i < tomb.length; i++) {
        uretf.push(tomb[i].URETF);
      }
      return uretf;
    }

    function feltoltrot(tomb) {
      var rot = [];
      for (var i = 0; i < tomb.length; i++) {
        rot.push(tomb[i].ROT);
      }
      return rot;
    }

    function feltoltpureta(tomb) {
      var pureta = [];
      for (var i = 0; i < tomb.length; i++) {
        pureta.push(tomb[i].PURETA);
      }
      return pureta;
    }

    function feltoltureta(tomb) {
      var ureta = [];
      for (var i = 0; i < tomb.length; i++) {
        ureta.push(tomb[i].URETA);
      }
      return ureta;
    }

    function feltoltgel(tomb) {
      var gel = [];
      for (var i = 0; i < tomb.length; i++) {
        gel.push(tomb[i].GEL);
      }
      return gel;
    }

    function feltoltbe(tomb) {
      var be = [];
      for (var i = 0; i < tomb.length; i++) {
        be.push(tomb[i].START);
      }
      return be;
    }

    function feltolt_hour() {
      var szamok = [];
      for (var i = 6; i < 24; i++) {
        szamok.push(i < 10 ? "0" + i : "" + i);
      }
      for (var j = 0; j < 6; j++) {
        szamok.push("0" + j);
      }
      return szamok;
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
