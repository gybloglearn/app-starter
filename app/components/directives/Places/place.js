define([], function () {
    'use strict';
    function placedir() {
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                data: '='
            },
            templateUrl: 'app/components/directives/Places/place.html'
        };
        return directive;
        function link(scope, element, attrs) {
            scope.$watch('data', function (newVal, oldVal) {
                if (newVal) {
                    scope.data = newVal;
                }
            });
            /*scope.$watch('totaldt', function (newVal, oldVal) {
                if (newVal) {
                    scope.totaldt = newVal;
                    scope.trg = (scope.time - newVal) * scope.target / (scope.totaltime - newVal);
                    scope.thistrg = (scope.time - newVal) * scope.thistarget / (scope.totaltime - newVal);
                }
            });*/
        }
    }
    return placedir;
});