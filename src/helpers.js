'use strict';

/**
 * @author Guille Paz <guille87paz@gmail.com>
 */

/**
 * Extends a given object with properties from another object.
 * @param {Object} destination A given object to extend its properties.
 * @param {Object} from A given object to share its properties.
 * @returns {Object}
 * @example
 * var foo = {
 *     'baz': 'qux'
 * };

 * var bar = {
 *     'quux': 'corge'
 * };
 *
 * extend(foo, bar);
 *
 * console.log(foo.quux) // returns 'corge'
 */
exports.extend = function extend(destination, from) {

    var prop;

    for (prop in from) {
        if (from[prop]) {
            destination[prop] = from[prop];
        }
    }

    return destination;
};

/**
 * Inherits prototype properties from `uber` into `child` constructor.
 * @param {Function} child A given constructor function who inherits.
 * @param {Function} uber A given constructor function to inherit.
 * @returns {Object}
 * @example
 * inherit(child, uber);
 */
exports.inherit = function inherit(child, uber) {
    var obj = child.prototype || {};
    child.prototype = exports.extend(obj, uber.prototype);

    return uber.prototype;
};