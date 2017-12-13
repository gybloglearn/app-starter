define([], function () {
    'use strict';
    function modulmapdir() {
        var directive = {
            link: link,
            restrict: 'E',
            controller: ctrl,
            scope: {
                data: '='
            },
            templateUrl: 'app/components/directives/Modulmap/modulmap.html'
        };
        function ctrl($scope, $filter) {
            $scope.drawchart = drawchart;
            $scope.acttipus = "";
            $scope.mutatchart = false;
            function drawchart(osz, sor) {
                $scope.mutatchart = true;
                var dt = [];
                dt = $filter('filter')($scope.data, { Sor: sor, Oszlop: osz });
                dt = $filter('filter')(dt, { tipus: $scope.acttipus });
                console.log(dt);
                $scope.chartconfig = {
                    chart: {
                        type: 'column',
                        height: 440,
                        width: 500
                    },
                    title: { text: osz + sor + ' Pozíció' + ' ' + $scope.acttipus },
                    series: [
                        {
                            name: 'Hibák',
                            color: "#3366ff",
                            data: feltolthibadarab(dt),
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
                    }
                };
            }
            function feltolthibadarab(tomb) {
                var adatok = [];
                var a = 0;
                var talalat = 0;

                for (var i = 0; i < tomb.length; i++) {
                    var acthiba = tomb[i].KatName1;
                    for (var j = 0; j < adatok.length; j++) {
                        if (acthiba == adatok[j].nev) {
                            adatok[j].y += tomb[i].bt_kat_db1;
                            talalat++;
                        }
                    }
                    if (talalat > 0) {
                        talalat = 0;
                    }
                    else {
                        adatok[a] = {}
                        adatok[a].nev = acthiba;
                        adatok[a].y = tomb[i].bt_kat_db1;
                        a++;
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
        return directive;
        function link(scope, element, attrs) {
            scope.$watch('data', function (newVal, oldVal) {
                if (newVal) {
                    scope.data = newVal;
                }
            });
        }
    }
    return modulmapdir;
});