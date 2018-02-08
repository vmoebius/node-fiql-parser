#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

> Library to parse FIQL query strings

## Description

Basic [node.js] library module to parse FIQL query expressions.

Implements only the basic [FIQL] standard draft without RSQL extensions like quoting of values.

## References

* https://tools.ietf.org/html/draft-nottingham-atompub-fiql-00
* https://gist.github.com/fdlk/63bac558fd02ada151730dc3375bb243

## Install

	npm install fiql-parser@alpha --save
	
## Usage

	const parser = require(fiql-parser);
	parser.parse(query);

## License

MIT © [Volker Möbius]()

[npm-url]: https://npmjs.org/package/node-fiql-parser
[npm-image]: https://badge.fury.io/js/node-fiql-parser.svg
[travis-url]: https://travis-ci.org/vmoebius/node-fiql-parser
[travis-image]: https://travis-ci.org/vmoebius/node-fiql-parser.svg?branch=master
[daviddm-url]: https://david-dm.org/vmoebius/node-fiql-parser.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/vmoebius/node-fiql-parser
[node.js]: https://nodejs.org
[FIQL]: https://tools.ietf.org/html/draft-nottingham-atompub-fiql-00
