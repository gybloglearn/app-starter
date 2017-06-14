define([], function () {
    'use strict';
    function addtype() {
        return function (actual) {
            if (actual.includes("FLOW")) {
                actual = "FLOW";
            }
            else if (actual.includes("Flow")) {
                actual = "FLOW";
            }
            else if (actual.includes("CP5")) {
                actual = "CP5";
            }
            else{
                actual = "";
            }
            return actual;
        }
    }
    return addtype;
});