'use strict';

/**
 * @typedef {object} TreeNode
 * @property {string} type
 */

/**
 * @typedef {TreeNode} Combination
 * @property {string} operator
 * @property {*} lhs
 * @property {*} rhs
 */

/**
 * @typedef {TreeNode} Constraint
 * @property {string} selector
 * @property {string} comparison
 * @property {*} argument
 */

const parser = require('./parser');
const constants = require('./constants');

module.exports = Object.assign({}, parser, constants);
