define([], function(){
  function Service($http){
    var service= {
      auth: auth
    };
    function auth(d){
      var req={
	method:"POST",
	url: "../login/login",
	data: d
      };
      return $http(req);
    }
    return service;
  }
  Service.$inject=['$http'];
  return Service;
});
