var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	sourcemaps = require('gulp-sourcemaps'),
	del = require('del'),
	connect = require('gulp-connect'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	jade = require('gulp-jade');

var paths = {
	srcJs: ['./src/js/main.js', './src/js/**/*.js'],
	srcJsVendor: './node_modules/jquery/dist/jquery.min.js',
	srcSass: ['./src/sass/core.sass', './src/sass/**/*'],
	srcCssVendor: ['./node_modules/normalize.css/normalize.css'],
	srcImg: './src/img/**/*',
	srcTemplates: ['./src/templates/**/*.jade', '!./src/templates/layout.jade'],
	public: './public',
	publicJs: './public/js',
	publicCss: './public/css',
	publicImg: './public/img'
};

gulp.task('connect', function () {
	connect.server({
		name: 'Server start',
		root: paths.public,
		port: 8000,
		livereload: true
	});
});

// Clean all public folder
gulp.task('clean', function() {
	return del(paths.public);
});

// Jade to Html
gulp.task('html', function(){
	return gulp.src(paths.srcTemplates)
		.pipe(jade())
		.pipe(gulp.dest(paths.public))
		.pipe(connect.reload());
});

// Minify and copy all Custom JS
gulp.task('js', function() {
	return gulp.src(paths.srcJs)
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(concat('scripts.min.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.publicJs))
		.pipe(connect.reload());
});

// Minify and copy all Vendor JS
gulp.task('jsVendor', function() {
	return gulp.src(paths.srcJsVendor)
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(concat('vendors.min.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.publicJs));
});

// Sass to Css and Minify + compatibility ie8
gulp.task('css', function(){
	return gulp.src(paths.srcSass)
		.pipe(sass())
		.pipe(sourcemaps.init())
		.pipe(autoprefixer(['last 4 versions', '>= 1%']))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(concat('styles.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.publicCss))
		.pipe(connect.reload());
});

// Concat and Minify all Vendor Css
gulp.task('cssVendor', function(){
	return gulp.src(paths.srcCssVendor)
		.pipe(sass())
		.pipe(sourcemaps.init())
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(concat('vendors.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.publicCss))
});

// Copy all static images
gulp.task('img', function() {
	return gulp.src(paths.srcImg)
		.pipe(imagemin({optimizationLevel: 1, verbose: true}))
		.pipe(gulp.dest(paths.publicImg))
		.pipe(connect.reload());
});

/* Main tasks */

// Rerun the task when a file changes
gulp.task('watch', function() {
	gulp.watch([paths.srcTemplates], ['html']);
	gulp.watch([paths.srcJs], ['js']);
	gulp.watch([paths.srcSass], ['css']);
	gulp.watch([paths.srcImg], ['img']);
});

// The default task
gulp.task('default', ['connect', 'clean', 'html', 'js', 'jsVendor', 'css', 'cssVendor', 'img', 'watch']);