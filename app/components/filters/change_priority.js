define([], function () {
    'use strict';
    function change_priority() {
        return function (priority) {
            if (priority == "0") {
                priority = priority.replace("0","Muszáj");
            }
            else if (priority == "1") {
                priority = priority.replace("1","Kell");
            }
            else if (priority == "2") {
                priority = priority.replace("2","Fontos");
            }
            else if (priority == "3") {
                priority = priority.replace("3","Később");
            }
            else if (priority == "4") {
                priority = priority.replace("4","Ajánlott");
            }
            else if (priority == "5") {
                priority = priority.replace("5","Ha van idő");
            }
            return priority;
        }
    }
    return change_priority;
});