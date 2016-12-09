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
                actual = actual.replace("2","Lekódolva");
            }
            else if (actual == "3") {
                actual = actual.replace("3","Tesztelve");
            }
            else if (actual == "4") {
                actual = actual.replace("4","Kész");
            }
            else if (actual == "5") {
                actual = actual.replace("5","Befejezve");
            }
            return actual;
        }
    }
    return change;
});