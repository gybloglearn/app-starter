define([], function () {
    'use strict';
    function sumaeq() {
        return function (data) {
            if (angular.isUndefined(data))
                return 0;
            var sum = 0;
            angular.forEach(data, function (v, k) {
                sum = sum + v.aeq;
            });
            //sum = sum.toFixed(2);
            return sum;
        };
    };
    return sumaeq;
});