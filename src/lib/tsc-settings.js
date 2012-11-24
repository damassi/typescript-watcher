/**
 * Creates a TypeScript.CompilationSettings() object and updates config based
 * upon either command-line params or config.json settings
 *
 * @author Christopher Pappas | github.com/damassi
 * @since 11.23.12
 */

var TypeScript	= require('typescript-wrapper');

/**
 * A TypeScript configuration object
 * @type {TypeScript}
 */
var _compilationSettings = new TypeScript.CompilationSettings();

/**
 * A hash of possible tsc-watcher settings, relevant TypeScript configuration props, and defaults.  
 * For a full list, see: // http://typescript.codeplex.com/SourceControl/changeset/view/d65fcce29d60#src%2fcompiler%2ftsc.ts  
 * 
 * @type {Object}
 */
var _settingsMap = {
	"watch": true,
	"rootPath": "",
	"outputPath": "",
	"compilerOptions": {

		// {Boolean}
		"comments": { 
			default: true, 
			prop: _compilationSettings.emitComments 
		}, 

		// (str) : {Function}
		"concat": { 
			default: false, 
			method: _compilationSettings.outputOne 
		}, 

		// {Boolean}
		"debug": { 
			default: false,
			prop: TypeScript.CompilerDiagnostics.debug 
		}, 

		// {Boolean}
		"declaration": { 
			default: false, 
			prop: _compilationSettings.generateDeclarationFiles
		}, 

		// {Boolean}
		"minw": { 
			default: false, 
			prop: _compilationSettings.minWhitespace 
		}, 

		// TypeScript.ModuleGenTarget.Synchronous || Asynchronous
		"moduletype": { 
			default: "commonjs", //TypeScript.ModuleGenTarget.Synchronous
			prop: _compilationSettings.moduleGenTarget 
		}, 

		// {Boolean}
		"sourcemap": { 
			default: false,
			prop: _compilationSettings.mapSourceFiles 
		}, 

		// (str) : {Function}
		"style": { 
			default: '',
			method: _compilationSettings.setStyleOptions 
		}, 

		// TypeScript.CodeGenTarget.ES3 | ES5
		"target": { 
			default: 'ES3',
			prop: _compilationSettings.codeGenTarget 
		}
	}
}


//--------------------------------------
//+ PUBLIC INTERFACE
//--------------------------------------

/**
 * Parses suplied configuration parameters and returns a CompilationSettings object
 * @param  {Object} params a has of configuration options
 * 
 * @return {CompilationSettings}        
 */
exports.parse = function( params ) {
	console.log( config );
}