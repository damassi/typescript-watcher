/**
 * Testrunner for Typescript-Watch
 * 
 * @author Christopher Pappas | github.com/damassi
 * @since 11.24.12
 */

var assert = require('assert');

describe( 'TypeScript-Watcher', function(){

	it('should say hello!', function(done) {
		var h = 'hello';

		assert.equal('hello', h);
		done();
	})
})