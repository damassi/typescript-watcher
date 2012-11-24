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
	"rootPath": ".",
	"outputPath": ".",
	"compilerOptions": {

		// {Boolean}
		"comments": { 
			defaults: true, 
			prop: _compilationSettings.emitComments 
		}, 

		// (str) : {Function}
		"concat": { 
			defaults: false, 
			method: '' //_compilationSettings.outputOne 
		}, 

		// {Boolean}
		"debug": { 
			defaults: false,
			prop: TypeScript.CompilerDiagnostics.debug 
		}, 

		// {Boolean}
		"declaration": { 
			defaults: false, 
			prop: _compilationSettings.generateDeclarationFiles
		}, 

		// {Boolean}
		"minw": { 
			defaults: false, 
			prop: _compilationSettings.minWhitespace 
		}, 

		// TypeScript.ModuleGenTarget.Synchronous || Asynchronous
		"moduleType": { 
			defaults: TypeScript.ModuleGenTarget.Synchronous, 
			prop: _compilationSettings.moduleGenTarget,
			options: {
				'commonjs': TypeScript.ModuleGenTarget.Synchronous,
				'amd': TypeScript.ModuleGenTarget.Asynchronous
			}
		}, 

		// {Boolean}
		"sourcemap": { 
			defaults: false,
			prop: _compilationSettings.mapSourceFiles 
		}, 

		// (str) : {Function}
		"style": { 
			defaults: '',
			method: '' //_compilationSettings.setStyleOptions 
		}, 

		// TypeScript.CodeGenTarget.ES3 | ES5
		"target": { 
			defaults: TypeScript.CodeGenTarget.ES3,
			prop: _compilationSettings.codeGenTarget,
			options: {
				'es3': TypeScript.CodeGenTarget.ES3,
				'es5': TypeScript.CodeGenTarget.ES5
			}
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

	// Loop through tsc-watcher options and / or config file
	for( var prop in params ) {
		if( params.hasOwnProperty( prop )) {
			if( _settingsMap.hasOwnProperty( prop )) {

				// Loop through TypeScript compiler options
				if( prop === 'compilerOptions' ) {
					var userCompilerSettings = params[ prop ];
					var compilerOptions = _settingsMap[ prop ];
					for( var option in userCompilerSettings ) {
						
						// found options, update value
						if( userCompilerSettings.hasOwnProperty( option )) {
							if( compilerOptions.hasOwnProperty( option )) {

								// check if settings provide options and map to full value
								var val, propOptions;
								if( compilerOptions[ option ].hasOwnProperty('options')) {
									val = userCompilerSettings[option].toLowerCase();
									compilerOptions[ option ].prop = compilerOptions[ option ].options[ val ]
									//console.log( compilerOptions[ option ].prop )
								} 

								// pass in value from config
								else {
									compilerOptions[ option ].prop = userCompilerSettings[ option ]
									//console.log( compilerOptions[ option ].prop );
								}
							}
						}
					}
				} 

				// update tsc-watcher options with user params
				else {
					_settingsMap[prop] = params[prop];
				}
			}
		}
	}

	return _settingsMap;
}