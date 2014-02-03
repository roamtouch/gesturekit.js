'use strict';

var M = window.Math;

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

//
// Result class
//
function Result(name, score) {

    this.name = name;
    this.score = score;
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
                'score': NO_MATCH_SCORE
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
                result.score = M.max((best - 2.0) / -2.0, 0.0)
            } else {
                result.name = NO_MATCH_NAME;
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
        step = M.floor(M.pow(points.length, 1 - e)),
        min = +Infinity,
        i = 0,
        len = points.length,
        d1,
        d2;

    for (i; i < len; i += step) {
        d1 = CloudDistance(points, P.points, i);
        d2 = CloudDistance(P.points, points, i);
        min = M.min(min, M.min(d1, d2)); // min3
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
        index,
        min,
        j,
        matechedLen,
        weight;

    for (k; k < pts1Len; k += 1) {
        matched.push(false);
    }

    matechedLen = matched.length;

    do {

        index = -1;
        min = +Infinity;
        j = 0;

        for (j; j < pts1Len; j += 1) {
            if (!matched[j]) {
                var d = Distance(pts1[i], pts2[j]);
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
        minX = M.min(minX, points[i].X);
        minY = M.min(minY, points[i].Y);
        maxX = M.max(maxX, points[i].X);
        maxY = M.max(maxY, points[i].Y);
    }
    var size = M.max(maxX - minX, maxY - minY);
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

    return M.sqrt(dx * dx + dy * dy);
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