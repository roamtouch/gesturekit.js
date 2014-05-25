'use strict';

/**
 * @author Guille Paz <guille87paz@gmail.com>
 */

var url = 'http://www.gesturekit.com/sdk/sendanalytics/';

/**
 * Creates a new instance of Analytics.
 * @constructor
 * @returns {analytics} Returns a new instance of Analytics.
 */
function Analytics() {
    this.init();
}

/**
 * Initialize a new instance of Analytics.
 * @memberof! Analytics.prototype
 * @function
 * @returns {analytics} Returns a new instance of Analytics.
 */
Analytics.prototype.init = function () {
    var that = this;

    this.collection = {};

    this.data = {
        'json': {
            'device_id': window.navigator.userAgent,
            'platform_id': '8',
            'gid': gesturekit._options.gid,
            'reports': []
        },
        'gid': gesturekit._options.gid,
        'version': 1
    };

    gesturekit.on('recognize', function (gesture) {
        that.collection[gesture.name] = that.collection[gesture.name] || [];
        that.collection[gesture.name].push(gesture);
        that.sendGestures();
        that.collection.length = 0;
    });

    return this;
};

/**
 *
 * @memberof! Analytics.prototype
 * @function
 * @returns {analytics} Returns a new instance of Analytics.
 */
Analytics.prototype.sendGestures = function () {
    var that = this,
        gestures = [],
        key,
        xhr = new XMLHttpRequest(),
        status,
        queryString = [],
        gesture;

    for (key in this.collection) {
        gesture = this.collection[key];
        gestures.push({
            'gesture_id': key,
            'score': (gesture.length > 0) ? gesture[0].score : 0,
            'count': gesture.length
        });
    }

    var data = {
        'json': {
            'device_id': '',
            'platform_id': 'pc',
            'gid': gesturekit._options.gid,
            'reports': []
        },
        'gid': gesturekit._options.gid,
        'version': 1
    };

    data.json.reports.push({
        'gestures': gestures,
        'date': new window.Date().getTime() / 1000 | 0
    });

    data.json = JSON.stringify(data.json);

    for (key in data) {
        queryString.push(key + '=' + data[key]);
    }

    queryString = queryString.join('&');

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(queryString);

    return this;
};


// Expose Analytics
module.exports = Analytics;