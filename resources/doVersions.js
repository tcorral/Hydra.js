// Required to gzip the minimized library.
var zlib = require('zlib');

// Required to read and write in filesystem.
var fs = require('fs');

// Required to browse over the paths.
var path = require('path');

// Required to minify the library.
var uglifyjs = require("uglify-js");

// Get the path of the project.
var sPath = path.resolve(__dirname + '/../');

// Read the source file using UTF8.
fs.readFile(sPath + '/src/Hydra.js', 'utf8', function (err, data) {
	if (err){
		throw err;
	}
	// After reading the content of the file we do a simple copy in versions directory.
	fs.writeFile(sPath + '/versions/hydra.js', data, 'utf8', function(err){

		// Get the minified library
		var result = uglifyjs.minify(sPath + "/versions/hydra.js");

		// Write the minified content to get a copy of the uglified content.
		fs.writeFile(sPath + '/versions/hydra.min.js', result.code, 'utf8', function(err){

			// Now is time to gzip the minified content
			zlib.gzip(result.code, function(_, zippedData){

				// We create a new gzipped version file of the library
				fs.writeFile(sPath + '/versions/hydra.min.js.gz', zippedData, 'utf8');
			});
		});
	});


});