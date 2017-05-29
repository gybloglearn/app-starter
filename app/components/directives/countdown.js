define([], function () {
    'use strict';
    function countdown($interval, $filter) {
        var directive = {
            restrict: 'A',
            scope: { date: '@' },
            link: function (scope, element) {
                var future;
                future = new Date(scope.date);
                $interval(function () {
                    var diff;
                    diff = Math.floor((new Date().getTime()-future.getTime()));
                    if(diff > (17.7*60*1000)) {
                        element.attr("style","background-color:red;color:white;font-size:4em;line-height: 1em;");
                        element.text($filter('date')(diff - (17.7*60*1000), "HH:mm:ss","UTC"));
                    } else {
                        element.attr("style", "color:green;background-color:transparent;font-size:4em;line-height:1em;");
                        element.text($filter('date')((17.7*60*1000) - diff, "HH:mm:ss","UTC"));
                    }
                    //element.text($filter('date')(diff, "HH:mm:ss","UTC"));
                    return element;
                }, 1000);
            }
        }
        return directive;
    }
    countdown.$inject = ['$interval', '$filter'];
    return countdown;
});