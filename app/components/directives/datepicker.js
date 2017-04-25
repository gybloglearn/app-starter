define([], function () {
  'use strict';
  function datepicker() {
    var directive = {
      link: link,
      restrict: 'C',
      scope: {
      }
    };
    return directive;
    function link(scope, element, attrs) {
      element.datepicker({
        inline: true,
        format: 'yyyy-mm-dd',
        weekStart: 1,
        calendarWeeks: true,
        startDate: attrs.std,
        endDate: attrs.end,
        onSelect: function (dateText) {
          var modelPath = $(this).attr('ng-model');
          putObject(modelPath, scope, dateText);
          scope.$apply();
        }
      });
      $(function(){
        element.datepicker('setDate','0d', attrs['setdate']);
      });
    }
  }
  return datepicker;
});