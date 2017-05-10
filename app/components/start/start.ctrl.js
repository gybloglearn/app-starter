define([], function () {
  'use strict';
  function Controller($cookies, $state, $rootScope) {
    var vm = this;

    vm.areas = ['Dashboards', 'ZW500', 'ZW1000', 'ZW1500', 'ZeeBlok', 'ZeeLung'];

    vm.list = [
      { category: 'Dashboards', subCategory: 'SAP mennyiség', reports: [] },
      { category: 'Dashboards', subCategory: 'Létszám', reports: [] },
      { category: 'ZW500', subCategory: 'Dope', reports: [] },
      { category: 'ZW500', subCategory: 'Braiding', reports: [] },
      { category: 'ZW500', subCategory: 'Fiber', reports: [] },
      {
        category: 'ZW500', subCategory: 'SheetMaker',
        reports: [
          { title: 'Scrap', picture: 'app/components/start/smscrap.jpg', link: '../smscrap/', description: 'Lapselejt kimutatások SM-enként, típusonként, hibakódonként, naponta' },
          { title: 'Production', picture: 'app/components/start/production.jpg', link: 'http://3.228.180.15/new_sm', description: 'Termelt mennyiségek gépenként tervhez hasonlítva' },
          { title: 'OEE', picture: 'app/components/start/oee.jpg', link: 'http://3.228.180.15/new_sm/#/sm_data', description: 'Állásidők eloszlása SM-enként, órai darabszámok, hibapareto' }
        ]
      },
      { category: 'ZW500', subCategory: 'Potting', reports: [] },
      {
        category: 'ZW500', subCategory: 'MTF',
        reports: [
          { title: 'Parkoló pálya adatok', picture: 'app/components/start/parkolopalya.jpg', link: 'http://3.228.180.15/new_mtf/#/pp', description: 'Parkoló pálya adatok szakonkénti elvégzendő feladatok összesítése, parkoló pályán töltött idő típusonként' },
          { title: 'BPzett mennyiség', picture: 'app/components/start/bpzett.jpg', link: 'http://3.228.180.15/mtf', description: 'Bubble Point teszten átment mennyiség és bökés / AEQ típusonként és szakonént összesítve' },
          { title: 'BPzett időelosztás', picture: 'app/components/start/bpido.jpg', link: 'http://3.228.180.15/new_mtf/#/BPS', description: 'Bubble Point tesztelt mennyiség kádanként, operátoronként, Bökés / perc mérőszámmal' },
          { title: 'Arhívum', picture: 'app/components/start/mtfarch.jpg', link: 'http://3.228.180.15/new_mtf/#/archiv', description: 'MTF bökés és BP-zett mennyiségek szakonként, típusonként, Bökés / AEQ mérőszám trenddel.' },
        ]
      },
      { category: 'ZW500', subCategory: 'Kazetta', reports: [] },
      { category: 'ZW500', subCategory: 'Minősítés', reports: [] },
      { category: 'ZW1000', subCategory: 'Dope' },
      { category: 'ZW1000', subCategory: 'Bundle' },
      { category: 'ZW1000', subCategory: 'Potting' },
      { category: 'ZW1000', subCategory: 'ETF' },
      { category: 'ZW1000', subCategory: 'Kazetta' },
      { category: 'ZW1000', subCategory: 'Minősítés' },
      { category: 'ZW1500', subCategory: 'Bundle' },
      { category: 'ZW1500', subCategory: 'Potting' },
      { category: 'ZW1500', subCategory: 'MTF' },
      { category: 'ZW1500', subCategory: 'Kazetta' },
      { category: 'ZW1500', subCategory: 'Minősítés' },
      { category: 'ZeeBlok', subCategory: 'Sheet' },
      { category: 'ZeeBlok', subCategory: 'Potting' },
      { category: 'ZeeBlok', subCategory: 'MTF' },
      { category: 'ZeeBlok', subCategory: 'Kazetta' },
      { category: 'ZeeBlok', subCategory: 'Minősítés' },
      { category: 'ZeeLung', subCategory: 'Extruder' },
      { category: 'ZeeLung', subCategory: 'Cord' },
      { category: 'ZeeLung', subCategory: 'Sheet' },
      { category: 'ZeeLung', subCategory: 'Potting' },
      { category: 'ZeeLung', subCategory: 'Kazetta' },
      { category: 'ZeeLung', subCategory: 'Minősítés' }
    ];

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
    }
  }
  Controller.$inject = ['$cookies', '$state', '$rootScope'];
  return Controller;
});
