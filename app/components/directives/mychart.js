define([], function () {
    'use strict';

    function mychart() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                config: '='
            },
            template: function (elem, attrs) { return '<div id="' + attrs.id + '" style="margin: 20px auto;"></div>' },
            link: function (scope, element, attrs) {
                scope.$watch('config', function (newVal, oldVal) {
                    if (newVal) {
                        newVal.chart.renderTo = attrs.id;
                        function removeClick() {
                            $('.highcharts-drilldown-axis-label').each(function () {
                                this.onclick = null;
                            });
                        }
                        newVal.chart.events = {
                            load: function () {
                                removeClick();
                            },
                            redraw: function () {
                                removeClick();
                            }
                        };
                        var ch = new Highcharts.Chart(newVal);
                    }
                });
            }
        };
    };


    return mychart;
});