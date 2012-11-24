/**
 * A file-watcher for TypeScript, providing common functionality currently 
 * missing in the tsc command.
 * 
 * @author Christopher Pappas | github.com/damassi
 * @since 11.21.12
 */

var chokidar	= require('chokidar');
var exec		= require('child_process').exec;
var sys			= require('sys')
var fs			= require('fs');
var compiler	= require('./../compiler/typescript-compiler');
var common		= require('./brunch/common');

/**
 * Events hash
 * @type {Object}
 */
var Event = {
	ADD: 'add',
	CHANGE: 'change',
	ERROR: 'error',
	UNLINK: 'unlink'
};

/**
 * Generic file-watcher
 * @type {Chokidar}
 */
var _watcher = null;

/**
 * Flag: -p
 * Path to typescript source-files
 * @type {String}
 */
var _path = '';

/**
 * Flag: -o
 * Output path for compiled typescript source
 * @type {String}
 */
var _outputPath = '';

/**
 * Flag: -b
 * Builds the project and compiles to the -o location
 * @type {Boolean}
 */
var _build = false;

/**
 * The default module type
 * @type {String}
 */
var _moduleType = 'AMD'


//--------------------------------------
//+ EVENT HANDLERS
//--------------------------------------

/**
 * Handler for file additions
 * @param  {String} path The path to the new file
 * 
 */
function onAddHandler( path ) {
	compileSource( filter( path ), { msg: ' has been added' });
}

/**
 * Handler for file changes
 * @param  {String} path The path to the changed file
 * 
 */
function onChangeHandler( path ) {
	compileSource( filter( path ), { msg: ' has been changed' });
}

/**
 * Handler for file unlinks
 * @param  {String} path The path to the file
 * 
 */
function onUnlinkHandler( path ) {
	console.log('File', path, 'has been removed');
}

/**
 * Handler for generic watcher errors
 * @param  {Object} err generic error object
 */
function onErrorHandler( err ) {
	switch( err.code ) {
		case 'ENOENT':
			destroy({ msg: 'File or path not found: ' + err.path  });
	}

	destroy({ msg:  'Watch error: ' + err });
}


//--------------------------------------
//+ PRIVATE AND PROTECTED METHODS
//--------------------------------------

/**
 * Outputs the source to a 
 * @param  {Object} err      generic error object
 * @param  {String} js       the compiled source
 * @param  {String} fileName the final output name
 */
function outputSource( err, js, fileName ) {
	if( err )
		return destroy({ msg: 'Error compiling source: ' + err });

	var path = getFilePath(fileName).replace( _path, _outputPath );
	var fullPath = path + getFileName( fileName );
	
	common.writeFile( fullPath, js, function(error, path, data){
		if( error !== null ) {
			destroy({ msg: 'Error writing file: ' + error });
		}

		console.log( 'Compliation complete: ', path );
	});
}

/**
 * Executes the `tsc` command and compiles source
 * @param  {String} path    the input file path
 * @param  {Object} options options
 *   - msg : {String} an optional message to output
 *  
 */
function compileSource( path, options ) {
	options = options || {};

	if( path.length ) {
		if( options.msg )
			console.log( 'File', path, options.msg );
		
		fs.readFile( path, 'utf8', function( err, data ) {
			if( err ) {
		    	return console.log( err );
		  	}
		  	
		  	compiler.compile( data, path, outputSource, _moduleType );
		});
	}
}

/**
 * Extracts the file-name from the path
 * @param  {String} path the full path
 * 
 * @return {String}      the file-name
 */
function getFileName( path ) {
	return path.match(/[^\/]*$/)[0];
}

/**
 * Extracts the file-path from the path
 * @param  {String} path the full file-path
 * 
 * @return {String}      the file path
 */
function getFilePath( path ) {
	return path.replace(/[^\/]*$/, "");
}

/**
 * Filters file-system files for only .ts related
 * @param  {String} path the file path
 * 
 * @return {String}      valid typescript file-paths
 */
function filter( path ) {
	// filter only typescript files
	if( path.match(/^.*\.(ts)$/i)) {
		// filter out interfaces and type definitions
		if( !path.substr(-5) !== '.d.ts') {
			return path;
		}
	}

	return '';
}

/**
 * Adds watch-related event listeners
 * 
 */
function addEventListeners() {
	
	// Compile all files and close watcher
	if( _build ) {
		_watcher.on( Event.ADD, onAddHandler );	
	}
	
	// Watch for file changes
	else {
		_watcher.on( Event.ADD, onAddHandler );	
		_watcher.on( Event.CHANGE, onChangeHandler );
		_watcher.on( Event.UNLINK, onUnlinkHandler );
		_watcher.on( Event.ERROR, onErrorHandler );
	}

	_watcher.close();
}

/**
 * Destroys the watcher and closes the process
 * 
 */
function destroy( options ) {
	options = options || {};

	if( typeof options.msg !== 'undefined' )
		console.log( options.msg );

	if( _watcher ) 
		_watcher.close();

	process.exit();
}


//--------------------------------------
//+ PUBLIC INTERFACE
//--------------------------------------

/**
 * Initializes the module
 * 
 */
exports.init = function( tscSettings ) {

	console.log( tscSettings )

	// Base path
	if( typeof tscSettings.rootPath !== 'undefined' ) 
		_path = tscSettings.rootPath 

	// Output path
	if( typeof tscSettings.outputPath !== 'undefined' ) 
		_outputPath = tscSettings.outputPath;

	// Do we just want to build?
	if( typeof tscSettings.watch !== 'undefined' ) 
		_watch = tscSettings.watch;

	// Module type
	if( typeof tscSettings.moduleType !== 'undefined' )
		_moduleType = tscSettings.compilerOptions.moduleType;

	_watcher = chokidar.watch( _path, { persistent: _watch });

	addEventListeners();
};