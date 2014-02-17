'use strict';

/**
 * @author Guille Paz <guille87paz@gmail.com>
 */

// Module dependencies
var Pdollar = require('./pdollar').Pdollar,
    Point = require('./pdollar').Point,
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

    var that = this,
        name,
        meta,
        pointArray;

    data.forEach(function (e, i) {
        name = e.method;
        meta = e.metadata;

        if (meta !== '' && meta !== null && that.metadata[name] === undefined ) {
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