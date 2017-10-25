define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter, $http) {
    var vm = this;
    vm.operators = [];
    vm.OP = [];
    vm.data = [];
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.actmachine = "Potting4";
    vm.phasenumbers = [0, 1, 2, 3, 4, 5, 6, 7];
    vm.Pottings = ["Potting3", "Potting4"];
    vm.hely = ["Potting be", "Gel Prep Also F", "Uret Prep Also F", "Esztetika Also F", "Forgatas", "Uret Prep Felso F", "Esztetika Felso F", "Potting ki"];
    vm.szakok = [1, 2, 3]
    vm.load = load;
    vm.beallit = beallit;
    vm.actshiftnum = 1;
    vm.switchdate = new Date('2017-09-01').getTime();

    function beallit() {
      vm.datumszam = $filter('date')(new Date(vm.datum).getTime(), 'yyyy-MM-dd');
    }
    function loadops() {
      vm.ops = [];
      $http({ method: 'GET', url: "app/components/Operators/gids.json" }).
        success(function (data, status) {
          vm.ops = data;
        }).
        error(function (data, status) {
          console.log(data || "Request failed");
        });
    }
    vm.exportToCSV = exportToCSV;
    function exportToCSV() {
      var content = "";
      content += ";;Potting3;;;;;;;;Potting4;;;;;;;;\r\n";
      content += "GID;Szak;";
      for (var x = 0; x < vm.hely.length; x++) {
        content += vm.hely[x] + ";";
      }
      for (var x = 0; x < vm.hely.length; x++) {
        content += vm.hely[x] + ";";
      }
      content += "\r\n";
      for (var o = 0; o < vm.ops.length; o++) {
        if (vm.ops[o].gid != '') {
          content += vm.ops[o].gid + ";" + vm.ops[o].shift + ";";
          for (var i = 0; i < vm.hely.length; i++) {
            if ($filter('filter')(vm.datas, { mch: "Potting3", pha: vm.hely[i], operator: vm.ops[o].gid }).length > 0)
              content += $filter('filter')(vm.datas, { mch: "Potting3", pha: vm.hely[i], operator: vm.ops[o].gid }).length + ";";
            else
              content += ';';
          }
          for (var j = 0; j < vm.hely.length; j++) {
            if ($filter('filter')(vm.datas, { mch: "Potting4", pha: vm.hely[j], operator: vm.ops[o].gid }).length > 0)
              content += $filter('filter')(vm.datas, { mch: "Potting4", pha: vm.hely[j], operator: vm.ops[o].gid }).length + ";";
            else
              content += ';';
          }
          content += "\r\n";
        }
      }
      content += "SSOval;" + "-----;".repeat(17) + "\r\n";
      for (var o = 0; o < vm.ops.length; o++) {
        content += vm.ops[o].sso + ";" + vm.ops[o].shift + ";";
        for (var i = 0; i < vm.hely.length; i++) {
          if ($filter('filter')(vm.datas, { mch: "Potting3", pha: vm.hely[i], operator: vm.ops[o].sso }).length > 0)
            content += $filter('filter')(vm.datas, { mch: "Potting3", pha: vm.hely[i], operator: vm.ops[o].sso }).length + ";";
          else
            content += ';';
        }
        for (var j = 0; j < vm.hely.length; j++) {
          if ($filter('filter')(vm.datas, { mch: "Potting4", pha: vm.hely[j], operator: vm.ops[o].sso }).length > 0)
            content += $filter('filter')(vm.datas, { mch: "Potting4", pha: vm.hely[j], operator: vm.ops[o].sso }).length + ";";
          else
            content += ';';
        }
        content += "\r\n";
      }
// CReATE download string
      var d = [];
      var res = [];
      d = content.split("\r\n");
      for (var k = 0; k < d.length; k++) {
        var h = d[k].split(';');
        var s = [];
        if (k > 1 && h[0] != "SSOval") {
          s[k] = 0;
          for (var x = 0; x < h.length; x++) {
            if (x > 1) {
              if (h[x] == "")
                h[x] = 0;
              else
                h[x] = parseInt(h[x]);
              s[k] += h[x];
            }
          }
        }
        if (k <= 1 || h[0] == "SSOval" || s[k] > 0) {
          var hstr = h.slice(0,-1).join(";");
          res.push(hstr);
        }
      }
      var str = res.join("\r\n");
     // console.log(str);

      var hiddenElement = document.createElement('a');
      hiddenElement.href = 'data:attachment/csv;charset=iso-8859-1,' + encodeURI(str);
      hiddenElement.target = '_blank';
      hiddenElement.download = 'data_' + vm.datumszam + '.csv';
      hiddenElement.click();
    }
    function load() {
      vm.dis = true;
      vm.datas = [];
      angular.forEach(vm.Pottings, function (p, i) {
        angular.forEach(vm.phasenumbers, function (n, j) {
          dataService.get(vm.datum, p, n).
            success(function (response, status) {
              for (var k = 0; k < response.length; k++) {
                response[k].mch = p;
                response[k].pha = vm.hely[n];
                vm.datas.push(response[k]);
              }
              if (i * j == 7) {
                //console.log(vm.datas);
                vm.dis = false;
              }
            }).
            error(function (data, status) {
              console.log(data || "Request failed");
            });
        });
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      loadops();
      load();
    }

  }
  Controller.$inject = ['Data', '$cookies', '$state', '$rootScope', '$filter', '$http'];
  return Controller;
});
