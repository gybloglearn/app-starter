define([], function () {
    'use strict';
    function changenum() {
        return function (actual) {
            if (actual == 1) {
                actual = "Nappal";
            }
            else if (actual == 3) {
                actual = "Éjszaka";
            }
            return actual;
        }
    }
    return changenum;
});