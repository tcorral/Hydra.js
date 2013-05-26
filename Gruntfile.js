module.exports = function (grunt) {

  var readOptionalJSON = function (filepath) {
      var data = {};
      try {
        data = grunt.file.readJSON(filepath);
      } catch (e) {}
      return data;
    },
    srcHintOptions = readOptionalJSON('src/.jshintrc');
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      dist: {
        src: [ "src/Hydra.js" ],
        options: srcHintOptions
      }
    },
    mochacli: {
      options: {
        require: ['should'],
        reporter: 'progress',
        bail: true
      },
      all: ['test/Hydra.js']
    },
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        expand: true,
        cwd: 'versions/',
        src: ['hydra.min.js'],
        dest: 'versions/'
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'src/', src: ['hydra.js'], dest: 'versions/'}
        ]
      }
    },
    uglify: {
      options: {
        banner: '/*! Hydra.js v<%= pkg.version %> | Date:<%= grunt.template.today("yyyy-mm-dd") %> |' +
          ' License: https://raw.github.com/tcorral/Hydra.js/master/LICENSE|' +
          ' (c) 2009, 2013\n' +
          '//@ sourceMappingURL=hydra.min.map\n' +
          '*/\n',
        preserveComments: "some",
        sourceMap: 'versions/hydra.min.map',
        sourceMappingURL: "hydra.min.map",
        report: "min",
        beautify: {
          ascii_only: true
        },
        compress: {
          hoist_funs: false,
          join_vars: false,
          loops: false,
          unused: false
        },
        mangle: {
          // saves some bytes when gzipped
          except: [ "undefined" ]
        }
      },
      build: {
        src: 'src/Hydra.js',
        dest: 'versions/hydra.min.js'
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-mocha-cli");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'mochacli', 'uglify', 'compress', 'copy']);

};