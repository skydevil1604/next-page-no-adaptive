var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var cleancss = require('gulp-clean-css'); 
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var pipeline = require('readable-stream').pipeline;

gulp.task('server', ['styles'], ['compress'], ['img'], function() {
	
	browserSync.init({
		server: { baseDir: './app/'}
	});

	// watch('./app/**/*.html', browserSync.stream());
	// watch('./app/**/*.js', browserSync.reload());
	// watch('./app/img/*.*', browserSync.reload());


    watch(['./app/**/*.html', './app/**/*.js', './app/img/*.*']).on('change', browserSync.reload);


	watch('./app/sass/**/*.scss', function(){
		gulp.start('styles');
	});

	watch('./app/lib/*.js', function(){
		gulp.start('compress');
	});

	watch('./app/img/*.*', function(){
		gulp.start('img');
	});

});

gulp.task('compress', function () {
	return pipeline(
		  gulp.src('./app/lib/*.js'),
		  uglify(),
		  gulp.dest('./app/jsmin')
	);
  });

gulp.task('img', function () {
	return gulp.src('./app/img/*')
	.pipe(imagemin())
	.pipe(gulp.dest('./app/images'));
  });

gulp.task('styles', function() {
	return gulp.src('./app/sass/main.scss')
	.pipe(plumber({
		errorHandler: notify.onError(function(err){
			return {
				title: 'Styles',
				sound: false,
				message: err.message
			};
		})
	}))
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(autoprefixer({
		browsers: ['last 6 versions'],
		cascade: false
	}))
	.pipe(sourcemaps.write())
	.pipe(cleancss({compatibility: 'ie8'}))
	.pipe(gulp.dest('./app/css'))
	.pipe(browserSync.stream());
});

gulp.task('default', ['server']);
