define([], function(){
    'use strict';
    function result(){
        return function (data, projectid){
            var res = [];
            var today = new Date().getTime();
            if(data === 'undefined'){
                return null;
            } else {
                angular.forEach(data, function(v,k){
                    if(v.project == projectid && v.due > today){
                        res.push(v);
                    }
                });
            }
            return res;
        }
    }
    return result;
});