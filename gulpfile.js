var gulp = require('gulp');
var exec = require('gulp-exec');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('run', ['startcode', 'sync'],function(){
  gulp.watch('*.*', {}, reload);
});
gulp.task('startcode', function(cb){
  return gulp.src('.').pipe(exec('code .'));
});
gulp.task('sync', function() {
  var dir = __dirname.substr(__dirname.lastIndexOf('\\')+1,__dirname.length);
   browserSync.init(null,{
        proxy: "localhost/" + dir,
        browser: 'default'
    });
});