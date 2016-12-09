define([], function () {
    'use strict';
    function change() {
        return function (actual) {
            if (actual == "0") {
                actual = actual.replace("0","Várakozik");
            }
            else if (actual == "1") {
                actual = actual.replace("1","Folyamatban");
            }
            else if (actual == "2") {
                actual = actual.replace("2","Befejezve");
            }
            return actual;
        }
    }
    return change;
});