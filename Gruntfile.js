module.exports = function (grunt) {

  var readOptionalJSON = function (filepath) {
      var data = {};
      try {
        data = grunt.file.readJSON(filepath);
      } catch (e) {}
      return data;
    },
    srcHintOptions = readOptionalJSON('src/.jshintrc' ),
    fs = require('fs' ),
    swig = require('swig');

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
    },
    release: {
      options: {
        commitMessage: 'Update version <%= version %>',
        tagMessage: '<%= version %>',
        github: {
          repo: 'tcorral/Hydra.js',
          usernameVar: process.env.GITHUB_USERNAME,
          passwordVar: process.env.GITHUB_PASSWORD
        }
      }
    }
});

  // Load the plugins
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-mocha-cli");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-release-steps');

  grunt.registerTask('readme', 'Creates a README.md from template', function (){
    var done = this.async(),
        oREADMETemplate = swig.compileFile( 'templates/README.tpl' );
    fs.stat( 'versions/hydra.min.js.gz', function ( err, stats ) {
      fs.writeFile( 'README.md', oREADMETemplate({
        version: grunt.file.readJSON('package.json').version,
        size: (stats.size / 1024).toFixed(2)
      }), function ( err ) {
        if( err ) {
          throw err;
        }
        done();
      });
    });
  });
  // Default task(s).
  grunt.registerTask('test', ['jshint', 'mochacli']);
  grunt.registerTask('default', ['jshint', 'mochacli', 'uglify', 'compress', 'copy']);
  grunt.registerTask('deploy', ['jshint', 'mochacli', 'uglify', 'compress', 'copy', 'release:bump:minor', 'readme', 'release:add:commit:push:tag:pushTags:npm']);

};