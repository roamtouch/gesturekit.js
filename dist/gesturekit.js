/*!
 * GestureKit v0.0.1
 * http://gesturekit.com/
 *
 * Copyright (c) 2014, RoamTouch
 * Released under the Apache v2 License.
 * http://gesturekit.com/
 */
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.gesturekit=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

    var listeners = this._eventsCollection[event],
        i = 0,
        len;

    if (listeners !== undefined) {
        len = listeners.length;
        for (i; i < len; i += 1) {
            if (listeners[i] === listener) {
                listeners.splice(i, 1);
                break;
            }
        }
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
        listeners,
        i = 0,
        len;

    if (typeof event === 'string') {
        event = {'type': event};
    }

    if (!event.target) {
        event.target = this;
    }

    if (this._eventsCollection !== undefined && this._eventsCollection[event.type] !== undefined) {
        listeners = this._eventsCollection[event.type];
        len = listeners.length;

        for (i; i < len; i += 1) {
            listeners[i].apply(this, args);

            if (listeners[i].once) {
                this.off(event.type, listeners[i]);
                len -= 1;
                i -= 1;
            }
        }
    }

    return this;
};

// Expose Emitter
module.exports = Emitter;
},{}],2:[function(_dereq_,module,exports){
'use strict';

/**
 * @author Guille Paz <guille87paz@gmail.com>
 */

// Module dependencies
var inherit = _dereq_('./helpers').inherit,
    Emitter = _dereq_('./Emitter'),
    Recognizer = _dereq_('./Recognizer'),
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
        'enabled': false,
        'visor': false,
        'threshold': 280 //ms
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
        that.emit('gesturemotion', eve.touches);

        // Change move status
        motion = false;
    };

    this.captureMotion = function (e) {
        // No changing, exit
        if (!motion && that._enabled) {
            e.preventDefault();
            eve = e;
            motion = true;
            requestAnimFrame(that.update);
        }
    };

    this.sensor.addEventListener('touchstart', function (eve) {
        if (!that._enabled) { return; }

        that.recognizer.setPoints(eve.touches);
        that.emit('gesturestart', eve);
    }, false);

    this.sensor.addEventListener('touchmove', that.captureMotion, false);

    this.sensor.addEventListener('touchend', function (eve) {
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
 * @memberof! ch.GestureKit.prototype
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
     * @event ch.GestureKit#enable
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
 * @memberof! ch.GestureKit.prototype
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
     * @event ch.GestureKit#disable
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
},{"./Emitter":1,"./Recognizer":3,"./helpers":4}],3:[function(_dereq_,module,exports){
'use strict';

/**
 * @author Guille Paz <guille87paz@gmail.com>
 */

// Module dependencies
var Pdollar = _dereq_('./pdollar').Pdollar,
    Point = _dereq_('./pdollar').Point,
    url = 'http://api.gesturekit.com/v1.0/index.php/sdk/getgestures/';

/**
 * Creates a new instance of Recognizer.
 * @constructor
 * @param {(Object | String)} [options] A given options to customize an instance or an string indicating UID.
 * @param {String} [uid] XXXXXX
 * @returns {recognizer} Returns a new instance of Recognizer.
 */
function Recognizer(uid) {
    this.uid = uid;

    this.init();

    return this;
}

/**
 * Initialize a new instance of Recognizer with given options.
 * @memberof! Recognizer.prototype
 * @function
 * @param {(Object | String)} options Configuration options or an string indicating UID.
 * @returns {recognizer} Returns a new instance of Recognizer.
 */
Recognizer.prototype.init = function() {
    var that = this;

    // Creates points collection
    this.pointsCollection = [];

    // Creates a Pdollar instance.
    this.pdollar = new Pdollar();

    this.metadata = {};

    // Load gestures.
    this.loadGestures();

    return this;
};

/**
 * Loads a set of gestures.
 * @memberof! Recognizer.prototype
 * @function
 * @returns {recognizer} Returns a new instance of Recognizer.
 */
Recognizer.prototype.loadGestures = function () {
    var that = this,
        xhr = new XMLHttpRequest(),
        response;

    xhr.open('GET', url + this.uid);

    // Add events
    xhr.onreadystatechange = function () {
        if (xhr.readyState === xhr.DONE) {
            status = xhr.status;

            if ((status >= 200 && status < 300) || status === 304 || status === 0) {
                response = JSON.parse(xhr.response || xhr.responseText);
                that.addGestures(response.gestureset.gestures);
                gesturekit.emit('loadgestures', response);

            } else {
                gesturekit.emit('failgestures');
            }
         }
    };

    xhr.send();

    return this;
};

/**
 * Adds gestures into Pdollar instance.
 * @memberof! Recognizer.prototype
 * @function
 * @returns {recognizer} Returns a new instance of Recognizer.
 */
Recognizer.prototype.addGestures = function (data) {

    var i = 0,
        j,
        name,
        meta,
        gesture,
        pointArray,
        len = data.length;

    for (i; i < len; i += 1) {
        name = data[i].method;
        meta = data[i].metadata;

        if (meta !== '' && meta !== null && this.metadata[name] === undefined ) {
            this.metadata[name] = meta;
        }

        pointArray = [];
        gesture = data[i].gesture;

        for (j = 0; j < gesture.length; j += 1) {
            pointArray.push(new Point(parseFloat(gesture[j].X), parseFloat(gesture[j].Y), gesture[j].ID));
        }

        this.pdollar.addGesture(name, pointArray);
    }

    return this;
};

/**
 * Adds touch points into pointsCollection.
 * @memberof! Recognizer.prototype
 * @function
 * @returns {recognizer} Returns a new instance of Recognizer.
 */
Recognizer.prototype.setPoints = function (touches) {

    var i = 0,
        pointers = touches.length,
        ts,
        x,
        y;

    if (pointers > 0) {

        for (i; i < pointers; i += 1) {

            ts = touches[i];
            x = ts.pageX;
            y = ts.pageY;

            this.pointsCollection.push(new Point(x, y, pointers));
        }

    }

    return this;
};

/**
 * Recognizes gestures from current pointsCollection.
 * @memberof! Recognizer.prototype
 * @function
 * @returns {recognizer} Returns a new instance of Recognizer.
 */
Recognizer.prototype.recognizeGesture = function () {

    if (this.pointsCollection.length < 5) {
        return;
    }

    var result = this.pdollar.recognize(this.pointsCollection);

    if (parseFloat(result.score) >= 0.1) {
        gesturekit.emit(result.name, result);
        gesturekit.emit('recognize', result);
    } else {
        gesturekit.emit('notrecognize');
    }

    this.pointsCollection.length = 0;

    console.log("gesture: " + result.name + " score: " + result.score);

    return this;
};

// Expose Recognizer
module.exports = Recognizer;
},{"./pdollar":6}],4:[function(_dereq_,module,exports){
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
},{}],5:[function(_dereq_,module,exports){
'use strict';

/**
 * @author Guille Paz <guille87paz@gmail.com>
 */

// Module dependencies
var Gesturekit = _dereq_('./Gesturekit'),
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
},{"./Gesturekit":2}],6:[function(_dereq_,module,exports){
'use strict';

/**
 * Point class
 * @constructor
 */
function Point(x, y, id) {
    this.X = x;
    this.Y = y;
    this.ID = id; // stroke ID to which this point belongs (1,2,...)
}

/**
 * PointCloud class: a point-cloud template
 * @constructor
 */
function PointCloud(name, points) {
    var i = 0,
        len = points.length;

    this.name = name;
    this.points = [];

    for (i; i < len; i += 1) {
        this.points.push(new Point(points[i].X, points[i].Y, points[i].ID));
    }
}

/**
 * PDollarRecognizer class constants
 * @private
 */
var NumPoints = 32,
    Origin = new Point(0,0,0),
    RECOGNITION_THRESHOLD = 1.5,
    NO_MATCH_NAME = 'No match.',
    NO_MATCH_SCORE = 0.0;

/**
 * PDollarRecognizer class
 * @constructor
 */
function PDollarRecognizer() {
    this.pointClouds = [];

    this.recognize = function (points) {
        points = Resample(points, NumPoints);
        points = Scale(points);
        points = TranslateTo(points, Origin);

        var i = 0,
            len = this.pointClouds.length,
            d,
            result = {
                'name': NO_MATCH_NAME,
                'score': NO_MATCH_SCORE,
            },
            d1,
            d2,
            best,
            b1 = +Infinity,
            u1 = -1,
            b2 = +Infinity,
            u2 = -1;

        // for each point-cloud template
        for (i; i < len; i += 1) {
            d = GreedyCloudMatch(points, this.pointClouds[i]);

            if (d < b1) {
                b2 = b1;
                u2 = u1;

                b1 = d; // best (least) distance
                u1 = i; // point-cloud
            } else if (d < b2) {
                b2 = d;
                u2 = i;
            }
        }

        if (u1 !== -1) {

            d1 = GestureDistance(points, this.pointClouds[u1].points);
            d2 = GestureDistance(points, this.pointClouds[u2].points);
            best = 0.0;

            if (d2 < d1) {
                result.name = this.pointClouds[u2].name;
                best = b2;

            } else {
                result.name = this.pointClouds[u1].name;
                best = b1;
            }

            if (best < RECOGNITION_THRESHOLD) {
                result.score = Math.max((best - 2.0) / -2.0, 0.0)
            }
        }

        return result;
    };

    this.addGesture = function (name, points) {
        this.pointClouds.push(new PointCloud(name, points));
    }
}

/**
 * GreedyCloudMatch
 * @private
 */
function GreedyCloudMatch(points, P) {
    var e = 0.50,
        step = Math.floor(Math.pow(points.length, 1 - e)),
        min = +Infinity,
        i = 0,
        len = points.length,
        d1,
        d2;

    for (i; i < len; i += step) {
        d1 = CloudDistance(points, P.points, i);
        d2 = CloudDistance(P.points, points, i);
        min = Math.min(min, Math.min(d1, d2)); // min3
    }

    return min;
}

/**
 * CloudDistance
 * @private
 */
function CloudDistance(pts1, pts2, start) {
    var k = 0,
        pts1Len = pts1.length, // pts1.length == pts2.length
        matched = [],
        sum = 0,
        i = start,
        index = -1,
        min = +Infinity,
        j = 0,
        matechedLen,
        weight;

    for (k; k < pts1Len; k += 1) {
        matched.push(false);
    }

    matechedLen = matched.length;

    do {

        for (j; j < matechedLen; j += 1) {
            if (!matched[j]) {
                var d = Distance(pts1[i], pts2[j]);
                if (d < min) {
                    min = d;
                    index = j;
                }
            }
        }

        matched[index] = true;

        weight = 1 - ((i - start + pts1.length) % pts1.length) / pts1.length;
        sum += weight * min;
        i = (i + 1) % pts1.length;

    } while (i != start);

    return sum;
}

/**
 * Resample
 * @private
 */
function Resample(points, n) {
    var I = PathLength(points) / (n - 1), // interval length
        D = 0.0,
        newpoints = [points[0]];

    for (var i = 1; i < points.length; i++)
    {
        if (points[i].ID == points[i-1].ID)
        {
            var d = Distance(points[i - 1], points[i]);
            if ((D + d) >= I)
            {
                var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
                var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
                var q = new Point(qx, qy, points[i].ID);
                newpoints[newpoints.length] = q; // append new point 'q'
                points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
                D = 0.0;
            }
            else D += d;
        }
    }
    if (newpoints.length == n - 1) // sometimes we fall a rounding-error short of adding the last point, so add it if so
        newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y, points[points.length - 1].ID);
    return newpoints;
}

/**
 * Scale
 * @private
 */
function Scale(points) {
    var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
    for (var i = 0; i < points.length; i++) {
        minX = Math.min(minX, points[i].X);
        minY = Math.min(minY, points[i].Y);
        maxX = Math.max(maxX, points[i].X);
        maxY = Math.max(maxY, points[i].Y);
    }
    var size = Math.max(maxX - minX, maxY - minY);
    var newpoints = new Array();
    for (var i = 0; i < points.length; i++) {
        var qx = (points[i].X - minX) / size;
        var qy = (points[i].Y - minY) / size;
        newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
    }
    return newpoints;
}

/**
 * Translates points' centroid
 * @private
 */
function TranslateTo(points, pt) {
    var c = Centroid(points);
    var newpoints = new Array();
    for (var i = 0; i < points.length; i++) {
        var qx = points[i].X + pt.X - c.X;
        var qy = points[i].Y + pt.Y - c.Y;
        newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
    }
    return newpoints;
}

function Centroid(points) {
    var x = 0.0, y = 0.0;
    for (var i = 0; i < points.length; i++) {
        x += points[i].X;
        y += points[i].Y;
    }
    x /= points.length;
    y /= points.length;
    return new Point(x, y, 0);
}


/**
 * Length traversed by a point path
 * @private
 * @function
 * @param {Object} points - A given points.
 * @returns {Number}
 */
function PathLength(points) {
    var d = 0.0;
    for (var i = 1; i < points.length; i++)
    {
        if (points[i].ID == points[i-1].ID)
            d += Distance(points[i - 1], points[i]);
    }
    return d;
}

/**
 * Euclidean distance between two points
 * @private
 * @function
 * @param {Object} p1 - A given point with coordenates xy.
 * @param {Object} p2 - A given point with coordenates xy.
 * @returns {Number}
 */
function Distance(p1, p2) {
    var dx = p2.X - p1.X,
        dy = p2.Y - p1.Y;

    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates gesture distance
 * @private
 * @function
 * @param {Object} g1 - A given point with coordenates xy.
 * @param {Object} g2 - A given point with coordenates xy.
 * @returns {Number}
 */
function GestureDistance(g1, g2) {
    var i = 0,
        d = 0.0,
        nr = g1.length,
        nr2 = g2.length;

    if (nr2 < nr) {
        nr = nr2;
    }

    for (i; i < nr; i += 1) {
        d = d + Distance(g1[i], g2[i]);
    }

    return d;
}

// Expose PDollarRecognizer
module.exports.Pdollar = PDollarRecognizer;

// Expose Point
module.exports.Point = Point;
},{}]},{},[5])
(5)
});