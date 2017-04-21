define([], function(){
  'use strict';
  function Controller(Login, $cookies, $location, $timeout, $rootScope){
    var vm = this;
    vm.err = {};
    vm.authenticate = authenticate;
    function authenticate(){
      Login.auth(vm.data).then(function(resp){
				// Put user cookie
				$cookies.putObject('user', resp.data, {path: "/"});
				$rootScope.user = resp.data;
				// REDIRECT to where from
				var redir = $cookies.get('redir');
				if(redir){
					$location.path(redir);
				} else {
					$location.path('/');
				}
      }).catch(function(err){
	// handle error.
	vm.err.message = err.data;
	$timeout(function(){
	  vm.err.message = '';
	  vm.data.passw = '';
	}, 5000);
      });
    }
    /////////////
  }
  Controller.$inject = ['Login', '$cookies', '$location', '$timeout', '$rootScope'];
  return Controller;
});
