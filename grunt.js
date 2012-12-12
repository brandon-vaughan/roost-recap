/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: [ 'grunt.js', 'build/app/**/*.js', 'test/tests/*.js' ]
    },
    watch: {
      files: [ 'build/sass/**/*.scss' ],
      tasks: [ 'compass:dev' ]
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        require: true,
        define: true
      }
    },

    compass: {
      dev: {
        src: 'build/sass',
        dest: 'public/stylesheets',
        linecomments: true,
        forcecompile: true,
        debugsass: true,
        images: 'public/images',
        relativeassets: true
      },
      prod: {
        src: 'assets/scss',
        dest: 'assets/prod/css',
        outputstyle: 'compressed',
        linecomments: false,
        forcecompile: true,
        require: [
          'animate-sass',
          'mylib'
        ],
        debugsass: false,
        images: '/path/to/images',
        relativeassets: true
      }
    },
    requirejs: {
      compile: {
        options: {
          // https://github.com/jrburke/r.js/blob/master/build/example.build.js
          appDir: 'public/',
          baseUrl: './',

          modules: [ { name: 'app/main' } ],
          dir: 'build',

          paths: {
            underscore: 'lib/underscore',
            backbone: 'lib/backbone',
            jquery: 'lib/jquery',
            text: 'lib/text'
          },

          shim: {
            'underscore': {
              exports: '_'
            },
            'backbone': {
              exports: 'Backbone',
              deps: [ 'jquery', 'underscore' ]
            }
          }
        }
      }
    },

    mocha: {
      all: [ 'http://liveprez:4000/_test/runner/' ]
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint mocha');
  grunt.loadNpmTasks('grunt-compass');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

};
