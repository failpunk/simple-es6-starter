module.exports = function (grunt) {
// require time grunt to give us some info
  require('time-grunt')(grunt);

  // configure
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    // [grunt-browserify] browserify and babel all the things
    browserify: {
      dist: {
        options: {
          transform: [
            [
              'babelify',
              {
                loose: 'all'
              }
            ]
          ],
          external: ['./node_modules/angular/angular.min.js']
        },
        files: {
          'dist/js/answers.js': ['app/answers.js']
        }
      }
    },

    //https://github.com/vojtajina/grunt-bump
    bump: {
      options: {
        commit: false,
        createTag: false,
        push: false
      }
    },

    uglify: {
      options: {
        sourceMap: true
      },
      distMin: {
        files: {
          'dist/js/answers.min.js': ['dist/js/answers.js']
        }
      },
      templates: {
        files: {
          'dist/js/templates.min.js': ['dist/js/templates.js']
        }
      }
    },

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'dist/css/answers.css': 'sass/answers.scss',
          'dist/temp/css/vendor/twemoji-awesome.css': 'sass/twemoji-awesome.scss'
        }
      }
    },

    watch: {
      angular: {
        files: 'app/**/*.js',
        tasks: ['browserify']
      },
      templates: {
        files: 'app/**/*.html',
        tasks: ['copy:dev', 'ngtemplates', 'clean']
      },
      css: {
        files: 'sass/**/*.scss',
        tasks: ['sass']
      }
    },

    ngtemplates: {
      templates: {
        cwd: 'dist/',
        src: 'templates/*.html',
        dest: 'dist/js/templates.js',
        options: {
          standalone: true
        }
      }
    },

    clean: ['dist/templates', 'dist/temp'],

    copy: {
      dev: {    // copy template files to the shared templates folder in web
        files: [
          {
            src: 'app/**/templates/*.html',
            dest: 'dist/templates/',
            flatten: true,
            expand: true
          },
          {
            src: 'node_modules/angular-toastr/dist/angular-toastr.min.css',
            dest: 'dist/temp/css/vendor/',
            flatten: true,
            expand: true
          },
          {
            src: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
            dest: 'dist/temp/css/vendor/',
            flatten: true,
            expand: true
          },
          {
            src: 'node_modules/normalize.css/normalize.css',
            dest: 'dist/temp/css/vendor/',
            flatten: true,
            expand: true
          },
          {
            src: 'images/*',
            dest: 'dist/'
          },
          {
            src: 'fonts/*',
            dest: 'dist/css/'
          }
        ]
      },
      prod: {
        // Use minified versions of files
        files: [
          {
            src: 'dist/css/answers.min.css',
            dest: 'dist/css/answers.css'
          },
          {
            src: 'dist/js/answers.min.js',
            dest: 'dist/js/answers.js'
          },
          {
            src: 'dist/js/templates.min.js',
            dest: 'dist/js/templates.js'
          }
        ]
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      vendor : {
        expand: true,
        cwd: 'dist/temp/css/vendor/',
        src: ['*.css'],
        dest: 'dist/temp/css/vendor/',
        ext: '.min.css'
      },
      answers : {
        expand: true,
        cwd: 'dist/css/',
        src: ['answers.css'],
        dest: 'dist/css/',
        ext: '.min.css'
      },
      combine : {
        files: {
          'dist/css/vendor.min.css': [
              'dist/temp/css/vendor/normalize.min.css',
              'dist/temp/css/vendor/angular-toastr.min.css',
              'dist/temp/css/vendor/bootstrap.min.css',
              'dist/temp/css/vendor/twemoji-awesome.css'
          ]
        }
      }
    },

    // Set dev or production environment variable on window
    "string-replace": {
      dev: {
        files: {
          "dist/index.php": "index.php"
        },
        options: {
          replacements: [
            {
              pattern: "window.prod = true;",
              replacement: "window.prod = false;"
            }
          ]
        }
      },
      prod: {
        files: {
          "dist/index.php": "index.php"
        },
        options: {
          replacements: [
            {
              pattern: "window.prod = false;",
              replacement: "window.prod = true;"
            }
          ]
        }
      }
    }

  });

  // load
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-string-replace');

  // default task - when you just say 'grunt'
  grunt.registerTask('default', 'watch task', function () {
    // lazy load watch
    grunt.loadNpmTasks('grunt-contrib-watch');
    // run tasks
    grunt.task.run(['build', 'watch']);
  });

  // build task - when you say 'grunt build'
  grunt.registerTask(
      'build',
      'Transpile and Build JS, copy templates',
      ['sass', 'copy:dev', 'cssmin', 'browserify', 'ngtemplates', 'uglify', 'clean', 'string-replace:dev']
  );

  // production build task - when you say 'grunt build-prod'
  grunt.registerTask(
      'build-prod',
      'Production Ready Build',
      ['build', 'copy:prod', 'string-replace:prod']
  );
};
