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
        },
        files: {
          'dist/datalayer.js': ['lib/datalayer.js']
        }
      }
    },

    uglify: {
      options: {
        sourceMap: true
      },
      distMin: {
        files: {
          'dist/datalayer.min.js': ['dist/datalayer.js']
        }
      },
    },

    watch: {
      lib: {
        files: 'lib/**/*.js',
        tasks: ['browserify']
      },
    },

  });

  // load
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

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
      ['browserify']
  );

  // production build task - when you say 'grunt build-prod'
  grunt.registerTask(
      'build-prod',
      'Production Ready Build',
      ['build', 'uglify']
  );
};
