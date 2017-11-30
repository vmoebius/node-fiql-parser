
{
	const {NODE_TYPE, OPERATOR} = require('./constants');
}

start
	= disjunction

disjunction
	= lhs:conjunction "," rhs:disjunction  {return {type: NODE_TYPE.COMBINATION, operator: OPERATOR.OR, lhs, rhs};}
	/ conjunction

conjunction
	= lhs:constraint ";" rhs:conjunction  {return {type: NODE_TYPE.COMBINATION, operator: OPERATOR.AND, lhs, rhs};}
	/ constraint

constraint
	= s:selector c:$comparison a:argument  {return {type: NODE_TYPE.CONSTRAINT, selector: s, comparison: c, argument: a};}
	/ s:selector  {return {type: NODE_TYPE.CONSTRAINT, selector: s};}
	/ "(" d:disjunction ")"  {return d;}

selector
	= $unreserved+

comparison
	= ( "=" alpha* / "!" ) "="

argument
	= "(" head:value tail:( "," value )* ")"  {return [head].concat((tail || []).map(item => item[1]));}
	/ value

value
	= c:( unreserved / pct_encoded )+  {return c.join('');}

unreserved
	= alpha
	/ digit
	/ [-._~]

pct_encoded
	= "%" d0:hex_digit d1:hex_digit  {return String.fromCharCode(parseInt(d0 + d1, 16));}

alpha
	= [a-z]i

digit
	= [0-9]

hex_digit
	= [0-9a-f]i
