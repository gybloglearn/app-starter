define([], function () {
  'use strict';
  function Controller(SumserviceService, $cookies, $state, $rootScope, $filter, $timeout) {
    var vm = this;
    vm.data = [];
    vm.pottinginfo = [];
    vm.dryarchivedata = [];
    vm.mch = "Potting4";
    vm.pottings = ["Potting3", "Potting4"];
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.startdate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.hely = ["Potting be", "Gel Prep Also F", "Uret Prep Also F", "Esztetika Also F", "Forgatas", "Uret Prep Felso F", "Esztetika Felso F", "Potting ki"];
    vm.load = load;
    vm.saveinfo = saveinfo;
    vm.beallit = beallit;
    vm.mutat = false;

    function beallit() {
      vm.enddate = $filter('date')(new Date(vm.datum).getTime() + (24 * 3600 * 1000), 'yyyy-MM-dd');
      vm.startdate = $filter('date')(new Date(vm.datum).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      vm.datumszam = vm.datum;
    }
    function load() {
      vm.dis = true;
      createdatenumber();

      SumserviceService.get(vm.startdate, vm.enddate, vm.mch).then(function (response) {
        vm.data = response.data;

        for (var i = 0; i < response.data.length; i++) {
          vm.data[i].PT_Start_DT = new Date(vm.data[i].PT_Start_DT).getTime();
          populate(vm.data[i].PT_Start_DT, 0);

          vm.data[i].PT_GEL_PREP_DT = new Date(vm.data[i].PT_GEL_PREP_DT).getTime();
          populate(vm.data[i].PT_GEL_PREP_DT, 1);

          vm.data[i].PT_URET_PREP_A_DT = new Date(vm.data[i].PT_URET_PREP_A_DT).getTime();
          populate(vm.data[i].PT_URET_PREP_A_DT, 2);

          vm.data[i].PT_POST_URET_A_DT = new Date(vm.data[i].PT_POST_URET_A_DT).getTime();
          populate(vm.data[i].PT_POST_URET_A_DT, 3);

          vm.data[i].PT_ROT_DT = new Date(vm.data[i].PT_ROT_DT).getTime();
          populate(vm.data[i].PT_ROT_DT, 4);

          vm.data[i].PT_URET_PREP_F_DT = new Date(vm.data[i].PT_URET_PREP_F_DT).getTime();
          populate(vm.data[i].PT_URET_PREP_F_DT, 5);

          vm.data[i].PT_POST_URET_F_DT = new Date(vm.data[i].PT_POST_URET_F_DT).getTime();
          populate(vm.data[i].PT_POST_URET_F_DT, 6);

          vm.data[i].PT_OUT = new Date(vm.data[i].PT_OUT).getTime();
          populate(vm.data[i].PT_OUT, 7);

        }

        loadarchivefile();
        //chartize();

        vm.dis = false;

      });
    }

    function loadarchivefile() {
      vm.dryarchivedata = [];
      var cycles = []

      var today = $filter('date')(new Date(), 'yyyy-MM-dd');
      var num1 = $filter('date')(new Date(vm.datum).getTime(), 'yyyyMMdd' + '05');
      var num2 = $filter('date')(new Date(vm.datum).getTime(), 'yyyyMMdd' + '11');
      var num3 = $filter('date')(new Date(vm.datum).getTime(), 'yyyyMMdd' + '17');
      var num4 = $filter('date')(new Date(vm.datum).getTime(), 'yyyyMMdd' + '23');

      if (new Date(vm.datum).getTime() < new Date(today).getTime()) {
        cycles.push(num1);
        cycles.push(num2);
        cycles.push(num3);
        cycles.push(num4);
      }
      else if (new Date(vm.datum).getTime() == new Date(today).getTime() && (new Date().getHours() >= 5 && new Date().getHours() < 12)) {
        cycles.push(num1);
      }
      else if (new Date(vm.datum).getTime() == new Date(today).getTime() && (new Date().getHours() >= 12 && new Date().getHours() < 18)) {
        cycles.push(num1);
        cycles.push(num2);
      }
      else if (new Date(vm.datum).getTime() == new Date(today).getTime() && new Date().getHours() >= 18) {
        cycles.push(num1);
        cycles.push(num2);
        cycles.push(num3);
      }
      console.log(cycles);
      var k = 0;
      for (var i = 0; i < cycles.length; i++) {
        SumserviceService.getArchive(cycles[i]).then(function (rsp) {
          k = k + 1;
          for (var j = 0; j < rsp.data.length; j++) {
            if (vm.mch == "Potting4" && rsp.data[j].machinename == "Drying3" && rsp.data[j].Time_to_Go < 6) {
              rsp.data[j].category = k;
              vm.dryarchivedata.push(rsp.data[j]);
            }
            else if (vm.mch == "Potting3" && rsp.data[j].machinename == "Drying2" && rsp.data[j].Time_to_Go < 6) {
              rsp.data[j].category = k;
              vm.dryarchivedata.push(rsp.data[j]);
            }
          }
          console.log(vm.dryarchivedata)
          updateline(vm.dryarchivedata);
        });
      }
    }

    function chartize() {
      vm.chartconfig = {
        chart: { type: 'column' },
        plotOptions: {
          column: {
            borderWidth: 0,
            events: {
              click: function (ev) {
                console.log(ev.point.options.cat + " - " + ev.point.series.name);
                createinfo(ev.point.options.cat);
              }
            }
          }
        },
        tooltip: { shared: true },
        xAxis: { type: 'category', categories: vm.cats },
        yAxis: { tickInterval: 2 },
        title: { text: vm.mch + ' termelt modulok óránként' },
        series: vm.chartData
      }
    }

    function populate(datapoint, index) {
      if (datapoint < vm.vege && datapoint >= vm.kezdo) {
        for (var j = 0; j < vm.chartData[index].data.length; j++) {
          if (vm.chartData[index].data[j].cat == $filter('date')(datapoint, 'MMdd HH')) {
            if (new Date(vm.datum) < new Date("2017-09-01")) {
              if (parseInt($filter('date')(datapoint, 'HH')) > 5 && parseInt($filter('date')(datapoint, 'HH')) < 14) {
                vm.chartData[index].data[j].sh = 1;
              } else if (parseInt($filter('date')(datapoint, 'HH')) > 13 && parseInt($filter('date')(datapoint, 'HH')) < 22) {
                vm.chartData[index].data[j].sh = 2;
              } else {
                vm.chartData[index].data[j].sh = 3;
              }
            } else {
              if (parseInt($filter('date')(datapoint, 'HH')) > 5 && parseInt($filter('date')(datapoint, 'HH')) < 18) {
                vm.chartData[index].data[j].sh = 1;
              } else {
                vm.chartData[index].data[j].sh = 3;
              }
            }
            vm.chartData[index].data[j].y++;
          }
        }
      }
    }

    function createdatenumber() {
      vm.kezdo = new Date(vm.datum + " 05:50:50").getTime();
      vm.vege = vm.kezdo + 24 * 60 * 60 * 1000;

      vm.cats = [];
      vm.chartData = [
        { name: 'Potting Be', color: 'rgb(250,150,100)', data: [] },
        { visible: false, name: 'Gel_PREP', color: 'rgb(100,200,50)', data: [] },
        { visible: false, name: 'Uret PREP A', color: 'rgb(30,130,180)', data: [] },
        { visible: false, name: 'Esztetika A', color: 'rgb(200,50,50)', data: [] },
        { visible: false, name: 'Fordit', color: 'rgb(150,220,100)', data: [] },
        { visible: false, name: 'Uret PREP F', color: 'rgb(50,150,200)', data: [] },
        { visible: false, name: 'Esztetika F', color: 'rgb(250,100,100)', data: [] },
        { visible: false, name: 'Potting Ki', color: 'rgb(250,200,150)', data: [] },
        { name: 'Cél', color:'rgb(255,0,0)', type: 'line', data: [] }
      ];
      for (var k = 1; k < 25; k++) {
        vm.cats.push($filter('date')(vm.kezdo + k * 60 * 60 * 1000, "MMdd HH"));
        for (var i = 0; i < vm.chartData.length-1; i++) {
          vm.chartData[i].data.push({ cat: $filter('date')(vm.kezdo + k * 60 * 60 * 1000, "MMdd HH"), y: 0, sh: 0 });
        }
      }
    }

    function updateline(arr) {
      vm.linenumbers = [];

      var number1=0;
      var number2=0;
      var number3=0;
      var number4=0;

      for (var i = 0; i < 24; i++) {
        vm.linenumbers[i] = 0;
      }

      for(var i=0;i<arr.length;i++){
        if(arr[i].category==1){
          number1++;
        }
        if(arr[i].category==2){
          number2++;
        }
        if(arr[i].category==3){
          number3++;
        }
        if(arr[i].category==4){
          number4++;
        }
      }
      if(vm.mch=="Potting4"){
        if(number1>24){
          number1=24
        }
        if(number2>24){
          number2=24
        }
        if(number3>24){
          number3=24
        }
        if(number4>24){
          number4=24
        }
      }
      if(vm.mch=="Potting3"){
        if(number1>18){
          number1=18
        }
        if(number2>18){
          number2=18
        }
        if(number3>18){
          number3=18
        }
        if(number4>18){
          number4=18
        }
      }
      for(var i=0;i<24;i++){
        if(i>=0 && i<6){
          vm.linenumbers[i]=Math.round(number1/6)*2;
        }
        else if(i>=6 && i<12){
          vm.linenumbers[i]=Math.round(number2/6)*2;
        }
        else if(i>=12 && i<18){
          vm.linenumbers[i]=Math.round(number3/6)*2;
        }
        else{
          vm.linenumbers[i]=Math.round(number4/6)*2;
        }
      }
      console.log(vm.linenumbers);
      vm.chartData[vm.chartData.length-1].data = vm.linenumbers;
      chartize();
    }

    function loadinfo() {
      vm.pottinginfo = [];

      SumserviceService.getAll().then(function (resp) {
        vm.pottinginfo = resp.data;
        console.log(vm.pottinginfo);
      });
    }

    function createinfo(str) {

      vm.createinfodata = {};
      vm.actplace = "";
      vm.descriptioninfo = "";
      vm.startinfo = new Date().getFullYear() + "-" + str.substring(0, 2) + "-" + str.substring(2, 7) + ":" + "00";
      vm.endinfo = new Date().getFullYear() + "-" + str.substring(0, 2) + "-" + str.substring(2, 7) + ":" + "00";

      loadinfo();
      vm.mutat = true;
    }

    function saveinfo() {

      vm.createinfodata.id = new Date().getTime();
      vm.createinfodata.start = vm.startinfo;
      vm.createinfodata.end = vm.endinfo;
      vm.createinfodata.time = vm.timeinfo = (new Date(vm.endinfo).getTime() - new Date(vm.startinfo).getTime()) / 60000;
      vm.createinfodata.pottingid = vm.mch;
      vm.createinfodata.place = vm.actplace;
      vm.createinfodata.description = vm.descriptioninfo;
      vm.createinfodata.opid = $rootScope.user.username;
      vm.createinfodata.opname = $rootScope.user.displayname

      SumserviceService.post(vm.createinfodata).then(function (resp) {
        vm.showmessage = true;
        vm.createinfodata = {};
        $timeout(function () {
          vm.showmessage = false;
          vm.showtitle = '';
        }, 5000);
      });
      //loadinfo();
      vm.mutat = false;
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['SumserviceService', '$cookies', '$state', '$rootScope', '$filter', '$timeout'];
  return Controller;
});