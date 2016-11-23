require.config({
    'baseUrl': './',
    config: { 'map-loader': {
        configFileName: '../../../docs/data/map-config-search-evaluate.json'
      }
    },
    'paths': {
        'brandkit': 'components/brandkit/js/iidx-brandkit',
        'cascading-list': 'components/cascading-list/js/cascading-list',
        'charts': 'components/charts/js/charts',
        'charts-theme': 'components/charts/js/charts/theme',
        'collapsible-list': 'components/collapsible-list/js/collapsible-list',
        'datatables-colreorder': 'components/datatables-col-reorder/index',
        'datatables-scroller': 'components/datatables-scroller/index',
        'contextmenu': 'components/contextmenu/js/contextmenu',
        'd3-amd': 'components/d3-amd/d3',
        'datagrids': 'components/datagrids/js/datagrids',
        'datatables': 'components/datatables/dist/media/js/jquery.dataTables',
        'datepicker': 'components/datepicker/js/datepicker',
        'declarative-visualizations': 'components/declarative-visualizations/js/declarative-visualizations',
        'ge-bootstrap': 'components/ge-bootstrap/js/ge-bootstrap',
        'iids-navbar': 'components/navbar/js/navbar',
        'navbar': 'components/navbar/js/navbar', // added for tests
        'jquery': 'components/jquery/jquery.min',
        'jquery-csv': 'components/jquery-csv/src/jquery.csv',
        'jqueryui-sortable-amd': 'components/jqueryui-sortable-amd/js/jquery-ui-1.10.2.custom',
        'jQuery-contextMenu': 'components/jQuery-contextMenu/src/jquery.contextMenu',
        'modernizr': 'components/modernizr/modernizr',
        'jumpnav': 'components/jumpnav/js/jumpnav',
        'modules': 'components/modules/js/modules',
        'prettify': 'components/prettify/prettify',
        'respond': 'components/respond/respond.src',
        'responsive-emitter': 'components/responsive-emitter/js/responsive-emitter',
        'responsive-tables': 'components/responsive-tables/js/responsive-tables',
        'spinner': 'components/spinner/js/spinner',
        'trays': 'components/trays/js/trays',
        'spin': 'components/spin.js/dist/spin',
        'highcharts': 'components/highcharts-amd/js/highcharts.src',
        'highstock': 'components/highcharts-amd/js/highstock.src',
        'highcharts-more': 'components/highcharts-amd/js/highcharts-more.src',
        'bootstrap-datepicker': 'components/bootstrap-datepicker/js/bootstrap-datepicker',
        'jquery-ui-touch-punch': 'components/jquery-ui-touch-punch/jquery.ui.touch-punch',
        'multi-step-navigation': 'components/multi-step-navigation/js/multi-step-navigation',
        'twitter-bootstrap-wizard': 'components/twitter-bootstrap-wizard/jquery.bootstrap.wizard',
        'requirejs': 'components/requirejs/require',
        'videoplayer': 'components/videoplayer/js/videoplayer',
        'videojs': 'components/videoplayer/js/video',
        'map-core-component': 'components/map-core/js',
        'map-core': 'components/map-core/js/map-core', //backwards compatibility only, can be removed in a non-backwards compatible release w/ client paths change to 'map-core-component/map-core'
        'map-loader': 'components/map-core/js/map-loader', //backwards compatibility only, can be removed in a non-backwards compatible release w/ client paths change to 'map-core-component/map-loader'
        'map-cluster-component': 'components/map-cluster/js',
        'map-cluster': 'components/map-cluster/js/map-cluster', //backwards compatibility only, can be removed in a non-backwards compatible release w/ client paths change to 'map-cluster-component/map-cluster'
        'map-street-view': 'components/map-core/js/map-streetview', //backwards compatibility only, can be removed in a non-backwards compatible release w/ client paths change to 'map-core-component/map-streetview'
        'map-layer-list': 'components/map-layerlist/js/map-layer-list',
        'map-geolocate': 'components/map-geolocate/js/map-geolocate',
        'map-google-component': 'components/map-google/js',
        'map-google': 'components/map-google/js/googlemaps', //backwards compatibility only, can be removed in a non-backwards compatible release w/ client paths change to 'map-google-component/googlemaps'
        'googlemaps': 'components/map-google/js/googlemaps', // added because of tests
        'map-markers-component': 'components/map-markers/js',
        'map-markers': 'components/map-markers/js/map-markers', //backwards compatibility only, can be removed in a non-backwards compatible release w/ client paths change to 'map-markers-component/map-markers'
        'map-popovers': 'components/map-popovers/js/map-popovers',
        'map-search-component': 'components/map-search/js',
        'lunr' : 'components/lunr/js/lunr',
        'map-search': 'components/map-search/js/asset-address-search', //backwards compatibility only, can be removed in a non-backwards compatible release w/ client paths change to 'map-search-component/asset-address-search'
        'map-zoom': 'components/map-zoom/js/map-zoom',
        'hogan': 'components/hogan/index',
        'underscore': 'components/underscore-amd/index',
        'OpenLayers': 'components/open-layers/dist/OpenLayers',
        'map-layerlist': 'components/map-layerlist/js/map-layer-list',
        'highcharts.src': 'components/highcharts-amd/js/highcharts.src',
        'highstock.src': 'components/highcharts-amd/js/highstock.src',
        'highcharts-more.src': 'components/highcharts-amd/js/highcharts-more.src',
        'bootstrap-switch': 'components/bootstrap-switch/static/js/bootstrap-switch',
        'oo-utils': 'components/oo-utils/src/js/oo-utils',
        'toggle-switch': 'components/toggle-switch/src/js/toggle-switch',
        'moment': 'components/momentjs/min/moment.min',
        'bootstrap-timepicker': 'components/bootstrap-timepicker/js/bootstrap-timepicker',
        'timepicker': 'components/timepicker/js/timepicker',
        'slider': 'components/slider/js/slider',
        'bootstrap': 'components/bootstrap/js',
        "typeahead": "components/typeahead.js/dist/typeahead.jquery.min",
  			"bloodhound": "components/typeahead.js/dist/bloodhound.min",
        'angular': 'components/angular.js/angular.min',
        'angular-route': 'components/angular.js/angular-route.min',
        'angular-cookies': 'components/angular.js/angular-cookies.min',
        'angular-animate': 'components/angular.js/angular-animate.min',
        'angular-resource': 'components/angular.js/angular-resource.min',
        'angular-locale_hu-hu': 'components/angular.js/angular-locale_hu-hu',
        'angular-ui-router': 'components/angular.js/angular-ui-router.min',
        'app': 'app-starter/js/app',
    },
    'shim': {
        'app': {
          deps: ['angular', 'angular-cookies', 'angular-ui-router'],
          exports: 'app'
        },
        'angular': {
          deps:['jquery'],
          exports: 'angular'
        },
        'angular-locale_hu-hu': { deps: ['angular']},
        'angular-ui-router': {deps: ['angular']},
        'angular-route': { deps: ['angular']},
        'angular-animate': { deps: ['angular']},
        'angular-cookies': { deps: ['angular']},
        'angular-resource': {deps: ['angular']},
        'typeahead': {
  				deps: ['jquery'],
  				exports: 'Typeahead'
  			},
  			'bloodhound': {
  				deps: ['jquery'],
  				exports: 'Bloodhound'
  			},
        'OpenLayers': {
          'exports': 'OpenLayers'
        },
        'jquery-csv': [
          'jquery'
        ],
        'bootstrap-switch': ['jquery'],
        'bootstrap-timepicker': ['jquery'],
        'datagrids/datagrids-col-vis': {
          'deps': ['jquery', 'datatables']
        },
        'datatables-colreorder': {
          'deps': ['jquery', 'datatables']
        }
    }
});
