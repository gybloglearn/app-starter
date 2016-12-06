define([], function () {
    'use strict';

    function datepicker() {
        var directive = {
            link: link,
            restrict: 'C',
            scope: {}
        };
        return directive;
        function link(scope, element, attrs) {
            element.datepicker({
                inline: true,
                weekStart: 1,
                calendarWeeks: true,
                endDay: '0d',
                format: 'yyyy-mm-dd',
                onSelect: function (dateText) {
                    var modelPath = $(this).attr('ng-model');
                    putObject(modelPath, scope, dateText);
                    scope.$apply();
                }
            });
            element.datepicker('setDate', '0d');
        };
    };

    return datepicker;
});