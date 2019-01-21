define([], function () {
  'use strict';

  function Service($http) {
    var service = {
      get: get,
      getplan: getplan
    };

    return service;

    ///////////

<<<<<<< HEAD
    //localhost
    /*function get(date) {
=======
   function get(date) {
>>>>>>> 1b557a6b765e7766fff4d9a6eec354cc22eb0c6f
      var req = {
        method: 'GET',
        url: 'app/components/PHP/Rewinder/rewinder' + date + '.json'
      };
      return $http(req);
<<<<<<< HEAD
    }*/
    //server
    function get(date) {
      var req = {
        method: 'GET',
        url: '..Braid/app/components/PHP/Rewinder/rewinder' + date + '.json'
      };
      return $http(req);
    }
=======
    }
    
>>>>>>> 1b557a6b765e7766fff4d9a6eec354cc22eb0c6f
    function getplan() {
      var req = {
        method: 'GET',
        url: 'app/components/PHP/planapi/allplans'
      };
      return $http(req);
    }
  }
  Service.$inject = ['$http'];
  return Service;
});
