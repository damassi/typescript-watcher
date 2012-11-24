/**
 * TypeScript-Watcher commands
 * 
 * @author Christopher Pappas | github.com/damassi
 * @since 11.23.12
 */

var fs				= require( 'fs' );
var sysPath			= require( 'path' );
var tscSettings		= require( './../lib/tsc-settings' );
var tscwatch		= require( './../lib/tscwatch');


//--------------------------------------
//+ PUBLIC INTERFACE
//--------------------------------------

/**
 * Loads a configuration file and runs the watcher based upon suplied params
 * @param  {Object}   options  an options hash consisting of params located in cli.js
 * @param  {Function} callback callback function to execute on complete
 */
exports.runConfig = function( options, callback ) {
	var config = JSON.parse( fs.readFileSync( sysPath.join( __dirname, '..', '..', 'config.json' )));
	
	tscwatch.init( tscSettings.parse( config ));
}

/**
 * Builds the project and then exits
 * @param  {Object}   options  an options hash consisting of params located in cli.js
 * @param  {Function} callback callback function to execute on complete
 */
exports.build = function( options, callback ) {
	var tscOptions = {
		watch: false,
		rootPath: options.rootPath,
		outputPath: options.outputPath
	}

	tscwatch.init( tscSettings.parse( tscOptions ));
}

/**
 * Watches the project for changes
 * @param  {Object}   options  an options hash consisting of params located in cli.js
 * @param  {Function} callback callback function to execute on complete
 */
exports.watch = function( options, callback ) {
	var tscOptions = {
		watch: true,
		rootPath: options.rootPath,
		outputPath: options.outputPath
	}

	tscwatch.init( tscSettings.parse( tscOptions ));
}