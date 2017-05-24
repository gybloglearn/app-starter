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
                    return element.text($filter('date')(diff, "HH:mm:ss","UTC"));
                }, 1000);
            }
        }
        return directive;
    }
    function dhms(t) {
                    var hours, minutes, seconds;
                    hours = Math.floor(t / 3600/1000) % 24;
                    t += hours * 3600/1000;
                    minutes = Math.floor(t / 60/1000) % 60;
                    t += minutes * 60/1000;
                    seconds = t % 60;
                    return [
                        hours,
                        minutes,
                        seconds
                    ].join(':');
                }
    countdown.$inject = ['$interval', '$filter'];
    return countdown;
});