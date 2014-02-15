'use strict';

/**
 * @author Guille Paz <guille87paz@gmail.com>
 */

/**
 * Event Emitter Class for the browser.
 * @constructor
 * @returns {Object} Returns a new instance of Emitter.
 */
function Emitter() {
    return this;
}

/**
 * Adds a listener to the collection for a specified event.
 * @memberof! Emitter.prototype
 * @function
 * @param {String} event The event name to subscribe.
 * @param {Function} listener Listener function.
 * @param {Boolean} once Indicate if a listener function will be called only one time.
 * @example
 * // Will add an event listener to 'ready' event.
 * emitter.on('ready', listener);
 */
Emitter.prototype.on = function (event, listener, once) {

    this._eventsCollection = this._eventsCollection || {};

    listener.once = once || false;

    if (this._eventsCollection[event] === undefined) {
        this._eventsCollection[event] = [];
    }

    this._eventsCollection[event].push(listener);

    return this;
};

/**
 * Adds a listener to the collection for a specified event to will execute only once.
 * @memberof! Emitter.prototype
 * @function
 * @param {String} event Event name.
 * @param {Function} listener Listener function.
 * @returns {Object}
 * @example
 * // Will add an event handler to 'contentLoad' event once.
 * emitter.once('contentLoad', listener);
 */
Emitter.prototype.once = function (event, listener) {

    this.on(event, listener, true);

    return this;
};

/**
 * Removes a listener from the collection for a specified event.
 * @memberof! Emitter.prototype
 * @function
 * @param {String} event Event name.
 * @param {Function} listener Listener function.
 * @returns {Object}
 * @example
 * // Will remove event listener to 'ready' event.
 * emitter.off('ready', listener);
 */
Emitter.prototype.off = function (event, listener) {

    if (this._eventsCollection === undefined) {
        return this;
    }

    var listeners = this._eventsCollection[event];

    if (listeners !== undefined) {
        listeners.forEach(function (e, i) {
            if (e === listener) {
                listeners.splice(i, 1);
                return;
            }
        });
    }

    return this;
};

/**
 * Returns all listeners from the collection for a specified event.
 * @memberof! Emitter.prototype
 * @function
 * @param {String} event The event name.
 * @returns {Array}
 * @example
 * // Returns listeners from 'ready' event.
 * emitter.getListeners('ready');
 */
Emitter.prototype.getListeners = function (event) {

    return this._eventsCollection[event];
};

/**
 * Execute each item in the listener collection in order with the specified data.
 * @memberof! Emitter.prototype
 * @function
 * @param {String} event The name of the event you want to emit.
 * @param {...Object} var_args Data to pass to the listeners.
 * @example
 * // Will emit the 'ready' event with 'param1' and 'param2' as arguments.
 * emitter.emit('ready', 'param1', 'param2');
 */
Emitter.prototype.emit = function () {

    var args = Array.prototype.slice.call(arguments, 0), // converted to array
        event = args.shift(), // Store and remove events from args
        that = this,
        listeners

    if (typeof event === 'string') {
        event = {'type': event};
    }

    if (!event.target) {
        event.target = this;
    }

    if (this._eventsCollection !== undefined && this._eventsCollection[event.type] !== undefined) {
        listeners = this._eventsCollection[event.type];

        listeners.forEach(function (e, i) {
            e.apply(that, args);

            if (e.once) {
                that.off(event.type, e);
            }
        });
    }

    return this;
};

// Expose Emitter
module.exports = Emitter;