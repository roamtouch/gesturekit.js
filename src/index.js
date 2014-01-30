'use strict';

/**
 * @author Guille Paz <guille87paz@gmail.com>
 */

// browserify -s gesturekit src/index.js > ./dist/gesturekit.js

// Module dependencies
var Gesturekit = require('./Gesturekit'),
    gesturekit;

/**
 * An object which contains all public members and a GestureKit instance.
 * @namespace
 */
gesturekit = new Gesturekit();

/**
 * gesturekit version.
 */
gesturekit.version = '0.0.1';

// Expose gesturekit
module.exports = gesturekit;