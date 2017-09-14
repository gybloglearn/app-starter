define([], function () {
    'use strict';
    function sumdb() {
        return function (data) {
            if (angular.isUndefined(data))
                return 0;
            var sum = 0;
            angular.forEach(data, function (v, k) {
                sum = sum + v.amount;
            });
            return sum;
        };
    };
    return sumdb;
});