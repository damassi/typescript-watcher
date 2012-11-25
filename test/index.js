/**
 * Testrunner for Typescript-Watch
 * 
 * @author Christopher Pappas | github.com/damassi
 * @since 11.24.12
 */

var assert = require('assert');
var should = require('should');
var tscSettings = require('../src/core/tsc-settings');

describe( 'TypeScript-Watcher', function(){
	
});

describe( 'Compilation Settings', function(){
	it('should return default compiler options', function(){
		var settings = tscSettings.returnBasicCompilerOptions();
		settings.should.have.property('comments');
		settings.should.have.property('moduleType');
		settings.should.have.property('sourcemap');
		settings.should.have.property('target');
	});

	it('should update default compiler options', function(){
		var tscOptions = {
			watch: false,
			rootPath: "path/to/root",
			outputPath: "path/to/output",
			compilerOptions: tscSettings.returnBasicCompilerOptions()
		}
	});
});