define([], function () {
    'use strict'
    function name_change() {
        return function (name) {
            if(name.includes("_IN-IN"))
            {
                name=name.substring(0,name.length-6);
            }
            else if(name.includes("_P3-P3"))
            {
                name=name.substring(0,name.length-6);
            }
            else if(name.includes("_OUT-OUT"))
            {
                name=name.substring(0,name.length-8);
            }
            return name
        }
    }
    return name_change;
});