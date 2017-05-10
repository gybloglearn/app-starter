define([], function () {
  'use strict';
  function Controller($cookies, $state, $rootScope) {
    var vm = this;

    vm.lista = [
      {category: 'Dashboards',subCategory: 'ZW500',reports: []},
      {category: 'Dashboards',subCategory: 'ZW1000',reports: []},
      {category: 'Dashboards',subCategory: 'ZW1500',reports: []},
      {category: 'ZW500',subCategory: 'Dope',reports: []},
      {category: 'ZW500',subCategory: 'Braiding',reports: []},
      {category: 'ZW500',subCategory: 'Fiber',reports: []},
      {category: 'ZW500',subCategory: 'SheetMaker',
        reports: [
          {title: 'Scrap',picture:'app/components/start/smscrap.jpg',link:'http://3.228.180.13/smscrap/',description:'Lapselejt kimutatások SM-enként, típusonként, hibakódonként, naponta'},
          {title: 'Production',picture:'app/components/start/production.jpg',link:'http://3.228.180.15/new_sm',description:'Termelt mennyiségek gépenként tervhez hasonlítva'},
          {title: 'OEE',picture:'app/components/start/oee.jpg',link:'http://3.228.180.15/new_sm/#/sm_data',description:'Állásidők eloszlása SM-enként, órai darabszámok, hibapareto'}
        ]
      },
      {category: 'ZW500',subCategory: 'Potting',reports: []},
      {category: 'ZW500',subCategory: 'MTF',reports: []},
      {category: 'ZW500',subCategory: 'Kazetta', reports: []},
      {category: 'ZW500',subCategory: 'Minősítés', reports: []},
      {category: 'ZW1000',subCategory: 'Dope'},
      {category: 'ZW1000',subCategory: 'Bundle'},
      {category: 'ZW1000',subCategory: 'Potting'},
      {category: 'ZW1000',subCategory: 'ETF'},
      {category: 'ZW1000',subCategory: 'Kazetta'},
      {category: 'ZW1000',subCategory: 'Minősítés'},
      {category: 'ZW1500',subCategory: 'Bundle'},
      {category: 'ZW1500',subCategory: 'Potting'},
      {category: 'ZW1500',subCategory: 'MTF'},
      {category: 'ZW1500',subCategory: 'Kazetta'},
      {category: 'ZW1500',subCategory: 'Minősítés'},
    ];

    activate();

    function activate() {
      (!$cookies.getObject('user')?$state.go('login'):$rootScope.user=$cookies.getObject('user'));
    }
  }
  Controller.$inject = ['$cookies', '$state', '$rootScope'];
  return Controller;
});
