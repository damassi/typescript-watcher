/**
 * A file-watcher for TypeScript, providing common functionality currently missing in the tsc command
 * 
 * @author Christopher Pappas | github.com/damassi
 * @since 11.21.12
 */

var chokidar = require('chokidar');
var events = require('events');
var flags = require('optimist').argv;

var TscWatch = (function(){

	//--------------------------------------
	//+ PUBLIC PROPERTIES / CONSTANTS
	//--------------------------------------

	/**
	 * Events hash
	 * @type {Object}
	 */
	var Event = {
		ADD: 'add',
		CHANGE: 'change',
		UNLINK: 'unlink',
		ERROR: 'error',
		NO_PATH: 'onNoPath',
		NO_OUTPUT: 'onNoOutput'
	};


	//--------------------------------------
	//+ PRIVATE VARIABLES
	//--------------------------------------

	/**
	 * Generic file-watcher
	 * @type {Chokidar}
	 */
	var _watcher = null;

	/**
	 * Node event emitter 
	 * @type {EventEmitter}
	 */
	var _emitter = null;

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
	var _output = '';

	/**
	 * Flag: -b
	 * Builds the project and compiles to the -o location
	 * @type {Boolean}
	 */
	var _build = false;


	//--------------------------------------
	//+ EVENT HANDLERS
	//--------------------------------------

	/**
	 * Handler for base-path flag omissions
	 * 
	 */
	function onNoPathError() {
		console.error('Error: A base file-path must be provided.', err );
		destroy();
		
	}

	/**
	 * Handler for output path flag omissions
	 * 
	 */
	function onNoOutputError() {
		console.error('Error: An output file-path must be provided.' );
		destroy();
	}

	/**
	 * Handler for file additions
	 * @param  {String} path The path to the new file
	 * 
	 */
	function onAddHandler( path ) {
		console.log('File', path, 'has been added');
	}

	/**
	 * Handler for file changes
	 * @param  {String} path The path to the changed file
	 * 
	 */
	function onChangeHandler( path ) {
		console.log('File', path, 'has been changed');
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
	function onErrorHandler( path ) {
		console.error('Error happened', error);
	}

	//--------------------------------------
	//+ PRIVATE AND PROTECTED METHODS
	//--------------------------------------

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
		_emitter.removeAllListeners();	
		process.exit();
	}

	/**
	 * @Constructor
	 * Initializes the module
	 */
	var initialize = (function() {
		_emitter = new events.EventEmitter();
		_emitter.on( Event.NO_PATH, onNoPathError );
		_emitter.on( Event.NO_OUTPUT, onNoOutputError );

		var err = null;
		if( typeof flags.p !== 'undefined' ) 
			_path = flags.p 
		else
			err = Event.NO_PATH;

		if( typeof flags.o !== 'undefined' ) 
			_output = flags.o;
		else
			err = Event.NO_OUTPUT;

		if( typeof flags.b !== 'undefined' ) 
			_build = flags.b;

		if( err ) 
			_emitter.emit( err );

		_watcher = chokidar.watch( _path, { persistent: !_build });

		addEventListeners();
	})();
})();


