'use strict';

/**
 * @author Guille Paz <guille87paz@gmail.com>
 */

// Module dependencies
var inherit = require('./helpers').inherit,
    Emitter = require('./Emitter'),
    Recognizer = require('./Recognizer'),
    requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    }()),
    docEl = window.document.documentElement,
    defaults = {
        'sensor': docEl,
        'enabled': true,
        'threshold': 0 //ms
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
 *
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
 * @param {(Object | String)} [options] A given options to customize an instance or a string indicating a GestureKit UID.
 * @param {String} [options.uid] A given options to customize an instance or an string indicating GestureKit UID.
 * @param {HTMLElement} [options.sensor] An HTMLElement to use as recognizer sensor. Default: document.documentElement.
 * @param {Boolean} [options.enabled] Enable or disable the gesture recognition. Default: false.
 * @param {Boolean} [options.visor] Enable or disable Visor. Default: false.
 * @param {Boolean} [options.leapmotion] Configures Leapmotion support. Default: false. ?
 * @returns {gesturekit} Returns a new instance of GestureKit.
 */
GestureKit.prototype.init = function init(options) {
    var that = this;

    if (this.recognizer === undefined) {

        this.options = customizeOptions(options || {});

        this._threshold = this.options.threshold;

        this.sensor = this.options.sensor;

        // User interaction
        this._setTouchEvents();

        this._enabled = this.options.enabled;
    }

    return this;
};

GestureKit.prototype._setTouchEvents = function() {
    var that = this,
        wait;

    /**
     * A Recognizer instance.
     * @type {Object}
     */
    this.recognizer = new Recognizer(this.options.uid);

    this.update = function () {
        clearTimeout(that._wait);
        that.recognizer.setPoints(eve.touches);
        that.emit('gesturemotion', eve);

        // Change move status
        motion = false;
    };

    this.captureMotion = function (e) {

        that.emit('touchmove', e);

        // No changing, exit
        if (!motion && that._enabled) {
            e.preventDefault();
            eve = e;
            motion = true;
            requestAnimFrame(that.update);
        }
    };

    this.sensor.addEventListener('touchstart', function (eve) {
        that.emit('touchstart', eve);

        if (!that._enabled) { return; }

        that.recognizer.setPoints(eve.touches);
        that.emit('gesturestart', eve);
    }, false);

    this.sensor.addEventListener('touchmove', that.captureMotion, false);

    this.sensor.addEventListener('touchend', function (eve) {
        that.emit('touchend', eve);

        if (!motion && !that._enabled) { return; }

        motion = false;
        that.wait = setTimeout(function () {
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