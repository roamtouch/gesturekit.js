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