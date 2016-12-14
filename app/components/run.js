define([], function(){
  'use strict';
  function Run($cookies, $location){
    var redir = '';
    var actR = $cookies.get('redir');
    var user = $cookies.getObject('user');
    if(actR){
      redir = actR;
      $cookies.remove('redir');
    } else {
      var url = $location.path();
      if(url != "/" && url != "/login"){
	redir = url;
	$cookies.put('redir', redir);
      }
    }
  }
  Run.$inject = ['$cookies', '$location'];
  return Run;
});
