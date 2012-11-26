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
var common		= require('./../lib/brunch/common');
var utils 		= require('./../utils/string-utilities');

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
 * Hash of settings for the compiler
 * @type {Object}
 */
var _tscSettings = null;

/**
 * Compilation settings
 * @type {TypeScript.CompilationSettings}
 */
var _compilationSettings = null;

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
	compileSource( utils.filter( path )) //, { msg: ' has been added' });
}

/**
 * Handler for file changes
 * @param  {String} path The path to the changed file
 * 
 */
function onChangeHandler( path ) {
	compileSource( utils.filter( path ), { msg: ' has been changed' });
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

	var path = utils.getFilePath(fileName).replace( _path, _outputPath );
	var fullPath = path + utils.getFileName( fileName );
	
	common.writeFile( fullPath, js, function(error, path, data){
		if( error !== null ) {
			destroy({ msg: 'Error writing file: ' + error });
		}

		//console.log( 'Compliation complete: ', path );
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
		  	
		  	compiler.compile( data, path, outputSource, _compilationSettings );
		});
	}
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
	_tscSettings = tscSettings;
	_compilationSettings = _tscSettings.compilationSettings;
	_path = _tscSettings.rootPath;	
	_outputPath = _tscSettings.outputPath;

	// start watcher
	_watcher = chokidar.watch( _path, { persistent: _tscSettings.watch });

	addEventListeners();
};