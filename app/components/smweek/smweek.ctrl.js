define([], function () {
  'use strict';
  function Controller(weeklyService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.partnumbers = [];
    vm.dates = [];
    vm.filedatas = [];
    vm.sm = [];
    vm.smcards = [];
    vm.startdate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.enddate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.sheetmakers = ["SM1", "SM2", "SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    //vm.sheetmakers = ["SM4", "SM5", "SM6", "SM7", "SM8", "SM9"];
    vm.createdates = createdates;
    vm.loaddata = false;

    vm.proddata = [];
    vm.dayttl = [];
    vm.days = [];

    function loadPartnumbers() {
      vm.partnumbers = [];
      weeklyService.getpartnumber().then(function (response) {
        vm.partnumbers = response.data;
      });
    }

    function createdates() {
      vm.loaddata = true;
      vm.dates = [];
      vm.days = [];
      var differencedate = 0;
      differencedate = (new Date(vm.enddate).getTime() - new Date(vm.startdate).getTime()) / (24 * 3600 * 1000);
      for (var i = 0; i <= differencedate; i++) {
        vm.dates[i] = $filter('date')(new Date(vm.enddate).getTime() - ((differencedate - i) * 24 * 3600 * 1000), 'yyyyMMdd');
        vm.days.push({
          date: vm.dates[i], joaeq: 0, ttlaeq: 0, jolap: 0, ttllap: 0, lapselejt: 0, terv: 0, szer: 0, musz: 0, ttlido: 0
        });
      }
      callsm();
    }

    function callsm() {
      for (var i = 0; i < vm.sheetmakers.length; i++) {
        vm.sm[i] = {};
        vm.sm[i].id = vm.sheetmakers[i];
        vm.sm[i].musz = 0;
        vm.sm[i].szerv = 0;
        vm.sm[i].terv = 0;
        vm.sm[i].jo = 0;
        vm.sm[i].jaeq = 0;
        vm.sm[i].ossz = 0;
        vm.sm[i].oaeq = 0;
      }
      vm.sm[i + 1] = {}
      vm.sm[i + 1].id = "SMS";
      vm.sm[i + 1].musz = 0;
      vm.sm[i + 1].szerv = 0;
      vm.sm[i + 1].terv = 0;
      vm.sm[i + 1].jo = 0;
      vm.sm[i + 1].jaeq = 0;
      vm.sm[i + 1].ossz = 0;
      vm.sm[i + 1].oaeq = 0;

      loadsmfile();
    }

    function loadsmfile() {
      vm.filedatas = [];

      for (var i = 0; i < vm.dates.length; i++) {
        weeklyService.getsmfile(vm.dates[i]).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            //response.data[j].d = $filter('date')(new Date(response.data[j].timestamp), "yyyyMMdd");
            response.data[j].d = response.data[j].Shift_ID.substr(0, 8);
            if (vm.sheetmakers.indexOf(response.data[j].Machine) > -1) {
              vm.filedatas.push(response.data[j]);
              updatedowntime(response.data[j]);
            }
          }
        });
      }
      lodsm();
    }

    function updatedowntime(tmb) {
      for (var j = 0; j < vm.sheetmakers.length; j++) {
        if (vm.sm[j].id == tmb.Machine && tmb.Ev_Group == "Tervezett veszteseg") {
          vm.sm[j].terv += tmb.Event_time;
          vm.sm[vm.sheetmakers.length + 1].terv += tmb.Event_time;
        }
        else if (vm.sm[j].id == tmb.Machine && tmb.Ev_Group == "Szervezesi veszteseg") {
          vm.sm[j].szerv += tmb.Event_time;
          vm.sm[vm.sheetmakers.length + 1].szerv += tmb.Event_time;
        }
        else if (vm.sm[j].id == tmb.Machine && tmb.Ev_Group == "Muszaki technikai okok") {
          vm.sm[j].musz += tmb.Event_time;
          vm.sm[vm.sheetmakers.length + 1].musz += tmb.Event_time;
        }
      }

    }

    function lodsm() {
      for (var i = 0; i < vm.sheetmakers.length; i++) {
        weeklyService.getsm(vm.startdate, $filter('date')(new Date(vm.enddate).getTime() + 24 * 60 * 60 * 1000, "yyyy-MM-dd"), vm.sheetmakers[i]).then(function (response) {
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].aeq = getAEQ(vm.partnumbers, response.data[j].type, response.data[j].amount);
            for (var k = 0; k < vm.sheetmakers.length; k++) {
              if (response.data[j].shortname == vm.sm[k].id && response.data[j].category == "GOOD") {
                vm.sm[k].jo += response.data[j].amount;
                vm.sm[k].jaeq += response.data[j].aeq;
                vm.sm[vm.sheetmakers.length + 1].jo += response.data[j].amount;
                vm.sm[vm.sheetmakers.length + 1].jaeq += response.data[j].aeq;
              }
              else if (response.data[j].shortname == vm.sm[k].id && response.data[j].category == "TOTAL") {
                vm.sm[k].ossz += response.data[j].amount;
                vm.sm[k].oaeq += response.data[j].aeq;
                vm.sm[vm.sheetmakers.length + 1].ossz += response.data[j].amount;
                vm.sm[vm.sheetmakers.length + 1].oaeq += response.data[j].aeq;
              }
            }
          }
          for (var j = 0; j < response.data.length; j++) {
            response.data[j].aeq = getAEQ(vm.partnumbers, response.data[j].type, response.data[j].amount);
            for (var k = 0; k < vm.days.length; k++) {
              vm.days[k].ttlido = vm.sheetmakers.length * 1440;
              if ($filter('date')(new Date(response.data[j].days), "yyyyMMdd") == vm.days[k].date && response.data[j].category == "GOOD") {
                vm.days[k].joaeq += response.data[j].aeq;
                vm.days[k].jolap += response.data[j].amount;
              } else if ($filter('date')(new Date(response.data[j].days), "yyyyMMdd") == vm.days[k].date && response.data[j].category == "TOTAL") {
                vm.days[k].ttlaeq += response.data[j].aeq;
                vm.days[k].ttllap += response.data[j].amount;
              }
            }
          }
          updatecard(vm.sm);
        });
      }
    }

    function updatecard(smarr) {
      vm.smcards = [];
      var smskap = 0;
      var smstime = 0;
      for (var i = 0; i < vm.sheetmakers.length; i++) {
        smskap += (vm.dates.length * 1440 * 60 / 91 / 12 * 0.74) * ((vm.dates.length * 1440 - ((smarr[i].musz + smarr[i].szerv + smarr[i].terv) / 60)) / (vm.dates.length * 1440));
        smstime += vm.dates.length * 1440;
        vm.smcards.push({
          sm: smarr[i].id,
          osszlap: smarr[i].ossz,
          osszaeq: smarr[i].oaeq,
          jolap: smarr[i].jo,
          joaeq: smarr[i].jaeq,
          alltime: vm.dates.length * 1440,
          downtime: (smarr[i].musz + smarr[i].szerv + smarr[i].terv) / 60,
          muszaki: smarr[i].musz / 60,
          szervezesi: smarr[i].szerv / 60,
          tervezesi: smarr[i].terv / 60,
          kap: (vm.dates.length * 1440 * 60 / 91 / 12 * 0.74) * ((vm.dates.length * 1440 - ((smarr[i].musz + smarr[i].szerv + smarr[i].terv) / 60)) / (vm.dates.length * 1440))
        });
        setCh(vm.smcards);
      }
      var obj = {};
      obj = {
        sm: smarr[vm.sheetmakers.length + 1].id,
        osszlap: smarr[vm.sheetmakers.length + 1].ossz,
        osszaeq: smarr[vm.sheetmakers.length + 1].oaeq,
        jolap: smarr[vm.sheetmakers.length + 1].jo,
        joaeq: smarr[vm.sheetmakers.length + 1].jaeq,
        alltime: smstime,
        downtime: (smarr[vm.sheetmakers.length + 1].musz + smarr[vm.sheetmakers.length + 1].szerv + smarr[vm.sheetmakers.length + 1].terv) / 60,
        muszaki: smarr[vm.sheetmakers.length + 1].musz / 60,
        szervezesi: smarr[vm.sheetmakers.length + 1].szerv / 60,
        tervezesi: smarr[vm.sheetmakers.length + 1].terv / 60,
        kap: smskap
      }
      vm.smcards.push(obj);

    }
    function setCh(ser) {

      if (ser.length == vm.sheetmakers.length) {
        var avail = { name: "Elérhetőség", color: "rgba(150,200,100,.5)", data: [], /*tooltip: { useHTML:true, pointFormat: '{series.name}: <b style="color:{point.color}">{point.y:.2f}</b><br>' }*/ };
        var muszaki = { name: "Műszaki", color: "rgba(255,0,0,.5)", data: [], /*tooltip: { useHTML:true, pointFormat: "{series.name}: <b style='color:{point.color}'>{point.y:.2f}</b><br>" }*/ };
        var szervezesi = { name: "Szervezési", color: "rgba(150,150,150,.5)", data: [], /*tooltip: { useHTML:true, pointFormat: "{series.name}: <b style='color:{point.color}'>{point.y:.2f}</b><br>" }*/ };
        var tervezett = { name: "Tervezett", color: "rgba(50,100,200,.5)", data: [], /*tooltip: { useHTML:true, pointFormat: "{series.name}: <b style='color:{point.color}'>{point.y:.2f}</b><br>" }*/ };
        var ttla = 0;
        var ttlm = 0;
        var ttls = 0;
        var ttlt = 0;
        var xA = [];
        for (var i = 0; i < ser.length; i++) {
          xA.push(ser[i].sm);
          ttla += ser[i].alltime;
          ttlm += ser[i].muszaki;
          ttls += ser[i].szervezesi;
          ttlt += ser[i].tervezesi;
          avail.data.push({ sm: ser[i].sm, y: parseFloat((ser[i].alltime - (ser[i].muszaki + ser[i].szervezesi + ser[i].tervezesi)) / ser[i].alltime) * 100, min: ser[i].alltime - (ser[i].muszaki + ser[i].szervezesi + ser[i].tervezesi) });
          muszaki.data.push({ sm: ser[i].sm, y: parseFloat(ser[i].muszaki / ser[i].alltime) * 100, min: ser[i].muszaki });
          szervezesi.data.push({ sm: ser[i].sm, y: parseFloat(ser[i].szervezesi / ser[i].alltime) * 100, min: ser[i].szervezesi });
          tervezett.data.push({ sm: ser[i].sm, y: parseFloat(ser[i].tervezesi / ser[i].alltime) * 100, min: ser[i].tervezesi });
        }
        xA.sort();
        avail.data = $filter('orderBy')(avail.data, 'sm');
        muszaki.data = $filter('orderBy')(muszaki.data, 'sm');
        szervezesi.data = $filter('orderBy')(szervezesi.data, 'sm');
        tervezett.data = $filter('orderBy')(tervezett.data, 'sm');

        // muszaki
        var topmuszd = $filter('unique')($filter('filter')(vm.filedatas, { Ev_Group: "Muszaki technikai okok" }), "Event_SubGroup");
        var topm = [];
        for (var k = 0; k < topmuszd.length; k++) {
          topm.push({
            cat: topmuszd[k].Event_SubGroup,
            y: parseFloat($filter('sumField')($filter('filter')(vm.filedatas, { "Event_SubGroup": topmuszd[k].Event_SubGroup }), 'Event_time') / 60 / 60),
            count: $filter('filter')(vm.filedatas, { "Event_SubGroup": topmuszd[k].Event_SubGroup }).length
          });
        }
        topm = $filter('orderBy')(topm, "y", true);
        var xtopm = [];
        for (var j = 0; j < topm.length; j++)
          xtopm.push(topm[j].cat);
        vm.topmconf = {
          chart: { type: "column", height: 300 }, legend: { enabled: false },
          title: { text: "Műszaki technikai okok" },
          xAxis: { type: "category", categories: xtopm },
          series: [
            { name: "Állások", color: "red", data: topm, tooltip: { pointFormat: '<span><span style="color:{series.color};font-weight:bold">{point.y:.2f} óra</span> [{point.count} db]</span>' } }
          ]
        };
        // szerv
        var topszervd = $filter('unique')($filter('filter')(vm.filedatas, { Ev_Group: "Szervezesi veszteseg" }), "Event_SubGroup");
        var tops = [];
        for (var k = 0; k < topszervd.length; k++) {
          tops.push({
            cat: topszervd[k].Event_SubGroup,
            y: parseFloat($filter('sumField')($filter('filter')(vm.filedatas, { "Event_SubGroup": topszervd[k].Event_SubGroup }), 'Event_time') / 60 / 60),
            count: $filter('filter')(vm.filedatas, { "Event_SubGroup": topszervd[k].Event_SubGroup }).length
          });
        }
        tops = $filter('orderBy')(tops, "y", true);
        var xtops = [];
        console.log(tops);
        for (var j = 0; j < tops.length; j++)
          xtops.push(tops[j].cat);

        vm.topsconf = {
          chart: { type: "column", height: 300 }, legend: { enabled: false },
          title: { text: "Szervezési veszteség" },
          xAxis: { type: "category", categories: xtops },
          series: [
            { name: "Állások", color: "rgb(150,150,150)", data: tops, tooltip: { pointFormat: '<span><span style="color:{series.color};font-weight:bold">{point.y:.2f} óra</span> [{point.count} db]</span>' } }
          ]
        };

        // terv
        var toptervd = $filter('unique')($filter('filter')(vm.filedatas, { Ev_Group: "Tervezett veszteseg" }), "Event_SubGroup");
        var topt = [];
        for (var k = 0; k < toptervd.length; k++) {
          topt.push({
            cat: toptervd[k].Event_SubGroup,
            y: parseFloat($filter('sumField')($filter('filter')(vm.filedatas, { "Event_SubGroup": toptervd[k].Event_SubGroup }), 'Event_time') / 60 / 60),
            count: $filter('filter')(vm.filedatas, { "Event_SubGroup": toptervd[k].Event_SubGroup }).length
          });
        }
        topt = $filter('orderBy')(topt, "y", true);
        var xtopt = [];
        for (var j = 0; j < topt.length; j++)
          xtopt.push(topt[j].cat);
        vm.toptconf = {
          chart: { type: "column", height: 300 }, legend: { enabled: false },
          title: { text: "Tervezett veszteség" },
          xAxis: { type: "category", categories: xtopt },
          series: [
            { name: "Állások", color: "rgb(50,100,200)", data: topt, tooltip: { pointFormat: '<span><span style="color:{series.color};font-weight:bold">{point.y:.2f} óra</span> [{point.count} db]</span>' } }
          ]
        };


        var tavail = { name: "Elérhetőség", color: "rgb(150,200,100)", data: [{ y: parseFloat((ttla - (ttlm + ttls + ttlt)) / ttla) * 100, min: ttla - (ttlm + ttls + ttlt) }] };
        var tmuszaki = { name: "Műszaki", color: "rgb(255,0,0)", data: [{ y: parseFloat(ttlm / ttla) * 100, min: ttlm }] };
        var tszervezesi = { name: "Szervezési", color: "rgb(150,150,150)", data: [{ y: parseFloat(ttls / ttla) * 100, min: ttls }] };
        var ttervezett = { name: "Tervezett", color: "rgb(50,100,200)", data: [{ y: parseFloat(ttlt / ttla) * 100, min: ttlt }] };

        vm.smavailabilitychartconfig = {
          chart: { type: 'column', spacingBottom: 30 },
          plotOptions: { column: { stacking: 'normal', pointPadding: 0, borderWidth: 0 } },
          tooltip: { shared: true, headerFormat: '<span style="font-size: 10px"><b>{point.key}</b></span><br/>', pointFormat: '<span> {series.name}: <span style="color:{series.color};font-weight:bold">{point.y:.2f} %</span> ({point.min:.0f} perc)</span><br/>' },
          title: { text: "SM elérhetőségi adatok" },
          xAxis: { type: "category", categories: xA, title: { text: "SheetMakerek" } },
          yAxis: { max: 100 },
          series: [
            muszaki, szervezesi, tervezett, avail
          ]
        };
        vm.ttlsmavailabilitychartconfig = {
          chart: { type: 'column', spacingBottom: 30 },
          plotOptions: { column: { stacking: 'normal', pointPadding: 0, borderWidth: 0 } },
          legend: { enabled: false },
          tooltip: { shared: true, headerFormat: '<span style="font-size: 10px"><b>{point.key}</b></span><br/>', pointFormat: '<span> {series.name}: <span style="color:{series.color};font-weight:bold">{point.y:.2f} %</span> ({point.min:.0f} perc)</span><br/>' },
          title: { text: "SM összesített elérhetőségi adatok" },
          xAxis: { type: "category", categories: ["" + vm.startdate + " - " + vm.enddate], title: { text: "" } },
          yAxis: { max: 100 },
          series: [
            tmuszaki, tszervezesi, ttervezett, tavail
          ]
        };

        for (var x = 0; x < vm.days.length; x++) {
          vm.days[x].lapselejt = vm.days[x].ttllap - vm.days[x].jolap;
          vm.days[x].musz = parseFloat($filter('sumField')($filter('filter')(vm.filedatas, { d: vm.days[x].date, Ev_Group: "Muszaki technikai okok" }), "Event_time")) / 60;
          vm.days[x].szer = parseFloat($filter('sumField')($filter('filter')(vm.filedatas, { d: vm.days[x].date, Ev_Group: "Szervezesi veszteseg" }), "Event_time")) / 60;
          vm.days[x].terv = parseFloat($filter('sumField')($filter('filter')(vm.filedatas, { d: vm.days[x].date, Ev_Group: "Tervezett veszteseg" }), "Event_time")) / 60;
          console.log($filter('filter')(vm.filedatas, { d: vm.days[x].date, Ev_Group: "Muszaki technikai okok" }));
        }

        vm.days = $filter('orderBy')(vm.days, 'date');
        var xDays = [];

        var muszperc = [];
        var szerperc = [];
        var tervperc = [];
        var elerperc = [];
        var jo = [];
        var rossz = [];
        var cel = [];
        for (var j = 0; j < vm.days.length; j++) {
          xDays.push(vm.days[j].date);
          muszperc.push({ cat: vm.days[j].date, y: vm.days[j].musz / vm.days[j].ttlido * 100, min: vm.days[j].musz });
          szerperc.push({ cat: vm.days[j].date, y: vm.days[j].szer / vm.days[j].ttlido * 100, min: vm.days[j].szer });
          tervperc.push({ cat: vm.days[j].date, y: vm.days[j].terv / vm.days[j].ttlido * 100, min: vm.days[j].terv });
          elerperc.push({ cat: vm.days[j].date, y: ((vm.days[j].ttlido - vm.days[j].terv - vm.days[j].szer - vm.days[j].musz) / vm.days[j].ttlido) * 100, min: vm.days[j].ttlido - vm.days[j].musz - vm.days[j].szer - vm.days[j].terv });
          jo.push({ cat: vm.days[j].date, y: vm.days[j].joaeq });
          rossz.push({ cat: vm.days[j].date, y: vm.days[j].lapselejt, p: vm.days[j].lapselejt / vm.days[j].ttllap * 100 });
          cel.push({ cat: vm.days[j].date, y: 215 });
        }



        vm.dayavailconfig = {
          chart: { type: 'column' },
          title: { text: 'Napi SM Elérhetőség, Termelés és Selejt lapok' },
          plotOptions: { column: { stacking: 'normal' } },
          xAxis: { type: 'category', categories: xDays },
          tooltip: { shared: true, headerFormat: '<span style="font-size: 10px"><b>{point.key}</b></span><br/>', pointFormat: '<span> {series.name}: <span style="color:{series.color};font-weight:bold">{point.y:.2f} %</span> ({point.min:.0f} perc)</span><br/>' },
          yAxis: [
            { max: 100, title: { text: "Elérhetősgi adatok" } },
            { opposite: true, title: { text: "AEQ és Lapselejt DB" } }
          ],
          series: [
            { name: "Műszaki", color: "rgba(255,0,0,.5)", data: muszperc, yAxis: 0 },
            { name: "Szervezési", color: "rgba(150,150,150,.5)", data: szerperc, yAxis: 0 },
            { name: "Tervezett", color: "rgba(50,100,200,.5)", data: tervperc, yAxis: 0 },
            { name: "Elérhetőség", color: "rgba(150,200,100,.5)", data: elerperc, yAxis: 0 },
            {
              name: "Lapselejtek", type: "line", color: "rgb(255,200,0)", data: rossz, yAxis: 1,
              tooltip: { headerFormat: '<span style="font-size: 10px"><b>{point.key}</b></span><br/>', pointFormat: '<span> {series.name}: <span style="color:{series.color};font-weight:bold">{point.y:.0f} DB</span> ({point.p:.2f} %)</span><br/>' },
            },
            {
              name: "Össz Termelés", type: "line", color: "rgb(150,200,255)", data: jo, yAxis: 1, marker: { enabled: true, color: "rgb(150,200,255)" },
              tooltip: { headerFormat: '<span style="font-size: 10px"><b>{point.key}</b></span><br/>', pointFormat: '<span> {series.name}: <span style="color:{series.color};font-weight:bold">{point.y:.0f} AEQ</span></span><br/>' },
            },
            {
              name: "Cél Termelés", type: "line", color: "rgb(100,200,0)", data: cel, yAxis: 1,
              tooltip: { headerFormat: '<span style="font-size: 10px"><b>{point.key}</b></span><br/>', pointFormat: '<span> {series.name}: <span style="color:{series.color};font-wieght:bold">{point.y:.0f} AEQ</span></span><br/>' }
            }
          ]
        };

        //console.log(vm.smavailabilitychartconfig.series);
        //console.log(vm.ttlsmavailabilitychartconfig.series);
        vm.loaddata = false;
      }
    }



    function getAEQ(tomb, azon, am) {
      var aeq = 0;
      var substr = azon.substring(0, 3);
      if (substr.substring(0, 2) == "ZL")
        substr = "ZL";
      if (azon.indexOf("CS-D12") > -1) {
        substr = "Ds12";
      }
      if (azon.indexOf("CS-D13") > -1) {
        substr = "Ds13";
      }
      for (var i = 0; i < tomb.length; i++) {
        if (tomb[i].name.includes(substr)) {
          aeq = (am / parseInt(tomb[i].sheets)) * parseFloat(tomb[i].aeq);
        }
      }
      return aeq;
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.edate = $filter('date')(new Date().getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      loadPartnumbers();
    }
  }
  Controller.$inject = ['weeklyService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
