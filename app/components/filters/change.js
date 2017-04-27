define([], function () {
    'use strict';
    function change() {
        return function (actual) {
            if (actual == "DS12FLOW_BOK-BOKES") {
                actual = "Ds12 FLOW_BOK-BOKES";
            }
            else if (actual == "C11 FLOW_BOK-BOKES") {
                actual = "C11FLOW_BOK-BOKES";
            }
            else if (actual == "DS13CP5_BOK-BOKES") {
                actual = "DS- D13 CP5_BOK-BOKES";
            }
            else if(actual=="C11 CP5_BOK-BOKES"){
                actual = "C11CP5_BOK-BOKES";
            }
            return actual;
        }
    }
    return change;
});