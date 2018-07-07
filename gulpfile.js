'use strict'
const cp = require('child_process')
const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const uglifyes = require('gulp-uglify-es').default
const concat = require('gulp-concat')
const prefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const plumber = require('gulp-plumber')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')

const messages = {
	jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build',
}


gulp.task('jekyll-build', (done) => {
	browserSync.notify(messages.jekyllBuild)
	return cp
		.spawn('bundle.bat', ['exec', 'jekyll', 'build'], {
			stdio: 'inherit',
		})
		.on('close', done)
})

gulp.task('jekyll-rebuild', ['jekyll-build'], () => {
	browserSync.reload()
})

gulp.task('browser-sync', ['sass', 'jekyll-build'], () => {
	browserSync.init({
		server: {
			baseDir: '_site',
		},
		port: 4000,
		ui: {
			port: 4001,
		},
	})
})

gulp.task('sass', () => {
	return gulp
		.src('./src/sass/main.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(prefixer({ browsers: ['last 2 versions'] }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./_site/assets/css/'))
		.pipe(gulp.dest('assets/css'))
		.pipe(browserSync.stream())
})

gulp.task('js', () => {
	return gulp
		.src('./src/js/**/*.js')
		.pipe(plumber())
		.pipe(concat('bundle.js'))
		.pipe(uglifyes())
		.pipe(gulp.dest('./_site/assets/js/'))
		.pipe(gulp.dest('./assets/js/'))
})

gulp.task('imagemin', () => {
	return gulp
		.src('./src/img/**/*')
		.pipe(plumber())
		.pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
		.pipe(gulp.dest('./_site/assets/img/'))
		.pipe(gulp.dest('./assets/img/'))
})

gulp.task('watch', () => {
	gulp.watch('./src/sass/**/*.scss', ['sass'])
	gulp.watch('./src/js/**/*.js', ['js'])
	gulp.watch('./src/img/**/*.{jpg,png,gif,svg}', ['imagemin'])
	gulp.watch(['*.html', '_includes/*.html', '_layouts/*.html', '*.md', '_posts/*'],	['jekyll-rebuild'])
})

gulp.task('default', ['sass', 'js', 'imagemin', 'browser-sync', 'watch'])
