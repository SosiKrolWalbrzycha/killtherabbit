const { src, dest, series, parallel, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const cssnano = require('gulp-cssnano')
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const sourcemaps = require('gulp-sourcemaps')
const clean = require('gulp-clean')
const kit = require('gulp-kit')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload

//tutaj defninicja ścieżek żeby tego potem nie poprawiać

const paths = {
	
	html: './html/**/*.kit',
	sass: './src/sass/**/*.scss',
	js: './src/js/**/*.js',
	img: './src/img/*',
	sassDest: './dist/css',
	jsDest: './dist/js',
	imgDest: './dist/img',
	dist: './dist',
}

function sassCompiler(done) {
	src(paths.sass) //tu użyliśmy ścieżki
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cssnano())
		.pipe(rename({ suffix: '-ready' }))
		.pipe(sourcemaps.write())
		.pipe(dest(paths.sassDest))
	done()
}

function javaScript(done) {
	src(paths.js)
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: ['@babel/env'],
			})
		)
		.pipe(uglify())
		.pipe(rename({ suffix: '-readyjs' }))
		.pipe(sourcemaps.write())
		.pipe(dest(paths.jsDest))

	done()
}

function convertImg(done) {
	src(paths.img).pipe(imagemin()).pipe(dest(paths.imgDest))

	done()
}

function handleKits(done) {
	src(paths.html).pipe(kit()).pipe(dest('./'))

	done()
}

function cleanStuff(done) {
	src(paths.dist, { read: false }).pipe(clean())
	done()
	//Ta funkacja msi być wywyołana ręcznie gulp cleanStuff (bo jest niebezpieczna usuwa cały katalog dist)
}

function startBrowserSync(done) {
	browserSync.init({
		server: {
			baseDir: './',
		},
	})

	done()
}

function watchForChanges(done) {
	watch('./*.html').on('change', reload)
	watch([paths.html, paths.sass, paths.js], parallel(handleKits, sassCompiler, javaScript)).on('change', reload)
	watch(paths.img, convertImg).on('change', reload)
	done()
}

// pipe znaczy tyle samo co then w js
const mainFunctions = parallel(handleKits, sassCompiler, javaScript, convertImg)
exports.default = series(mainFunctions, startBrowserSync, watchForChanges)
exports.cleanStuff = cleanStuff
