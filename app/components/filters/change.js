define([], function () {
    'use strict';
    function change() {
        return function (actual) {
            if (actual == "DS12FLOW") {
                actual = actual.replace("DS12FLOW","Ds12 FLOW");
            }
            else if (actual == "C11 FLOW") {
                actual = actual.replace("C11 FLOW","C11FLOW");
            }
            else if (actual == "DS13CP5") {
                actual = actual.replace("DS13CP5","DS- D13 CP5");
            }
            return actual;
        }
    }
    return change;
});