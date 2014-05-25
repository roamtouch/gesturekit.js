'use strict';

/**
 * @author Guille Paz <guille87paz@gmail.com>
 */

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
gesturekit.version = '1.1.2';

// Expose gesturekit
module.exports = gesturekit;