/**
 * Wrapper for compiling and emitting TypeScript files.  
 * Extracted from https://github.com/joshheyse/typescript-brunch/
 *
 * @author Josh Heyse (http://heyse.us/blog)
 * @author Christopher Pappas | github.com/damassi
 * @since 11.22.12
 */

var fs			= require("fs");
var sysPath		= require("path");
var io			= require("./io");
var TypeScript	= require('typescript-wrapper');

/**
 * Compilation settings for the typescript compiler
 * @type {CompilationSettings}
 */
var _settings = null;

/**
 * The complete fileName
 * @type {String}
 */
var _fileName = '';
	
/**
 * Wrapper for tsc compiler null output
 * @type {Object}
 */
var nulloutput = {
    Write: function(value) {},
    WriteLine: function(value) {},
    Close: function(){}
};

/**
 * Creates a CompilationSettings object for output
 * 
 * @param  {Object} options a hash of options consisting of
 *   - comments 	: {Boolean} emit comments along with compiled code
 *   - concat  		: {Boolean} compile all source files into a single .js file
 *   - moduleType	: {String} a module type; options are 'AMD' and 'commonjs'
 *   - sourcemap 	: {Boolean} output sourcemaps along with compiled files
 *   - target 		: {String} JavaScript version; options are 'ES3' and 'ES5'.  Default is 'ES3'
 *   
 */
function _configureSettings( options ) {
	options = options || {};

	( options.moduleType === 'AMD' ) ? 
		moduleType = TypeScript.ModuleGenTarget.Asynchronous :
		moduleType = TypeScript.ModuleGenTarget.Synchronous;

	TypeScript.moduleGenTarget = moduleType;

	_settings = new TypeScript.CompilationSettings();
    _settings.codeGenTarget = TypeScript.CodeGenTarget.ES5;
    _settings.moduleGenTarget = TypeScript.ModuleGenTarget.ASynchronous;
    _settings.resolve = false;
}


//--------------------------------------
//+ PUBLIC INTERFACE
//--------------------------------------

/**
 * Compiles .ts files and returns .js source.  
 * Extracted from https://github.com/joshheyse/typescript-brunch/blob/master/src/index.coffee
 * @param  {String} path the path to the file
 * 
 */
exports.compile = function( data, path, callback, moduleType ) {
	var compiler, env, error, js, output, resolver, units, _this = this;

	_configureSettings();

	( moduleType === 'AMD' ) ? 
		moduleType = TypeScript.ModuleGenTarget.Asynchronous :
		moduleType = TypeScript.ModuleGenTarget.Synchronous;

	TypeScript.moduleGenTarget = moduleType;

    try {
      	js = "";
        output = {
          	Write: function(value) {
            	return js += value;
          	},
          	WriteLine: function(value) {
            	return js += value + "\n";
          	},
          	Close: function() {}
        };

		compiler = new TypeScript.TypeScriptCompiler(null, null, new TypeScript.NullLogger(), _settings);
		compiler.parser.errorRecovery = true;
		env = new TypeScript.CompilationEnvironment(_settings, io);
		resolver = new TypeScript.CodeResolver(env);
		units = [{
			fileName: sysPath.join(__dirname, "..", "..", "node_modules", "typescript", "bin", "lib.d.ts")
		}];
      	path = TypeScript.switchToForwardSlashes(path);

      	resolver.resolveCode(path, "", false, {
	        postResolution: function(file, code) {
	          	var depPath;
	          	depPath = TypeScript.switchToForwardSlashes(code.path);
	          	if (!(units.some(function(u) {
	            	return u.fileName === depPath;
	          	}))) {
	            	return units.push({
	              		fileName: depPath,
	              		code: code.content
	            	});
	          	}
	        },
	        postResolutionError: function(file, message) {
	          	throw new Error("TypeScript Error: " + message + "\n File: " + file);
	        }
      	});

		compiler.setErrorCallback(function(start, len, message, block) {
			var code, error, line, underline;
			code = units[block].code;
			line = [code.substr(0, start).split("\n").slice(-1)[0].replace(/^\s+/, ""), code.substr(start, len), code.substr(start + len).split("\n").slice(0, 1)[0].replace(/\s+$/, "")];
			underline = [line[0].replace(/./g, "-"), line[1].replace(/./g, "^"), line[2].replace(/./g, "-")];
			error = new Error("TypeScript Error: " + message);
			error.stack = ["TypeScript Error: " + message, "File: " + units[block].fileName, "Start: " + start + ", Length: " + len, "", "Line: " + line.join(""), "------" + underline.join("")].join("\n");
			
			throw error;
		});

		units.forEach(function(u) {
			if (!u.code) {
		  		u.code = fs.readFileSync(u.fileName, "utf8");
			}

			return compiler.addUnit(u.code, u.fileName, false);
		});

		if (!(units.some(function(u) {
			return u.fileName === path;
		}))) {
			compiler.addUnit(data, path, false);
		}
      	
      	compiler.typeCheck();
      	
      	return compiler.emit(true, function(fileName) {
        	if (fileName === path.replace(/\.ts$/, ".js")) {
        		_fileName = fileName;
          		return output;
        	} else {
          		return nulloutput;
        	}
      	});

    } catch (err) {
      	return error = err.stack;
    } finally {
      	callback(error, js, _fileName);
    }
}