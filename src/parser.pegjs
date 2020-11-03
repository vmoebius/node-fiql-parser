
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
	= "(" head:value tail:("," value )* ")"  {return [head].concat((tail || []).map(item => item[1]));}
	/ value

value
	= c:( unreserved / pct_encoded )+  {return c.join('');}

unreserved
	= alpha
	/ digit
	/ [-._~:]
	/ quoted_string

pct_encoded
	= "%" d0:hex_digit d1:hex_digit  {return String.fromCharCode(parseInt(d0 + d1, 16));}

alpha
	= [a-z]i

digit
	= [0-9]

hex_digit
	= [0-9a-f]i

// RSQL "quoted" values extension
// inspired by https://github.com/pegjs/pegjs/blob/master/examples/javascript.pegjs#L271

quoted_string "string"
	= '"' chars:double_string_character* '"' {
			return chars.join("");
		}
	/ "'" chars:single_string_character* "'" {
			return chars.join("");
		}

double_string_character
	= !('"' / "\\") source_character { return text(); }
	/ "\\" sequence:escape_sequence { return sequence; }

single_string_character
	= !("'" / "\\") source_character { return text(); }
	/ "\\" sequence:escape_sequence { return sequence; }

escape_sequence
	= character_escape_sequence
	/ hex_escape_sequence
	/ unicode_escape_sequence

character_escape_sequence
	= single_escape_character
	/ non_escape_character

non_escape_character
	= !(escape_character) source_character { return text(); }

escape_character
	= single_escape_character
	/ digit
	/ "x"
	/ "u"

source_character
	= .

single_escape_character
	= "'"
	/ '"'
	/ "\\"
	/ "b"  { return "\b"; }
	/ "f"  { return "\f"; }
	/ "n"  { return "\n"; }
	/ "r"  { return "\r"; }
	/ "t"  { return "\t"; }
	/ "v"  { return "\v"; }

hex_escape_sequence
	= "x" digits:$(hex_digit hex_digit) {
			return String.fromCharCode(parseInt(digits, 16));
		}

unicode_escape_sequence
	= "u" digits:$(hex_digit hex_digit hex_digit hex_digit) {
			return String.fromCharCode(parseInt(digits, 16));
		}