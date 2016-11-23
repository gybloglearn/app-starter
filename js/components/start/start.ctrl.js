define([], function () {
  'use strict';
  function StartController(Data) {
    var vm = this;

    activate();

    function activate() {
      // [TODO:] Customize controller

      /*

      link to service

      Data.get().then(function (response) {
        console.log(response.data);
      });

      */
    }
  }
  StartController.$inject = ['Data'];
  return StartController;
});