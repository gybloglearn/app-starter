define([], function () {
    'use strict'
    function name_change() {
        return function (name) {
            if(name.includes("01"))
            {
                name="Rewinder1"
            }
            return name
        }
    }
    return name_change;
});