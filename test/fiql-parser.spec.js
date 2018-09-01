'use strict';

const parser = require('../src');


describe('FIQL parser', function () {

	const parse = parser.parse;

	it('should throw if parsing empty string', function () {
		(function () {parse('')}).should.throw(Error);
	});

	it('should parse simple comparison constraint', function () {
		const result = parse('a=eq=b');
		result.should.eql({type: parser.NODE_TYPE.CONSTRAINT, selector: 'a', comparison: '=eq=', argument: 'b'});
	});

	it('should allow for custom comparison constraints', function () {
		const result = parse('a=custom=b');
		result.should.eql({type: parser.NODE_TYPE.CONSTRAINT, selector: 'a', comparison: '=custom=', argument: 'b'});
	});

	it('should allow standard equal-operator', function () {
		const result = parse('a==b');
		result.should.eql({type: parser.NODE_TYPE.CONSTRAINT, selector: 'a', comparison: '==', argument: 'b'});
	});

	it('should allow standard equal-operator on iso8601 dates', function () {
		const result = parse('a==2018-09-01T12:14:28Z');
		result.should.eql({type: parser.NODE_TYPE.CONSTRAINT, selector: 'a', comparison: '==', argument: '2018-09-01T12:14:28Z'});
	});


	it('should allow standard not-equal-operator', function () {
		const result = parse('a!=b');
		result.should.eql({type: parser.NODE_TYPE.CONSTRAINT, selector: 'a', comparison: '!=', argument: 'b'});
	});

	it('should allow abbreviated boolean constraint', function () {
		const result = parse('a');
		result.should.eql({type: parser.NODE_TYPE.CONSTRAINT, selector: 'a'});
	});

	it('should allow for percent encoded values', function () {
		const result = parse('a=op=%20');
		result.should.eql({type: parser.NODE_TYPE.CONSTRAINT, selector: 'a', comparison: '=op=', argument: ' '});
	});

	it('should allow for list values', function () {
		const result = parse('field=op=(item0,item1,item2)');
		result.should.eql({type: parser.NODE_TYPE.CONSTRAINT, selector: 'field', comparison: '=op=', argument: ['item0', 'item1', 'item2']});
	});

	it('should parse AND-combination', function () {
		const result = parse('a=eq=b;c=ne=d');
		result.should.eql({
			type: parser.NODE_TYPE.COMBINATION,
			operator: parser.OPERATOR.AND,
			lhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'a', comparison: '=eq=', argument: 'b'},
			rhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'c', comparison: '=ne=', argument: 'd'}
		});
	});

	it('should parse chained AND-combinations', function () {
		const result = parse('a=eq=b;c=ne=d;e=gt=f');
		result.should.eql({
			type: parser.NODE_TYPE.COMBINATION,
			operator: parser.OPERATOR.AND,
			lhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'a', comparison: '=eq=', argument: 'b'},
			rhs: {
				type: parser.NODE_TYPE.COMBINATION,
				operator: parser.OPERATOR.AND,
				lhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'c', comparison: '=ne=', argument: 'd'},
				rhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'e', comparison: '=gt=', argument: 'f'}
			}
		});
	});

	it('should parse OR-combination', function () {
		const result = parse('a=eq=b,c=ne=d', {semantics: {constraint(selector, comparison, argument) { return {selector, comparison, argument}}}});
		result.should.eql({
			type: parser.NODE_TYPE.COMBINATION,
			operator: parser.OPERATOR.OR,
			lhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'a', comparison: '=eq=', argument: 'b'},
			rhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'c', comparison: '=ne=', argument: 'd'}
		});
	});

	it('should parse chained OR-combinations', function () {
		const result = parse('a=eq=b,c=ne=d,e=gt=f');
		result.should.eql({
			type: parser.NODE_TYPE.COMBINATION,
			operator: parser.OPERATOR.OR,
			lhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'a', comparison: '=eq=', argument: 'b'},
			rhs: {
				type: parser.NODE_TYPE.COMBINATION,
				operator: parser.OPERATOR.OR,
				lhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'c', comparison: '=ne=', argument: 'd'},
				rhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'e', comparison: '=gt=', argument: 'f'}
			}
		});
	});

	it('should consider AND preceding OR from right', function () {
		const result = parse('a=eq=b;c=ne=d,e=gt=f');
		result.should.eql({
			type: parser.NODE_TYPE.COMBINATION,
			operator: parser.OPERATOR.OR,
			lhs: {
				type: parser.NODE_TYPE.COMBINATION,
				operator: parser.OPERATOR.AND,
				lhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'a', comparison: '=eq=', argument: 'b'},
				rhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'c', comparison: '=ne=', argument: 'd'}
			},
			rhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'e', comparison: '=gt=', argument: 'f'}
		});
	});

	it('should consider AND preceding OR from left', function () {
		const result = parse('c=ne=d,e=gt=f;a=eq=b');
		result.should.eql({
			type: parser.NODE_TYPE.COMBINATION,
			operator: parser.OPERATOR.OR,
			lhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'c', comparison: '=ne=', argument: 'd'},
			rhs: {
				type: parser.NODE_TYPE.COMBINATION,
				operator: parser.OPERATOR.AND,
				lhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'e', comparison: '=gt=', argument: 'f'},
				rhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'a', comparison: '=eq=', argument: 'b'}
			}
		});
	});

	it('should allow grouping', function () {
		const result = parse('a=eq=b;(c=ne=d,e=gt=f)');
		result.should.eql({
			type: parser.NODE_TYPE.COMBINATION,
			operator: parser.OPERATOR.AND,
			lhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'a', comparison: '=eq=', argument: 'b'},
			rhs: {
				type: parser.NODE_TYPE.COMBINATION,
				operator: parser.OPERATOR.OR,
				lhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'c', comparison: '=ne=', argument: 'd'},
				rhs: {type: parser.NODE_TYPE.CONSTRAINT, selector: 'e', comparison: '=gt=', argument: 'f'}
			}
		});
	});
});