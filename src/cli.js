/**
 * Handles configuration from both the command line and config.json
 * 
 * @author Christopher Pappas | github.com/damassi
 * @since 11.23.12
 */

var argumentum	= require( 'argumentum' );
var fs			= require( 'fs' );
var sysPath		= require( 'path' );
var commands	= require( './commands/tsc-commands' );

/**
 * Argumentum command line configuration
 * @type {Object}
 */
var _commandLineConfig = {
	script: "tscwatch",
	commandRequired: true,
	commands: {
		
		"build": {
			abbr: "b",
			help: "Build TypeScript project",
			options: {
				rootPath: {
					position: 1,
					help: "the root path of the project",
					metavar: "ROOT_PATH",
					required: true
				},

				outputPath: {
					position: 2,
					help: "the output path for compiled files",
					metavar: "OUTPUT_PATH",
					required: true
				}
			},
			callback: commands.build
		},

		"watch": {
			abbr: "w",
			help: "Watch TypeScript project for changes and automatically compile",
			options: {
				rootPath: {
					position: 1,
					help: "the root path of the project",
					metavar: "ROOT_PATH",
					required: true
				},

				outputPath: {
					position: 2,
					help: "the output path for compiled files",
					metavar: "OUTPUT_PATH",
					required: true
				}
			},
			callback: commands.watch
		},

		"run-config": {
			abbr: 'rc',
			help: 'Load config file and run tscwatch based upon supplied params',
			options: {
				path: {
					position: 1,
					help: "the path to the configuration file",
					metavar: "CONFIG_PATH",
					required: true
				}
			},
			callback: commands.runConfig
		}
	},

	options: {

		"comments": {
			abbr: 'c',
			help: 'output comments in the compiled source',
			flag: true
		},

		"moduleType": {
			abbr: 'm',
			help: 'set the compiled source module type (commonjs or AMD).  Default is commonjs'
		},

		"sourcemap": {
			abbr: 's',
			help: 'output sourcemaps alongside compiled source',
			flag: true
		},

		"target": {
			abbr: 't',
			help: 'output JavaScript version; options are "ES3" and "ES5".  Default is "ES3"'
		},

		"version": {
	      	abbr: 'v',
	      	help: 'display tscwatch version',
	      	flag: true,
	      	callback: _returnPackageVersion,
		},
	}
}

/**
 * Returns the current tscwatch package version
 * @return {String} 
 */
function _returnPackageVersion() {
	return JSON.parse( fs.readFileSync( sysPath.join( __dirname, '..', '..', 'package.json' ))).version;
}


//--------------------------------------
//+ PUBLIC INTERFACE
//--------------------------------------

/**
 * Sets up the command line interface and optionally pulls from config.json settings
 * 
 */
exports.run = function() {
	argumentum.load(_commandLineConfig).parse()
}
