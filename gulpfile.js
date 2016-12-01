var gulp = require('gulp');
var inject = require('gulp-inject-string');
var rename = require('gulp-rename');
var exec = require('gulp-exec');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// run app and watch
gulp.task('run', ['startcode', 'sync'], function () {
  gulp.watch(['./app/**', '*.html', '*.js']).on('change', reload);
});

// start code
gulp.task('startcode', function () {
  gulp.src('.').pipe(exec('code .'));
});

// sync
gulp.task('sync', function () {
  var dir = __dirname.substr(__dirname.lastIndexOf('\\') + 1, __dirname.length);

  // Change project name in configs
  gulp.src('./app/require.config.js')
    .pipe(inject.replace('[APPREPLACE]', dir))
    .pipe(gulp.dest('./app/'));
  gulp.src('./app/app.js')
    .pipe(inject.replace('[APPREPLACE]', dir))
    .pipe(gulp.dest('./app/'));

  browserSync.init(null, {
    proxy: "localhost/" + dir,
    browser: 'default'
  });
});

gulp.task('rename', function(){

})
// add new service
gulp.task('service', function () {
  if (process.argv[3] == "--add") {
    var d = process.argv[4].split(':');
    var srv = {
      name: d[0],
      url: d[1]
    };
    console.log('ADD to module');
    gulp.src('./app/components/module.js')
      .pipe(inject.before('/* files */', ', \'./services/' + srv.name + '\'\n\t'))
      .pipe(inject.before('/* names */', ', ' + srv.name + 'Service\n\t'))
      .pipe(inject.before('/* controllers */', 'app.service(\'' + srv.name + 'Service' + '\', ' + srv.name + 'Service);\n\t\t'))
      .pipe(gulp.dest('./app/components/'));
    console.log('ADD file');
    gulp.src('./app/components/services/data.service.js', { base: process.cwd() })
      .pipe(inject.replace('url', srv.url))
      .pipe(rename({
        dirname: './app/components/services',
        basename: srv.name,
        suffix: '.service',
        extname: '.js'
      }))
      .pipe(gulp.dest('.'));
  } else
    console.log('Nothing to do!');
});

// add new route
gulp.task('route', function () {
  if (process.argv[3] == "--add") {
    var route = process.argv[4];
    function addToConfig(route) {
      return '\n' +
        '\t$stateProvider.state(\'' + route + '\', {\n' +
        '\t\turl: \'/' + route + '\',\n' +
        '\t\ttemplateUrl: \'./app/components/' + route + '/' + route + '.html\',\n' +
        '\t\tcontroller: \'' + route + 'Controller\',\n' +
        '\t\tcontrollerAs: \'vm\'\n' +
        '\t});';
    }
    console.log('Adding route: "' + route + '" to project');

    console.log('ADD to config');
    gulp.src('./app/components/config.js')
      .pipe(inject.after('/* Add states */', addToConfig(route)))
      .pipe(gulp.dest('./app/components/'));

    console.log('ADD to module');
    gulp.src('./app/components/module.js')
      .pipe(inject.before('/* files */', ', \'./' + route + '/' + route + '.ctrl\'\n\t'))
      .pipe(inject.before('/* names */', ', ' + route + 'Controller\n\t'))
      .pipe(inject.before('/* controllers */', 'app.controller(\'' + route + 'Controller' + '\', ' + route + 'Controller);\n\t\t'))
      .pipe(gulp.dest('./app/components/'));

    console.log('ADD to index.html');
    gulp.src('./index.html')
      .pipe(inject.after('<!-- links -->', '\n<li><a ui-sref="' + route + '"><i class="icon-file"></i> ' + (route[0].toUpperCase() + route.slice(1)) + '</a></li>'))
      .pipe(gulp.dest('.'));

    console.log('ADD files');
    gulp.src('./app/components/start/start.html', { base: process.cwd() })
      .pipe(inject.replace('Start', (route[0].toUpperCase() + route.slice(1))))
      .pipe(rename({
        dirname: './app/components/' + route,
        basename: route,
        extname: '.html'
      }))
      .pipe(gulp.dest('.'));
    gulp.src('./app/components/start/start.ctrl.js', { base: process.cwd() })
      .pipe(rename({
        dirname: './app/components/' + route,
        basename: route,
        suffix: '.ctrl',
        extname: '.js'
      }))
      .pipe(gulp.dest('.'));
  }
  else
    console.log('Nothing to do');
})