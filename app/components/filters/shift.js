define([], function () {
    'use strict';
    function shift() {
        return function (sh, date) {
            var shifts=[];
            shifts[1] = ['D', 'D', 'C', 'C', 'C', 'C', 'C', 'C', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'D', 'D', 'D', 'D'];
            shifts[2] = ['A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'D', 'D', 'D', 'D', 'D', 'D', 'C', 'C', 'C', 'C', 'C', 'C'];
            shifts[3] = ['B', 'B', 'B', 'B', 'D', 'D', 'D', 'D', 'D', 'D', 'C', 'C', 'C', 'C', 'C', 'C', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B'];
            var stdate = new Date("2015-11-20").getTime();
            var targetdate=new Date(date).getTime();
            var number_day=Math.round((targetdate-stdate)/(24*3600*1000),0)%24;

            return shifts[sh][number_day];
        }
    } return shift;
});