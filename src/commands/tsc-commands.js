/**
 * TypeScript-Watcher commands
 * 
 * @author Christopher Pappas | github.com/damassi
 * @since 11.23.12
 */

var fs			= require( 'fs' );
var sysPath		= require( 'path' );
var tscwatch	= require( './../lib/tscwatch');

//--------------------------------------
//+ PUBLIC INTERFACE
//--------------------------------------

exports.runConfig = function( options, callback ) {
	var config = JSON.parse( fs.readFileSync( sysPath.join( __dirname, '..', '..', 'config.json' )));
	console.log( config );
}

/**
 * Builds the project and then exits
 * @param  {Object}   options  an options hash consisting of params located in cli.js
 * @param  {Function} callback callback function to execute on complete
 */
exports.build = function( options, callback ) {
	options.build = true;

	tscwatch.init( options );
}

/**
 * Watches the project for changes
 * @param  {Object}   options  an options hash consisting of params located in cli.js
 * @param  {Function} callback callback function to execute on complete
 */
exports.watch = function( options, callback ) {
	options.build = false;

	tscwatch.init( options );
}