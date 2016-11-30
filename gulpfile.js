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
// add new route
gulp.task('route', function () {
  if (process.argv[3] == "--add") {
    var route = process.argv[4];
    function addToConfig(route) {
      return '\n' +
        '$stateProvider.state(\'' + route + '\', {\n' +
        ' url: \'/' + route + '\',\n' +
        ' templateUrl: \'./app/components/' + route + '/' + route + '.html\',\n' +
        ' controller: \'' + route + 'Controller\',\n' +
        ' controllerAs: \'vm\'\n' +
        '});';
    }
    console.log('Adding route: "' + route + '" to project');

    console.log('ADD to config');
    gulp.src('./app/components/config.js')
      .pipe(inject.after('/* Add states */', addToConfig(route)))
      .pipe(gulp.dest('./app/components/'));

    console.log('ADD to module');
    gulp.src('./app/components/module.js')
      .pipe(inject.before('/* files */', ', \'./' + route + '/' + route + '.ctrl\''))
      .pipe(inject.before('/* names */', ', ' + route + 'Controller'))
      .pipe(inject.before('/* controllers */', '\t app.controller(\'' + route + 'Controller' + '\', ' + route + 'Controller);\n'))
      .pipe(gulp.dest('./app/components/'));

    console.log('ADD to index.html');
    gulp.src('./index.html')
      .pipe(inject.after('<!-- links -->', '\n<li><a ui-sref="' + route + '"><i class="icon-file"></i> ' + (route[0].toUpperCase() + route.slice(1)) + '</a></li>'))
      .pipe(gulp.dest('.'));

    console.log('ADD files');
    gulp.src('./app/components/start/start.html', { base: process.cwd() })
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
    console.log('nothing to do');
})