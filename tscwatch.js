/**
 * A file-watcher for TypeScript, providing common functionality currently missing in the tsc command
 * 
 * @author Christopher Pappas | github.com/damassi
 * @since 11.21.12
 */

var chokidar = require('chokidar');
var compiler = require('./compiler/TypeScriptCompiler');
var common = require('./lib/brunch/common');
var exec = require('child_process').exec;
var sys = require('sys')
var fs = require('fs');
var flags = require('optimist')

	// Construct help menu
	.usage('\nWatch your .ts files for changes and compile automatically.\nUsage: $0')

	// Path
    .demand('p')
    .alias('p', 'path')
    .describe('p', 'The base path to your typescript source')
    
    // Output
   	.demand('o')
    .alias('o', 'output')
    .describe('o', 'The output path that you want your .ts files to compile to')
    
    // Single build
    .alias('b', 'build')
    .describe('b', 'Compile the source and then exit')
    .default('b', false )
    
    //Module type
    .alias('m', 'module')
    .describe('m', 'The module type (AMD or commonjs).  Default is AMD')
    .default('m', 'AMD')

    .argv;

var TscWatch = (function(){

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
	 * @param  {[type]} path [description]
	 */
	function onErrorHandler( err ) {
		switch( err.code ) {
			case 'ENOENT':
				console.error('File or path not found: ', err.path );
				destroy();
				break;

		}

		console.log( 'Watch error: ', err );

		destroy();
	}

	function onCompilationComplete( err, js, fileName ) {
		if( err ) {
			console.log('Error compiling source: ', err );
			return destroy();
		}

		var path = getFilePath(fileName).replace( _path, _outputPath );
		var fullPath = path + getFileName( fileName );
		
		common.writeFile( fullPath, js, function(error, path, data){
			if (error === null) {
				console.log('Error writing file: ', error );
				destroy();
			}

			console.log( 'Compliation complete: ', path );
		});
	}

	//--------------------------------------
	//+ PRIVATE AND PROTECTED METHODS
	//--------------------------------------

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
			  	
			  	compiler.compile( data, path, onCompilationComplete );
			});
		}
	}

	/**
	 * Filters file-system files for only .ts related
	 * @param  {String} path the file path
	 * @return {String}      valid typescript file-paths
	 */
	function filter( path ) {
		// filter only typescript files
		if( path.match(/^.*\.(ts)$/i)) {
			// filter out interfaces and type definitions
			if( !path.match( /\.d\.ts/ )) {
				return path;
			}
		}

		return '';
	}

	/**
	 * Extracts the file-name from the path
	 * @param  {String} path the full path
	 * @return {String}      the file-name
	 */
	function getFileName( path ) {
		return path.match(/[^\/]*$/)[0];
	}

	/**
	 * Extracts the file-path from the path
	 * @param  {String} path the full file-path
	 * @return {String}      the file path
	 */
	function getFilePath( path ) {
		return path.replace(/[^\/]*$/, "");
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
	function destroy() {
		if( _watcher ) _watcher.close();
		process.exit();
	}

	/**
	 * @Constructor
	 * Initializes the module
	 */
	exports.init = (function() {

		// Base path
		if( typeof flags.p !== 'undefined' ) 
			_path = flags.p 

		// Output path
		if( typeof flags.o !== 'undefined' ) 
			_outputPath = flags.o;

		// Do we just want to build?
		if( typeof flags.b !== 'undefined' ) 
			_build = flags.b;

		// Module type
		if( typeof flags.m !== 'undefined' )
			_moduleType = flags.m;

		_watcher = chokidar.watch( _path, { persistent: !_build });

		addEventListeners();
	})();
})();