define([], function() {
    'use strict';

    function Service($http) {
        var service = {
            getpartnumber: getpartnumber,
            get: get
        };

        return service;

        ///////////

        function getpartnumber() {
            var req = {
                method: 'GET',
                url: 'http://3.228.180.13/modulapi/mods'
            };
            return $http(req);
        }
        function get(start, end) {
            var req = {
                method: 'GET',
                url: 'app/components/PHP/CL_Event_Log.php?startdate=' + start + '&enddate=' + end
            };
            return $http(req);
        }
    }
    Service.$inject = ['$http'];
    return Service;
});
