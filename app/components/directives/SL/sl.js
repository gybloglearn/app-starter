define([], function () {
    'use strict';
    function sldir() {
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                data: '=',
                time: '=',
                mch: '=',
                shift: '=',
                target: '=',
                thistarget: '=',
                totaltime: '=',
                totaldt: '='
            },
            templateUrl: 'app/components/directives/SL/sl.html'
        };
        return directive;
        function link(scope, element, attrs) {
            scope.$watch('data', function (newVal, oldVal) {
                if (newVal) {
                    scope.data = newVal;
                }
            });
        }
    }
    return sldir;
});