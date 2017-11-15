define([], function () {
  'use strict';
  function Controller(cl4Service, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.data = [];
    vm.alldata=[];
    vm.selectday = [];
    vm.charlist = [];
    vm.chartstate = "A keretet elvitték (nyugtázás a fénykapunál)"
    vm.startdate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.edate = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.datumszam = vm.startdate;
    vm.beilleszt=beilleszt;
    vm.load = load;
    vm.loadall=loadall;
    vm.selectchart = selectchart;

    function update_selectday() {
      for (var i = 0; i < 24; i++) {
        vm.selectday[i] = {}
        if (i < 18) {
          vm.selectday[i].hour = i + 6;
        }
        else {
          vm.selectday[i].hour = i - 18;
        }
        vm.selectday[i].cases = [];
      }
    }

    /*function select_3case(arr){
      vm.chartdata=[];
      vm.chartdata[0]={};
      vm.chartdata[0].name="A klórozó robot a keretet berakta az 1-es öblítő kádba";
      vm.chartdata[0].frames=[];
      vm.chartdata[1]={};
      vm.chartdata[1].name="Klórozó robot a keretet berakta a klórozó kádba";
      vm.chartdata[1].frames=[];
      vm.chartdata[2]={};
      vm.chartdata[2].name="A klórozó robot a keretet berakta a 2-es öblítő kádba";
      vm.chartdata[2].frames=[];

      for(var i=0;i<vm.chartdata.length;i++){
        for(var j=0;j<arr.length;j++){
          if(vm.chartdata[i].name==arr[j].Status_name1){
            var obj={};
            obj={
              frame:arr[j].Keret_id,
              time:arr[j].PLC_Timestamp,
              modul1:arr[j].Modul_ID1,              
              modul2:arr[j].Modul_ID2              
            }
            vm.chartdata[i].frames.push(obj);
          }
        }
      }

      console.log(vm.chartdata);
    }
*/
    function beilleszt() {
      var szam = new Date(vm.startdate);
      vm.datumszam = $filter('date')(szam, 'yyyy-MM-dd');
    }

    function load() {
      vm.mtfld=true;
      update_selectday();
      vm.data = [];
      var talalt = false;


      cl4Service.get(vm.startdate).then(function (response) {
        vm.data = response.data;
        for (var i = 0; i < vm.data.length; i++) {
          var actstate = vm.data[i].Status_name1;
          var acthour = new Date(vm.data[i].PLC_Timestamp).getHours();
          var actminute = new Date(vm.data[i].PLC_Timestamp).getMinutes();
          vm.charlist.push(actstate);
          if (actminute < 50) {
            if (acthour < 6) {
              for (var j = 0; j < vm.selectday[acthour + 17].cases.length; j++) {
                if (vm.selectday[acthour + 17].cases[j].state == actstate) {
                  vm.selectday[acthour + 17].cases[j].db++;
                  talalt = true;
                }
              }
              if (talalt == true) {
                talalt = false;
              }
              else {
                var obj = {}
                obj.state = actstate;
                obj.db = 1;
                vm.selectday[acthour + 17].cases.push(obj);
              }
            }
            else {
              for (var j = 0; j < vm.selectday[acthour - 6].cases.length; j++) {
                if (vm.selectday[acthour - 6].cases[j].state == actstate) {
                  vm.selectday[acthour - 6].cases[j].db++;
                  talalt = true;
                }
              }
              if (talalt == true) {
                talalt = false;
              }
              else {
                var obj = {}
                obj.state = actstate;
                obj.db = 1;
                vm.selectday[acthour - 6].cases.push(obj);
              }
            }
          }
          else {
            if (acthour < 6) {
              for (var j = 0; j < vm.selectday[acthour + 18].cases.length; j++) {
                if (vm.selectday[acthour + 18].cases[j].state == actstate) {
                  vm.selectday[acthour + 18].cases[j].db++;
                  talalt = true;
                }
              }
              if (talalt == true) {
                talalt = false;
              }
              else {
                var obj = {}
                obj.state = actstate;
                obj.db = 1;
                vm.selectday[acthour + 18].cases.push(obj);
              }
            }
            else {
              for (var j = 0; j < vm.selectday[acthour - 5].cases.length; j++) {
                if (vm.selectday[acthour - 5].cases[j].state == actstate) {
                  vm.selectday[acthour - 5].cases[j].db++;
                  talalt = true;
                }
              }
              if (talalt == true) {
                talalt = false;
              }
              else {
                var obj = {}
                obj.state = actstate;
                obj.db = 1;
                vm.selectday[acthour - 5].cases.push(obj);
              }
            }
          }
        }
        selectchart(vm.selectday);
        vm.mtfld=false;
        //console.log(vm.data);
        //select_3case(vm.data);
      });
    }

    function loadall(){
      vm.alldata=[];

      cl4Service.getall(vm.startdate).then(function (response) {
        vm.alldata=response.data;
      });
    }

    function selectchart(tomb) {
      var resault = [];
      for (var i = 0; i < 24; i++) {
        for (var j = 0; j < tomb[i].cases.length; j++) {
          if (tomb[i].cases[j].state == vm.chartstate) {
            resault.push(tomb[i].cases[j].db);
          }
        }
      }
      setChart(resault);
    }

    function setChart(re) {
      vm.chartconfig = {
        chart: {
          type: 'column',
        },
        title: { text: vm.chartstate },
        series: [
          {
            name: 'Termelt mennyiség',
            color: "#00b300",
            data: re
          }
        ],


        xAxis: [
          { categories: feltolt_hour() },
        ],
        yAxis: {
          title: {
            text: "Keret"
          }
        },
      };
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
      loadall();
    }
  }
  Controller.$inject = ['cl4Service', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
