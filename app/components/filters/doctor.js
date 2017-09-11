define([], function () {
    'use strict';
    function doctor() {
        return function (sh, date) {
            var doctors = [];
            doctors[1] = ['','8:00-10:00','13:30-15:30','12:30-14:30','','',''];
            var stdate = new Date("2017-08-28").getTime();
            var targetdate = new Date(date).getTime();
            var number_day = Math.round((targetdate - stdate) / (24 * 3600 * 1000), 0) % 7;

            return doctors[sh][number_day];
        }
    } return doctor;
});