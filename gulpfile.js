var gulp = require("gulp");
var ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps'); // 生成map
var clean = require('gulp-clean');
var runSequence = require('gulp-sequence'); // 同步执行
var tsProject = ts.createProject('tsconfig.json');

gulp.task('api', function () {
    return gulp.src(['ts/**/*.ts'])
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(tsProject())
        .js
        .pipe(sourcemaps.write('./maps', { includeContent: false, sourceRoot: './maps' }))
        .pipe(gulp.dest('./build/'));
});

gulp.task('clean', function () {
    return gulp.src('./build/*').pipe(clean());
});

gulp.task('default', runSequence('api'));

gulp.task('build', runSequence('clean', 'api'));