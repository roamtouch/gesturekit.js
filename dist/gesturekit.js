/*!
 * gesturekit.js v1.1.0
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
        listeners;

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
},{}],2:[function(_dereq_,module,exports){
'use strict';

/**
 * @author Guille Paz <guille87paz@gmail.com>
 */

// Module dependencies
var inherit = _dereq_('./helpers').inherit,
    Emitter = _dereq_('./Emitter'),
    touch = _dereq_('./touchEvents'),
    Recognizer = _dereq_('./Recognizer'),
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
},{"./Emitter":1,"./Recognizer":3,"./helpers":4,"./touchEvents":7}],3:[function(_dereq_,module,exports){
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
 * @param {(Object | String)} [options] A given options to customize an instance or an string indicating GID.
 * @param {String} [gid] XXXXXX
 * @returns {recognizer} Returns a new instance of Recognizer.
 */
function Recognizer(gid) {
    this.gid = gid;

    this.init();

    return this;
}

/**
 * Initialize a new instance of Recognizer with given options.
 * @memberof! Recognizer.prototype
 * @function
 * @param {(Object | String)} options Configuration options or an string indicating GID.
 * @returns {recognizer} Returns a new instance of Recognizer.
 */
Recognizer.prototype.init = function () {

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
        status,
        response;

    xhr.open('GET', url + this.gid);

    // Add events
    xhr.onreadystatechange = function () {
        if (xhr.readyState === xhr.DONE) {
            status = xhr.status;

            if ((status >= 200 && status < 300) || status === 304 || status === 0) {
                response = JSON.parse(xhr.response || xhr.responseText);
                that.addGestures(response.gestureset.gestures);
                gesturekit.emit('load', response);
            } else {
                gesturekit.emit('fail');
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

    var that = this,
        name,
        meta,
        pointArray;

    data.forEach(function (e, i) {
        name = e.method;
        meta = e.metadata;

        if (meta !== '' && meta !== null && that.metadata[name] === undefined) {
            // Es parametro para el gesto cuando se emite el evento.
            that.metadata[name] = meta;
        }

        pointArray = [];

        e.gesture.forEach(function (p) {
            pointArray.push(new Point(parseFloat(p.X), parseFloat(p.Y), p.ID));
        });

        that.pdollar.addGesture(name, pointArray);
    });

    return this;
};

/**
 * Adds touch points into pointsCollection.
 * @memberof! Recognizer.prototype
 * @function
 * @returns {recognizer} Returns a new instance of Recognizer.
 */
Recognizer.prototype.setPoints = function (touches) {

    var that = this,
        pointers = touches.length;

    [].forEach.call(touches, function (e) {
        that.pointsCollection.push(new Point(e.pageX, e.pageY, pointers));
    });

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

    result.metadata = this.metadata[result.name];

    if (parseFloat(result.score) >= 0.1) {
        gesturekit.emit(result.name, result);
        gesturekit.emit('recognize', result);
    } else {
        gesturekit.emit('notrecognize');
    }

    this.pointsCollection.length = 0;

    // console.log("gesture: " + result.name + " score: " + result.score);

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
gesturekit.version = '1.1.0';

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
 * PDollarRecognizer class constants
 * @private
 */
var M = window.Math,
    NumPoints = 32,
    Origin = new Point(0, 0, 0),
    RECOGNITION_THRESHOLD = 1.8,
    NO_MATCH_NAME = 'No match.',
    NO_MATCH_SCORE = 0.0;

/**
 * PointCloud class: a point-cloud template
 * @constructor
 */
function PointCloud(name, points) {
    var that = this;

    this.name = name;
    this.points = [];

    points.forEach(function (point) {
        that.points.push(new Point(point.X, point.Y, point.ID));
    });
}

/**
 * Euclidean distance between two points
 * @private
 * @function
 * @param {Object} p1 - A given point with coordenates xy.
 * @param {Object} p2 - A given point with coordenates xy.
 * @returns {Number}
 */
function distance(p1, p2) {
    var dx = p2.X - p1.X,
        dy = p2.Y - p1.Y;

    return M.sqrt(dx * dx + dy * dy);
}


/**
 * cloudDistance
 * @private
 */
function cloudDistance(pts1, pts2, start) {
    var pts1Len = pts1.length, // pts1.length == pts2.length
        matched = [],
        sum = 0,
        i = start,
        index,
        min,
        j,
        weight,
        d;

    pts1.forEach(function () {
        matched.push(false);
    });

    do {

        index = -1;
        min = +Infinity;
        j = 0;

        for (j; j < pts1Len; j += 1) {
            if (!matched[j]) {
                d = distance(pts1[i], pts2[j]);
                if (d < min) {
                    min = d;
                    index = j;
                }
            }
        }

        matched[index] = true;

        weight = 1 - ((i - start + pts1Len) % pts1Len) / pts1Len;

        sum += weight * min;

        i = (i + 1) % pts1Len;

    } while (i !== start);

    return sum;
}

/**
 * greedyCloudMatch
 * @private
 */
function greedyCloudMatch(points, P) {
    var e = 0.50,
        step = M.floor(M.pow(points.length, 1 - e)),
        min = +Infinity,
        i = 0,
        len = points.length,
        d1,
        d2;

    for (i; i < len; i += step) {
        d1 = cloudDistance(points, P.points, i);
        d2 = cloudDistance(P.points, points, i);
        min = M.min(min, M.min(d1, d2)); // min3
    }

    return min;
}

/**
 * Length traversed by a point path
 * @private
 * @function
 * @param {Object} points - A given points.
 * @returns {Number}
 */
function pathLength(points) {
    var d = 0.0,
        i = 1,
        len = points.length;

    for (i; i < len; i += 1) {
        if (points[i].ID === points[i - 1].ID) {
            d += distance(points[i - 1], points[i]);
        }
    }

    return d;
}

/**
 * resample
 * @private
 */
function resample(points, n) {
    var I = pathLength(points) / (n - 1), // interval length
        D = 0.0,
        newpoints = [points[0]],
        i = 1,
        d,
        qx,
        qy,
        q;

    for (i; i < points.length; i += 1) {
        if (points[i].ID === points[i - 1].ID) {
            d = distance(points[i - 1], points[i]);

            if ((D + d) >= I) {
                qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
                qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
                q = new Point(qx, qy, points[i].ID);
                newpoints.push(q); // append new point 'q'
                points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
                D = 0.0;

            } else {
                D += d;
            }
        }
    }

    if (newpoints.length === n - 1) { // sometimes we fall a rounding-error short of adding the last point, so add it if so
        newpoints.push(new Point(points[points.length - 1].X, points[points.length - 1].Y, points[points.length - 1].ID));
    }

    return newpoints;
}

/**
 * scale
 * @private
 */
function scale(points) {

    var i = 0,
        j = 0,
        len = points.length,
        minX = +Infinity,
        maxX = -Infinity,
        minY = +Infinity,
        maxY = -Infinity,
        size,
        newpoints = [],
        qx,
        qy;


    for (i; i < len; i += 1) {
        minX = M.min(minX, points[i].X);
        minY = M.min(minY, points[i].Y);
        maxX = M.max(maxX, points[i].X);
        maxY = M.max(maxY, points[i].Y);
    }

    size = M.max(maxX - minX, maxY - minY);

    for (j; j < len; j += 1) {
        qx = (points[j].X - minX) / size;
        qy = (points[j].Y - minY) / size;
        newpoints.push(new Point(qx, qy, points[j].ID));
    }

    return newpoints;
}

function centroid(points) {
    var x = 0.0,
        y = 0.0,
        i = 0,
        len = points.length;

    for (i; i < len; i += 1) {
        x += points[i].X;
        y += points[i].Y;
    }

    x /= len;
    y /= len;

    return new Point(x, y, 0);
}

/**
 * Translates points' centroid
 * @private
 */
function translateTo(points, pt) {

    var c = centroid(points),
        newpoints = [],
        i = 0,
        len = points.length,
        qx,
        qy;

    for (i; i < len; i += 1) {
        qx = points[i].X + pt.X - c.X;
        qy = points[i].Y + pt.Y - c.Y;

        newpoints.push(new Point(qx, qy, points[i].ID));
    }

    return newpoints;
}



/**
 * Calculates gesture distance
 * @private
 * @function
 * @param {Object} g1 - A given point with coordenates xy.
 * @param {Object} g2 - A given point with coordenates xy.
 * @returns {Number}
 */
function gestureDistance(g1, g2) {
    var i = 0,
        d = 0.0,
        nr = g1.length,
        nr2 = g2.length;

    if (nr2 < nr) {
        nr = nr2;
    }

    for (i; i < nr; i += 1) {
        d = d + distance(g1[i], g2[i]);
    }

    return d;
}

/**
 * PDollarRecognizer class
 * @constructor
 */
function PDollarRecognizer() {

    this.pointClouds = [];

    this.recognize = function (points) {

        points = resample(points, NumPoints);
        points = scale(points);
        points = translateTo(points, Origin);

        var d,
            result = {
                'name': NO_MATCH_NAME,
                'score': NO_MATCH_SCORE
            },
            d1,
            d2,
            best,
            b1 = +Infinity,
            u1 = -1,
            b2 = +Infinity,
            u2 = -1;

        this.pointClouds.forEach(function (pointCloud, i) {
            d = greedyCloudMatch(points, pointCloud);
            if (d < b1) {
                b2 = b1;
                u2 = u1;

                b1 = d; // best (least) distance
                u1 = i; // point-cloud
            } else if (d < b2) {
                b2 = d;
                u2 = i;
            }
        });

        if (u1 !== -1) {

            d1 = gestureDistance(points, this.pointClouds[u1].points);
            d2 = gestureDistance(points, this.pointClouds[u2].points);
            best = 0.0;

            if (d2 < d1) {
                result.name = this.pointClouds[u2].name;
                best = b2;

            } else {
                result.name = this.pointClouds[u1].name;
                best = b1;
            }

            if (best < RECOGNITION_THRESHOLD) {
                result.score = M.max((best - 2.0) / -2.0, 0.0);
            } else {
                result.name = NO_MATCH_NAME;
            }

        }

        return result;
    };

    this.addGesture = function (name, points) {
        this.pointClouds.push(new PointCloud(name, points));
    };

}

// Expose PDollarRecognizer
module.exports.Pdollar = PDollarRecognizer;

// Expose Point
module.exports.Point = Point;
},{}],7:[function(_dereq_,module,exports){
'use strict';

/**
 * @author Guille Paz <guille87paz@gmail.com>
 */

var msPointerSupported = window.navigator.msPointerEnabled,
    touchEvents = {
        'start': msPointerSupported ? 'MSPointerDown' : 'touchstart',
        'move': msPointerSupported ? 'MSPointerMove' : 'touchmove',
        'end': msPointerSupported ? 'MSPointerUp' : 'touchend'
    };

// Expose GestureKit
module.exports = touchEvents;
},{}]},{},[5])
(5)
});