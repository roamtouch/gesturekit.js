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
    RECOGNITION_THRESHOLD = 1.5,
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

        var that = this,
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

        this.pointClouds.forEach(function (pointCloud, i) {

            d = greedyCloudMatch(points, pointCloud);
            if (d < b1) {

                if (u1 === -1 || pointCloud.name != that.pointClouds[u1].name) {
                  b2 = b1;
                  u2 = u1;
                }

                // b2 = b1;
                // u2 = u1;

                b1 = d; // best (least) distance
                u1 = i; // point-cloud
            } else if (d < b2 && pointCloud.name != that.pointClouds[u1].name) {
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

            if (best <= RECOGNITION_THRESHOLD) {
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