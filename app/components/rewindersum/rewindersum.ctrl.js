define([], function () {
  'use strict';
  function Controller(rewindersumService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    
    vm.startdate=$filter('date')(new Date().getTime()-7*24*3600*1000, 'yyyy-MM-dd');
    vm.enddate=$filter('date')(new Date().getTime()-24*3600*1000, 'yyyy-MM-dd');
    vm.startdatenum=$filter('date')(new Date().getTime()-7*24*3600*1000, 'yyyy-MM-dd');
    vm.enddatenum=$filter('date')(new Date().getTime()-24*3600*1000, 'yyyy-MM-dd');
    vm.data=[];
    vm.load=load;
    vm.beallit=beallit;

    function beallit(){
      vm.startdatenum = $filter('date')(new Date(vm.startdate), 'yyyy-MM-dd');
      vm.enddatenum = $filter('date')(new Date(vm.enddate), 'yyyy-MM-dd');
    }

    function load(){
      vm.data=[];

      var datediff=(new Date(vm.enddate).getTime()-new Date(vm.startdate).getTime())/(24*3600*1000)+1;
      for(var i=datediff;i>0;i--){
        var actnum=$filter('date')(new Date(vm.enddate).getTime()-(i-1)*24*3600*1000, 'yyyyMMdd');
        
        rewindersumService.get(actnum).then(function (response) {
          for(var j=0;j<response.data.length;j++){
            response.data[j].shift=$filter('shift')(response.data[j].ShiftNum,response.data[j].date);
            response.data[j].ProducedLength=response.data[j].ProducedLength*1;
            response.data[j].P_Count=response.data[j].P_Count*1;
            vm.data.push(response.data[j])
          }
          createchartdata(vm.data,datediff);
        });
      }
    }

    function createchartdata(arr,num){
      
      vm.chartdata=[];
      for(var i=num;i>0;i--){
        var obj = {};
        obj = {
          date:$filter('date')(new Date(vm.enddate).getTime()-(i-1)*24*3600*1000, 'yyyy-MM-dd'),
          dayaeq:0,
          daycount:0,
          nightaeq:0,
          nightcount:0
        }
        vm.chartdata.push(obj);
      }
      for(var j=0;j<vm.chartdata.length;j++){
        for(var k=0;k<arr.length;k++){
          if(vm.chartdata[j].date==arr[k].date && arr[k].ShiftNum=="1"){
            vm.chartdata[j].dayaeq+=(arr[k].ProducedLength/9300);
            vm.chartdata[j].daycount+=arr[k].P_Count;
          }
          else if(vm.chartdata[j].date==arr[k].date && arr[k].ShiftNum=="3"){
            vm.chartdata[j].nightaeq+=(arr[k].ProducedLength/9300);
            vm.chartdata[j].nightcount+=arr[k].P_Count;
          }
        }
      }
      console.log(vm.chartdata);
      setChart(vm.chartdata);
    }

    function setChart(ar){
      vm.chartconfig_col={
        chart: {
          type: 'column',
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        title: { text: "Összesítő"},
        series: [
          {
            name: 'Nappal AEQ',
            color: "#ff6600",
            data: nap_aeq(ar),
            stack: 'AEQ'
          },
          {
            name: 'Éjjel AEQ',
            color: "#0066ff",
            data: ej_aeq(ar),
            stack: 'AEQ'
          },
          {
            name: 'Nappal Dob',
            color: "#ffcc00",
            data: nap_dob(ar),
            stack: 'Dob'
          },
          {
            name: 'Éjjel Dob',
            color: "#00ccff",
            data: ej_dob(ar),
            stack: 'Dob'
          }],
          xAxis: [
            { categories: feltolt_x(ar) },
          ],
          yAxis: {
            title: {
              text: "AEQ-Dob"
            }
          }
      }
    }

    function nap_aeq(t){
      var daeq=[]
      for(var i=0;i<t.length;i++){
        daeq.push(parseInt(t[i].dayaeq));
      }
      return daeq;
    }
    function ej_aeq(t){
      var naeq=[]
      for(var i=0;i<t.length;i++){
        naeq.push(parseInt(t[i].nightaeq));
      }
      return naeq;
    }
    function nap_dob(t){
      var dd=[]
      for(var i=0;i<t.length;i++){
        dd.push(t[i].daycount);
      }
      return dd;
    }
    function ej_dob(t){
      var nd=[]
      for(var i=0;i<t.length;i++){
        nd.push(t[i].nightcount);
      }
      return nd;
    }
    function feltolt_x(t){
      var dates=[]
      for(var i=0;i<t.length;i++){
        dates.push(t[i].date);
      }
      return dates;
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.edate=$filter('date')(new Date().getTime()-24*3600*1000, 'yyyy-MM-dd');
      load();
    }
  }
  Controller.$inject = ['rewindersumService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
