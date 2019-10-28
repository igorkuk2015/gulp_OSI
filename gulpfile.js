//Подключаем галп
const gulp = require("gulp");
//Объединение файлов
const concat = require("gulp-concat");
//Добапвление префиксов
const autoprefixer = require("gulp-autoprefixer");
//Оптисизация стилей
const cleanCSS = require("gulp-clean-css");
//Оптимизация скриптов
const uglify = require("gulp-uglify");
//Удаление файлов
const del = require("del");
//Синхронизация с браузером
const browserSync = require("browser-sync").create();
//Для препроцессоров стилей
const sourcemaps = require("gulp-sourcemaps");
//Sass препроцессор
const sass = require("gulp-sass");
//Подключения шаблонизатора
const nunjucks = require("gulp-nunjucks");
//Порядок подключения файлов со стилями
const styleFiles = ["./src/css/main.sass"];
//Порядок подключения js файлов
const scriptFiles = ["./src/js/lib.js", "./src/js/main.js"];
// Подключение картинок
const imagemin = require('gulp-imagemin');

gulp.task('img-compress', ()=>{
    return gulp.src('./src/img/**')
        .pipe(imagemin({
            progressive:true
        }))
        .pipe(gulp.dest('./build/img/'))
})

//Таск для обработки стилей
gulp.task("styles", (done) => {
  //Шаблон для поиска файлов CSS
  //Всей файлы по шаблону './src/css/**/*.css'

    gulp
      .src(styleFiles)
      .pipe(sourcemaps.init())
      // sass()
      .pipe(sass())
      //Объединение файлов в один
      .pipe(concat("style.css"))
      //Добавить префиксы
      .pipe(
        autoprefixer({
         //  browsers: ["last 2 versions"],
          cascade: false
        })
      )
      //Минификация CSS
      .pipe(
        cleanCSS({
          level: 2
        })
      )
      .pipe(sourcemaps.write("./"))
      //Выходная папка для стилей
      .pipe(gulp.dest("./build/css"))
      .pipe(browserSync.stream())
      done()
});

//Таск для обработки скриптов
gulp.task("scripts", (done) => {
  //Шаблон для поиска файлов JS
  //Всей файлы по шаблону './src/js/**/*.js'
  return (
    gulp
      .src(scriptFiles)
      //Объединение файлов в один
      .pipe(concat("script.js"))
      //Минификация JS
      .pipe(
        uglify({
          toplevel: true
        })
      )
      //Выходная папка для скриптов
      .pipe(gulp.dest("./build/js"))
      .pipe(browserSync.stream())
  );
  done()
});

// Таск для очистки папки build
gulp.task("del", (done) => {
  // return del(["build/*"]);
    done()
});

//Таск для отслеживания изменений в файлах
gulp.task("watch", (done) => {
  browserSync.init({
    server: {
      baseDir: "./build/"
    }
  });
  //Следить за файлами со стилями с нужным расширением
  gulp.watch("./src/css/**/*.sass", gulp.series("styles"));
  //Следить за JS файлами
  gulp.watch("./src/js/**/*.js", gulp.series("scripts"));
  //При изменении HTML запустить синхронизацию
  gulp.watch("./build/*.html").on("change", browserSync.reload);

  gulp.watch("./*.html", gulp.series('templates'));
  done()
});

gulp.task("templates", (done) => {
  gulp
    .src("./*.html")
    .pipe(nunjucks.compile({ name: "Sindre" }))
    .pipe(gulp.dest("build"))
  done()

});

//Таск по умолчанию, Запускает del, styles, scripts и watch
gulp.task(
  "default",
  gulp.series("del", gulp.parallel("styles", "scripts", "templates",'img-compress'), "watch")
);
