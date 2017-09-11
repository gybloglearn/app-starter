define([], function () {
    'use strict';
    function client() {
        return function (sh, date) {
            var clients = [];
            clients[1] = ['10:00-11:00 és 13:00-14:00','10:00-11:00 és 13:00-14:00','10:00-11:00 és 13:00-14:00','10:00-11:00 és 13:00-14:00','10:00-11:00 és 13:00-14:00','',''];
            var stdate = new Date("2017-08-28").getTime();
            var targetdate = new Date(date).getTime();
            var number_day = Math.round((targetdate - stdate) / (24 * 3600 * 1000), 0) % 7;

            return clients[sh][number_day];
        }
    } return client;
});