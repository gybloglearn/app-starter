define([], function () {
  'use strict';
  function sumField() {
    return function (data, field) {
      if (field === false) {
        return data;
      }
      if (angular.isUndefined(data))
        return 0;
      var sum = 0;
      angular.forEach(data, function (v, k) {
        sum = sum + v[field];
      });
      sum = sum.toFixed(2);
      return sum;
    }
  }
  return sumField;
});