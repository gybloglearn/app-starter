define([], function () {
  'use strict';
  function Controller(Data) {
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
  Controller.$inject = ['Data'];
  return Controller;
});