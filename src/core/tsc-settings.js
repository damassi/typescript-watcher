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
	"rootPath": "hey u",
	"outputPath": "ahh",
	"compilerOptions": {

		// {Boolean}
		"comments": { 
			defaults: true, 
			setProp: function( val ){ _compilationSettings.emitComments = val; }
		}, 

		// (str) : {Function}
		"concat": { 
			defaults: false, 
			method: '' //_compilationSettings.outputOne 
		}, 

		// {Boolean}
		"debug": { 
			defaults: false,
			setProp: function( val ){ TypeScript.CompilerDiagnostics.debug = val; }
		}, 

		// {Boolean}
		"declaration": { 
			defaults: false, 
			setProp: function( val ){ _compilationSettings.generateDeclarationFiles = val; }
		}, 

		// {Boolean}
		"minw": { 
			defaults: false, 
			setProp: function( val ){ _compilationSettings.minWhitespace = val; }
		}, 

		// TypeScript.ModuleGenTarget.Synchronous || Asynchronous
		"moduleType": { 
			defaults: TypeScript.ModuleGenTarget.Synchronous, 
			setProp: function( val ){ _compilationSettings.moduleGenTarget = val; },
			options: {
				'commonjs': TypeScript.ModuleGenTarget.Synchronous,
				'amd': TypeScript.ModuleGenTarget.Asynchronous
			}
		}, 

		// {Boolean}
		"sourcemap": { 
			defaults: false,
			setProp: function( val ){ _compilationSettings.mapSourceFiles = val; }
		}, 

		// (str) : {Function}
		"style": { 
			defaults: '',
			setProp: '' //function( val ){ _compilationSettings.setStyleOptions = val; } 
		}, 

		// TypeScript.CodeGenTarget.ES3 | ES5
		"target": { 
			defaults: TypeScript.CodeGenTarget.ES3,
			setProp: function( val ){ _compilationSettings.codeGenTarget = val; },
			options: {
				'es3': TypeScript.CodeGenTarget.ES3,
				'es5': TypeScript.CodeGenTarget.ES5
			}
		}
	}
}
	
/**
 * Sets the default TypeScript.CompilationSettings for the TypeScript compiler
 * 
 */
function _setDefaults() {
	var prop, compilerOptions = _settingsMap.compilerOptions;
	for( var prop in compilerOptions ) {
		if( compilerOptions.hasOwnProperty( prop )) {
			var settings = compilerOptions[ prop ];
			if( typeof settings.setProp === 'function' ) {
				settings.setProp( settings.defaults );
			};
		}
	}
}


//--------------------------------------
//+ PUBLIC INTERFACE
//--------------------------------------

/**
 * Returns default compiler options
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.returnBasicCompilerOptions = function( options ) {
	return {
		comments: options.comments || true,
		moduleType: options.moduleType || 'commonjs',
		sourcemap: options.sourcemap || false,
		target: options.target || 'ES3'
	}
}

/**
 * Parses suplied configuration parameters and returns a CompilationSettings object
 * @param  {Object} params a has of configuration options
 * 
 * @return {CompilationSettings}        
 */
exports.parse = function( params ) {
	_setDefaults();

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
							//console.log( option, userCompilerSettings[ option ])
							if( compilerOptions.hasOwnProperty( option )) {

								// check if settings provide options and map to full value
								var val, propOptions, setProp, configVal;
								if( compilerOptions[ option ].hasOwnProperty('options')) {
									val = userCompilerSettings[option].toLowerCase();
									configVal = compilerOptions[ option ].options[ val ];
								} 

								// or pass in value from config
								else {
									configVal = userCompilerSettings[ option ]
								}

								// update TypeScript.CompilationSettings with final values
								if( compilerOptions[ option ].hasOwnProperty( 'setProp' )) {
									setProp = compilerOptions[ option ].setProp;
									if( typeof setProp === 'function' ) {
										setProp( configVal );
									}
								}
							}
						}
					}
				} 

				// update values unrelated to TypeScript.CompilationSettings
				else {
					_settingsMap[prop] = params[prop];
				}
			}
		}
	}

	_settingsMap.compilationSettings = _compilationSettings;

	return _settingsMap;
}