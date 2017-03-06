define([], function () {
    'use strict';
    function sumdb() {
        return function (data, sumOn) {
            if (angular.isUndefined(data))
                return 0;
            var sum = 0;
            angular.forEach(data, function (v, k) {
                sum = sum + v[sumOn];
            });
            return sum;
        };
    };
    return sumdb;
});