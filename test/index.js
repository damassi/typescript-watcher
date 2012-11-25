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
		var settings = tscSettings.returnBasicCompilerOptions({
			comments: true,
			moduleType: 'AMD',
			sourcemap: false,
			target: 'ES5'
		});
		
		settings.should.have.property('comments', true);
		settings.should.have.property('moduleType', 'AMD');
		settings.should.have.property('sourcemap', false);
		settings.should.have.property('target', 'ES5');
	});

	it('should return compilationSettings object', function(){
		var settingsMap = tscSettings.parse();
		settingsMap.should.be.a('object').and.have.property('compilationSettings')
	});

	it('should return non-null compilationSettings', function(){
		var settingsMap = tscSettings.parse();
		var ops = settingsMap.compilerOptions;
		for( var prop in ops ) {
			ops[prop].defaults.should.not.equal('undefined');
		}
	});
});