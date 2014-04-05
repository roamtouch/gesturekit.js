'use strict';

/**
 * @author Guille Paz <guille87paz@gmail.com>
 */

// Module dependencies
var inherit = require('./helpers').inherit,
    Emitter = require('./Emitter'),
    touch = require('./touchEvents'),
    Recognizer = require('./Recognizer'),
    Analytics = require('./Analytics'),
    requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    }()),
    defaults = {
        'sensor': window.document.documentElement,
        'enabled': true,
        'threshold': 0 // ms
    },
    motion = false,
    eve;

function customizeOptions(options) {
    var prop;
    for (prop in defaults) {
        if (!options.hasOwnProperty(prop)) {
            options[prop] = defaults[prop];
        }
    }
    return options;
}

/**
 * Creates a new instance of GestureKit.
 * @constructor
 * @augments Emitter
 * @returns {gesturekit} Returns a new instance of GestureKit.
 */
function GestureKit() {
    return this;
}

// Inherits from Emitter
inherit(GestureKit, Emitter);

/**
 * Initialize a new instance of GestureKit with a given options.
 * @memberof! GestureKit.prototype
 * @function
 * @param {(Object | String)} [options] A given options to customize an instance or a string indicating a GestureKit GID.
 * @param {String} [options.gid] A given string indicating a GestureKit GID.
 * @param {HTMLElement} [options.sensor] An HTMLElement to use as recognizer sensor. Default: document.documentElement.
 * @param {Boolean} [options.enabled] Enable or disable the gesture recognition. Default: false.
 * @param {Number} [options.threshold] A given number of milliseconds to set a threshold to recognize a gesture. Default: 0.
 * @returns {gesturekit} Returns a new instance of GestureKit.
 */
GestureKit.prototype.init = function init(options) {

    if (this.recognizer === undefined) {

        this._options = customizeOptions(options || {});

        this._threshold = this._options.threshold;

        this.sensor = this._options.sensor;

        // User interaction
        this._setPointerEvents();

        this._enabled = this._options.enabled;

        new Analytics();
    }

    return this;
};

/**
 * Sets touch events.
 * @memberof! GestureKit.prototype
 * @function
 * @private
 * @returns {gesturekit}
 */
GestureKit.prototype._setPointerEvents = function () {
    var that = this;

    /**
     * A Recognizer instance.
     * @type {Object}
     */
    this.recognizer = new Recognizer(this._options.gid);

    this._update = function () {
        clearTimeout(that._wait);
        that.recognizer.setPoints(eve.touches);
        that.emit('gesturemotion', eve);

        // Change move status
        motion = false;
    };

    this._captureMotion = function (e) {

        that.emit('pointermove', e);

        // No changing, exit
        if (!motion && that._enabled) {
            e.preventDefault();
            eve = e;
            motion = true;
            requestAnimFrame(that._update);
        }
    };

    this.sensor.addEventListener(touch.start, function (eve) {
        that.emit('pointerstart', eve);

        if (!that._enabled) { return; }

        that.recognizer.setPoints(eve.touches);
        that.emit('gesturestart', eve);
    }, false);

    this.sensor.addEventListener(touch.move, that._captureMotion, false);

    this.sensor.addEventListener(touch.end, function (eve) {
        that.emit('pointerend', eve);

        if (!motion && !that._enabled) { return; }

        motion = false;
        that._wait = setTimeout(function () {
            that.recognizer.recognizeGesture();
            that.emit('gestureend', eve);
        }, that._threshold);

    }, false);

    return this;
};

/**
 * Enables an instance of GestureKit.
 * @memberof! GestureKit.prototype
 * @function
 * @returns {gesturekit}
 * @example
 * // Enabling an instance of GestureKit.
 * gesturekit.enable();
 */
GestureKit.prototype.enable = function () {
    this._enabled = true;

    /**
     * Emits when a GestureKit is enabled.
     * @event GestureKit#enable
     * @example
     * // Subscribe to "enable" event.
     * gesturekit.on('enable', function () {
     *     // Some code here!
     * });
     */
    this.emit('enable');

    return this;
};

/**
 * Disables an instance of GestureKit.
 * @memberof! GestureKit.prototype
 * @function
 * @returns {gesturekit}
 * @example
 * // Disabling an instance of GestureKit.
 * gesturekit.disable();
 */
GestureKit.prototype.disable = function () {
    this._enabled = false;

    /**
     * Emits when GestureKit is disable.
     * @event GestureKit#disable
     * @example
     * // Subscribe to "disable" event.
     * gesturekit.on('disable', function () {
     *     // Some code here!
     * });
     */
    this.emit('disable');

    return this;
};

// Expose GestureKit
module.exports = GestureKit;