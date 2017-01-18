define([], function () {
    'use strict';
    function change() {
        return function (actual) {
            if (actual == "DS12FLOW_BOK-BOKES") {
                actual = actual.replace("DS12FLOW_BOK-BOKES","Ds12 FLOW_BOK-BOKES");
            }
            else if (actual == "C11 FLOW_BOK-BOKES") {
                actual = actual.replace("C11 FLOW_BOK-BOKES","C11FLOW_BOK-BOKES");
            }
            else if (actual == "DS13CP5_BOK-BOKES") {
                actual = actual.replace("DS13CP5_BOK-BOKES","DS- D13 CP5_BOK-BOKES");
            }
            else if(actual=="C11 CP5_BOK-BOKES"){
                actual=actual.replace("C11 CP5_BOK-BOKES","C11CP5_BOK-BOKES");
            }
            return actual;
        }
    }
    return change;
});