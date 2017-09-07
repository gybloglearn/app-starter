define([], function () {
    'use strict';
    function shift() {
        return function (sh, date) {
            var shifts = [];
            shifts[1] = ['A','A','A','A','A','Pihenő','Pihenő','B','B','B','B','B','Pihenő','Pihenő','C','C','C','C','C','Pihenő','Pihenő'];
            shifts[2] = ['B','B','B','B','B','Pihenő','Pihenő','C','C','C','C','C','Pihenő','Pihenő','A','A','A','A','A','Pihenő','Pihenő'];
            shifts[3] = ['C','C','C','C','C','Pihenő','Pihenő','A','A','A','A','A','Pihenő','Pihenő','B','B','B','B','B','Pihenő','Pihenő'];
            var stdate = new Date("2017-08-21").getTime();
            var targetdate = new Date(date).getTime();
            var number_day = Math.round((targetdate - stdate) / (24 * 3600 * 1000), 0) % 21;

            return shifts[sh][number_day];
        }
    } return shift;
});