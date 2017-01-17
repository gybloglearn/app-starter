define([], function () {
  'use strict';
  function Controller(PottingService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.potting = [];
    vm.moredays = [];
    vm.mch = "Potting4"
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.allpotting = ["Potting4", "Potting3", "Potting2"];
    vm.load = load;
    vm.load_more = load_more;
    vm.datumszam = vm.datum;
    vm.datszam = csere;

    function csere() {
      vm.szam = new Date(vm.datum);
      vm.datumszam = $filter('date')(vm.szam, 'yyyy-MM-dd');
    }



    function load(mch, datum) {
      vm.dis = true;
      vm.potting = [];

      PottingService.get(mch, datum).then(function (response) {
        vm.potting = response.data;
        vm.dis = false;
        for(var i=0;i<vm.potting.length;i++)
        {
          var mystring=vm.potting[i].name;
          var substring1 = "_IN-IN";
          var substring2 = "_P3-P3";
          var substring3 = "_OUT-OUT";

          if(mystring.includes(substring1))
          {
            mystring=mystring.substr(0,mystring.length-6);
            for (var j = 0; j < vm.aeqs.length; j++){
              if(mystring==vm.aeqs[j].name)
              {
                vm.potting[i].aeq=vm.potting[i].amount*vm.aeqs[j].amount;
              }
            }
          }
          else if(mystring.includes(substring2))
          {
            mystring=mystring.substr(0,mystring.length-6);
            for (var j = 0; j < vm.aeqs.length; j++){
              if(mystring==vm.aeqs[j].name)
              {
                vm.potting[i].aeq=vm.potting[i].amount*vm.aeqs[j].amount;
              }
            }
          }
          else if(mystring.includes(substring3))
          {
            mystring=mystring.substr(0,mystring.length-8);
            for (var j = 0; j < vm.aeqs.length; j++){
              if(mystring==vm.aeqs[j].name)
              {
                vm.potting[i].aeq=vm.potting[i].amount*vm.aeqs[j].amount;
              }
            }
          }

          if(vm.potting[i].shiftnum==1)
          {
            vm.potting[i].shiftname=$filter('shift')(vm.potting[i].shiftnum, vm.potting[i].days);
          }
          else if(vm.potting[i].shiftnum==2)
          {
            vm.potting[i].shiftname=$filter('shift')(vm.potting[i].shiftnum, vm.potting[i].days);
          }
          else if(vm.potting[i].shiftnum==3)
          {
            vm.potting[i].shiftname=$filter('shift')(vm.potting[i].shiftnum, vm.potting[i].days);
          }
        }

        console.log(vm.potting);
      });
    }

    function load_more(mch, kezdodatum, vegdatum) {
      PottingService.getdays(mch, kezdodatum, vegdatum).then(function (response) {
        vm.moredays = response.data;

        for (var i = 0; i < vm.moredays.length; i++) {
          var nowstring = vm.moredays[i].name;
          var substring1 = "_IN-IN";
          var substring2 = "_P3-P3";
          var substring3 = "_OUT-OUT";

          if (nowstring.includes(substring1)) {
            nowstring = nowstring.substr(0, nowstring.length - 6);
            for (var j = 0; j < vm.aeqs.length; j++) {
              if (nowstring == vm.aeqs[j].name) {
                vm.moredays[i].aeq = vm.moredays[i].amount * vm.aeqs[j].amount;
              }
            }
          }

          else if (nowstring.includes(substring2)) {
            nowstring = nowstring.substr(0, nowstring.length - 6);
            for (var j = 0; j < vm.aeqs.length; j++) {
              if (nowstring == vm.aeqs[j].name) {
                vm.moredays[i].aeq = vm.moredays[i].amount * vm.aeqs[j].amount;
              }
            }
          }
          else if (nowstring.includes(substring3)) {
            nowstring = nowstring.substr(0, nowstring.length - 8);
            for (var j = 0; j < vm.aeqs.length; j++) {
              if (nowstring == vm.aeqs[j].name) {
                vm.moredays[i].aeq = vm.moredays[i].amount * vm.aeqs[j].amount;
              }
            }
          }
          if (vm.moredays[i].shiftnum == 1) {
            vm.moredays[i].shiftname = $filter('shift')(1, vm.moredays[i].days);
          }
          else if (vm.moredays[i].shiftnum == 2) {
            vm.moredays[i].shiftname = $filter('shift')(2, vm.moredays[i].days);
          }
          else if (vm.moredays[i].shiftnum == 3) {
            vm.moredays[i].shiftname = $filter('shift')(3, vm.moredays[i].days);
          }
        }
        console.log(vm.moredays);
          setChart(mch);
      });
    }


    function setChart(mch) {
      vm.mch = mch;
      vm.chartConfig = {
        chart: {
          type: 'column'
        },
        xAxis: {
          categories: feltolt_days()
        },
        yAxis: {
          title: {
            text: 'AEQ'
          }
        },
        title: { text: vm.mch },
        series: [{
          name: "Délelőtt",
          data: [1, 25, 6, 7, 30]
        },
        {
          name: "Délután",
          data: [4, 5, 12, 22, 9]
        },
        {
          name: "Éjszaka",
          data: [7, 8, 10, 31, 13]
        }],
      }
    }

    function feltolt_days() {
      var aktday = new Date(vm.kezdo).getTime();
      var finishday = new Date(vm.vege).getTime();
      var napok = [];
      var i = 0;
      while (aktday <= finishday) {
        napok[i] = $filter('date')(aktday, 'MM-dd');
        aktday = aktday + (24 * 3600 * 1000);
        i++
      }
      return napok;
    }


    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load(vm.mch, vm.datum);
    }
    vm.aeqs = [
      { name: "Ds12 FLOW", amount: 0.6 },
      { name: "DS-D12 FLOW", amount: 0.6 },
      { name: "ZW220 CP5", amount: 0.44 },
      { name: "ZW220 FLOW", amount: 0.44 },
      { name: "ZW230 FLOW", amount: 0.46 },
      { name: "ZW230 CP5", amount: 0.46 },
      { name: "C11CP5", amount: 0.5 },
      { name: "C11 CP5", amount: 0.5 },
      { name: "C11FLOW", amount: 0.5 },
      { name: "C11 FLOW", amount: 0.5 },
      { name: "D11 CP5", amount: 0.68 },
      { name: "D13 CP5", amount: 0.88 },
      { name: "D13 CP", amount: 0.88 },
      { name: "D12 FLOW", amount: 0.74 },
      { name: "D11 FLOW", amount: 0.68 },
      { name: "A27 CP5", amount: 1 },
      { name: "A27_CP5", amount: 1 },
      { name: "A27 FLOW", amount: 1 },
      { name: "A27_FLOW", amount: 1 },
      { name: "B32 CP5", amount: 1.3 },
      { name: "B32_CP5", amount: 1.3 },
      { name: "B32 FLOW", amount: 1.3 },
      { name: "B32_FLOW", amount: 1.3 },
      { name: "DS- D13 CP5", amount: 0.7 },
      { name: "DS-D11 FLOW", amount: 0 },
      { name: "DS-D11 CP5", amount: 0 },
      { name: "DS-D13 CP5", amount: 0.7 },
      { name: "ZB500S", amount: 0.6 },
      { name: "D11 K", amount: 0 }
    ];
  }
  Controller.$inject = ['PottingService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
