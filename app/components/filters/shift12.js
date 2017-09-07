define([], function () {
    'use strict';
    function shift() {
        return function (sh, date) {
            var shifts = [];
            shifts[1] = ['B', 'B', 'B', 'D', 'D', 'B', 'B', 'D', 'D', 'D', 'C', 'C', 'A', 'A', 'C', 'C', 'C', 'A', 'A', 'B', 'B', 'D', 'D', 'D', 'B', 'B', 'D', 'D', 'C', 'C', 'C', 'A', 'A', 'C', 'C', 'A', 'A', 'A', 'B', 'B', 'D', 'D', 'B', 'B', 'B', 'D', 'D', 'C', 'C', 'A', 'A', 'A', 'C', 'C', 'A', 'A'];
            shifts[2] = [];
            shifts[3] = ['C', 'C', 'C', 'A', 'A', 'C', 'C', 'A', 'A', 'A', 'B', 'B', 'D', 'D', 'B', 'B', 'B', 'D', 'D', 'C', 'C', 'A', 'A', 'A', 'C', 'C', 'A', 'A', 'B', 'B', 'B', 'D', 'D', 'B', 'B', 'D', 'D', 'D', 'C', 'C', 'A', 'A', 'C', 'C', 'C', 'A', 'A', 'B', 'B', 'D', 'D', 'D', 'B', 'B', 'D', 'D'];
            var stdate = new Date("2017-09-01").getTime();
            var targetdate = new Date(date).getTime();
            var number_day = Math.round((targetdate - stdate) / (24 * 3600 * 1000), 0) % 56;

            return shifts[sh][number_day];
        }
    } return shift;
});