var assert = require("assert");
var semicolonize = require("../lib/semicolonize.js");

describe('Basic', function(){
	it('Should return well semicolonized code as is', function(){
		assert.equal(
			semicolonize('a = 42;'),
			'a = 42;'
		);
	});
	it('Should insert semicolons', function(){
		assert.equal(
			semicolonize('var foo = 42'),
			'var foo = 42;'
		);
	});
	it('Should remove semicolons', function(){
		assert.equal(
			semicolonize('function foo(){};'),
			'function foo(){}'
		);
	});
	it('Should both remove and insert semicolons', function(){
		assert.equal(
			semicolonize('for(i=3; i--; ){console.log(i)};'),
			'for(i=3; i--; ){console.log(i);}'
		);
	});
	it('Should throw on invalid js code', function(){
		assert.throws(function(){
			semicolonize('I am not a JS code');
		});
	});
});