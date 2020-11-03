'use strict';

const parser = require('../src');


describe('RSQL parser', function () {

	const parse = parser.parse;

	it('should parse single quoted values', function() {
		const result = parse('name=="Kill Bill";year=gt=2003');
		result.should.eql({
			type: parser.NODE_TYPE.COMBINATION,
			operator: parser.OPERATOR.AND,
			lhs: {
				type: parser.NODE_TYPE.CONSTRAINT,
				selector: 'name',
				comparison: '==',
				argument: 'Kill Bill'
			},
			rhs: {
				type: parser.NODE_TYPE.CONSTRAINT,
				selector: 'year',
				comparison: '=gt=',
				argument: '2003'
			}
		})
	});

	it('should not parse and or equal in quoted values', function() {
		const result = parse('name=="Kill;nam \'\'e=gt=Bill";year=gt=2003');
		result.should.eql({
			type: parser.NODE_TYPE.COMBINATION,
			operator: parser.OPERATOR.AND,
			lhs: {
				type: parser.NODE_TYPE.CONSTRAINT,
				selector: 'name',
				comparison: '==',
				argument: 'Kill;nam \'\'e=gt=Bill'
			},
			rhs: {
				type: parser.NODE_TYPE.CONSTRAINT,
				selector: 'year',
				comparison: '=gt=',
				argument: '2003'
			}
		});
	});

	it('should proper parse match quoted values (ignoring rsql fields)', function() {
		const result = parse('name==\'Kill;"name"=gt=Bill\';year=gt=2003');
		result.should.eql({
			type: parser.NODE_TYPE.COMBINATION,
			operator: parser.OPERATOR.AND,
			lhs: {
				type: parser.NODE_TYPE.CONSTRAINT,
				selector: 'name',
				comparison: '==',
				argument: 'Kill;"name"=gt=Bill'
			},
			rhs: {
				type: parser.NODE_TYPE.CONSTRAINT,
				selector: 'year',
				comparison: '=gt=',
				argument: '2003'
			}
		});
	});

	it('should proper parse in with quoted values', function() {
		const result = parse('name=in=(\'sci-fi\',\'action\');year=gt=2003');
		result.should.eql({
			type: parser.NODE_TYPE.COMBINATION,
			operator: parser.OPERATOR.AND,
			lhs: {
				type: parser.NODE_TYPE.CONSTRAINT,
				selector: 'name',
				comparison: '=in=',
				argument: ['sci-fi', 'action']
			},
			rhs: {
				type: parser.NODE_TYPE.CONSTRAINT,
				selector: 'year',
				comparison: '=gt=',
				argument: '2003'
			}
		});
	});
});
