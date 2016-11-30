var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('run', ['sync'],function(){
  gulp.watch('*.*', {}, reload);
});
gulp.task('sync', function() {
  var dir = __dirname.substr(__dirname.lastIndexOf('\\')+1,__dirname.length);

    browserSync.init(null,{
        proxy: "localhost/" + dir,
        browser: 'default'
    });
});