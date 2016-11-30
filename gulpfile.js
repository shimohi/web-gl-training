// gulpfile.js

const gulp = require("gulp");
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const tsify = require("tsify");
const stringify = require('stringify');
const tslint = require("gulp-tslint");

const BASE_DIR = "./src";
const MAIN = "./ts/main.ts";

const tsConfig = {
	"target": "es5",
	"module": "commonjs",
	"noImplicitAny": true,
	"declaration":true,
	"sourceMap": true,
	"inlineSourceMap":false,
	"inlineSources":true,
	"lib": ["es5", "es2015.promise", "dom"]
};

gulp.task("tslint", () =>

	gulp.src(['src/**/*.ts'])
	.pipe(tslint({
		formatter: "verbose"
	}))
	.pipe(tslint.report())
);

gulp.task('compile',['tslint'], ()=>{

	return browserify({
		basedir: BASE_DIR,
		debug: true,
		entries: [MAIN],
		cache: {},
		packageCache: {}
	})
	.plugin(tsify, tsConfig)
	.transform(stringify, {
		appliesTo: { includeExtensions: ['.vert', '.frag'] },
		minify: true
	})
	.bundle()
	.pipe(source('bundle.js'))
	.pipe(gulp.dest("dist"));
});

gulp.task('default', ['compile']);
