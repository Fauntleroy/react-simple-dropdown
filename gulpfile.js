var vinyl_source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var gulp = require('gulp');
var gulp_util = require('gulp-util');
var gulp_watch = require('gulp-watch');


// Compile JS

var generateBrowserifyBundler = function () {
    var bundler = browserify( './src/index.jsx', watchify.args );
    bundler.transform('babelify');
    bundler.transform('cssify');
    return bundler;
};

var generateBrowserifyStream = function( bundler ){
    var stream = bundler.bundle()
        .on( 'error', gulp_util.log.bind( gulp_util, 'Browserify Error' ) )
        .pipe( vinyl_source('index.js') )
        .pipe( gulp.dest('./dist/') );
    return stream;
};

gulp.task( 'compile js', function () {
    var bundler = generateBrowserifyBundler();
    return generateBrowserifyStream( bundler );
});

gulp.task( 'compile and watch js', function () {
    var bundler = watchify( generateBrowserifyBundler(), {
        poll: true
    });
    var rebundle = function ()  {
        console.log('[watchify] Bundling js...');
        return generateBrowserifyStream( bundler );
    };
    bundler.on( 'update', rebundle );
    bundler.on( 'time', function( bundle_time ){
        console.log('[watchify] Bundled in '+ bundle_time +'ms');
    });
    return rebundle();
});


// Copy Static files

var copyStatic = function () {
    gulp_util.log('Copying static files');
    var stream = gulp.src('./src/index.html')
        .pipe( gulp.dest('./dist/') );
    return stream;
};

gulp.task( 'copy static', copyStatic );
gulp.task( 'watch static', function () {
    gulp_watch( './src/index.html', copyStatic );
});
gulp.task( 'copy and watch static', ['copy static', 'watch static']);


// Public tasks

gulp.task( 'build', ['compile js', 'copy static'] );
gulp.task( 'default', ['compile and watch js', 'copy and watch static'] );