var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	uglifyes = require('gulp-uglify-es').default,
	concat = require('gulp-concat'),
	prefixer = require('gulp-autoprefixer'),
	imagemin = require('gulp-imagemin'),
	plumber = require('gulp-plumber'),
	sass = require('gulp-sass'),
	cp = require('child_process');

var messages = {
	jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

gulp.task('jekyll-build', function (done) {
	browserSync.notify(messages.jekyllBuild);
	return cp.spawn('jekyll.bat', ['build'], { stdio: 'inherit' }).on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
	browserSync.reload();
})

gulp.task('browser-sync', ['sass', 'jekyll-build'], function () {
	browserSync.init({
		server: {
			baseDir: '_site'
		}
	})
})

gulp.task('sass', function () {
	return gulp.src('./src/sass/main.scss')
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(prefixer({ browsers: ['last 2 versions', '> 1%', 'Firefox ESR'] }))
		.pipe(gulp.dest('./_site/assets/css/'))
		.pipe(gulp.dest('assets/css'))
		.pipe(browserSync.stream())
});

gulp.task('js', function () {
	return gulp.src('./src/js/**/*.js')
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(uglifyes())
		.pipe(gulp.dest('./assets/js/'))

});

gulp.task('imagemin', function () {
	return gulp.src('./src/img/**/*')
		.pipe(plumber())
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest('./_site/assets/img/'))
		.pipe(gulp.dest('./assets/img/'))
});

gulp.task('watch', function () {
	gulp.watch('./src/sass/**/**/*.scss', ['sass']);
	gulp.watch('./src/js/**/*.js', ['js']);
	gulp.watch('./src/img/**/*.{jpg,png,gif}', ['imagemin']);
	gulp.watch(['*.html', '_layouts/*.html','_includes/*.html', '_posts/*'], ['jekyll-rebuild'])
});

gulp.task('default', ['sass', 'js', 'imagemin','browser-sync', 'watch']);