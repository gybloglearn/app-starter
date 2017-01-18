define([], function () {
    'use strict'
    function name_change() {
        return function (name) {
            if(name.includes("_BP-OUT"))
            {
                name=name.substring(0,name.length-7);
            }
            else if(name.includes("_BOK-BOKES"))
            {
                name=name.substring(0,name.length-10);
            }
            return name
        }
    }
    return name_change;
});