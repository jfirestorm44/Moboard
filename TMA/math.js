function calcAngleOfLine(pt1, pt2, v) {
    let dx = pt1.x - pt2.x;
    let dy = pt1.y - pt2.y;
    let theta;
    if (v !== undefined && v.vNum === 1) {
        theta = Math.atan2(-dy, -dx);
    } else {
        theta = Math.atan2(dy, dx);
    }
    theta -= Math.PI / 2;
    theta *= 180 / Math.PI;
    if (theta < 0) theta += 360;
    return theta;
}

function calcVectorAngle(v1, v2, v) {
    let theta = calcAngleOfLine(v1, v2, v);
    return degreesToRadians(theta);
}

function calcSra() {
    if ((vector.pt2.x < los.x && vector2.pt2.x < los.x) || (vector.pt2.x >= los.x && vector2.pt2.x >= los.x)) {
        return Math.abs(Math.abs(vector.sa) - Math.abs(vector2.sa));
    }
    return Math.abs(Math.abs(vector.sa) + Math.abs(vector2.sa));
}

function calcSri() {
    return vector.si + vector2.si;
}

function calcCPA(check) {
    let a = calcAngleOfLine(vector.pt2, vector2.pt2, vector2)
    if (check === 0) {
        let val = (a - 90) % 360;
        if (val < 0) val += 360;
        cpaReadout.value = val.toFixed(1);
        return val;
    }
    if (check === -1) {
        let val = (a - 90) % 360;
        if (val < 0) val += 360;
        cpaReadout.value = val.toFixed(1);
        return val;
    }
    if (check === 1) {
        let val = (a + 90) % 360;
        if (val < 0) val += 360;
        cpaReadout.value = val.toFixed(1);
        return val;
    }
}

function calcSRM() {
    let theta = calcAngleOfLine(vector.pt2, vector2.pt2);
    return degreesToRadians(theta);
}

function calcCpaLine(p1, p2, c) {
    let a = degreesToRadians(calcCPA(c) - 90);
    let pt2 = {
        x: canvas.width / 2 + 100 * Math.cos(a),
        y: canvas.height / 2 + 100 * Math.sin(a)
    };
    let pt1 = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };
    calcTgtDistToCPA(intersectLines(p1, p2, pt1, pt2));
    calcTgtDistAtCPA(intersectLines(p1, p2, pt1, pt2));
}

function calcTgtDistToCPA(pt) {
    if (pt === undefined) {
        timeUntilCpaReadout.value = 'PAST';
        return
    }
    let dx = pt.x - target1.x;
    let dy = pt.y - target1.y;
    let dist = Math.hypot(dx, dy);
    calcTimeToCPA((dist / 5));
}

function calcTgtDistAtCPA(pt) {
    if (pt === undefined) {
        rngAtCpaReadout.value = 'PAST';
        return
    }
    let dx = pt.x - vector2.pt1.x;
    let dy = pt.y - vector2.pt1.y;
    let dist = Math.hypot(dx, dy);
    rngAtCpaReadout.value = (dist / 5).toFixed(1);
}

function calcTimeToCPA(dist) {
    let t = 60 * (dist / target1.spd);
    let time = numToTime(t);
    timeUntilCpaReadout.value = time;
}

function numToTime(num) {
    let hours = Math.floor(num / 60);
    let minutes = Math.trunc(num % 60);
    if (minutes.toString().length < 2) {
        minutes = '0' + minutes;
    }
    return hours + ":" + minutes;
}


function intersectLines(coord1, coord2, coord3, coord4) {
    let x1 = coord1.x;
    let x2 = coord2.x;
    let y1 = coord1.y;
    let y2 = coord2.y;

    let x3 = coord3.x;
    let x4 = coord4.x;
    let y3 = coord3.y;
    let y4 = coord4.y;

    let d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (d == 0) {
        return;
    }
    let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
    let u = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / d;

    if (t > 0 && t < 1 && u > 0) {
        return {
            x: x1 + t * (x2 - x1),
            y: y1 + t * (y2 - y1)
        };
    }
    return;
}
/*
function calcFrqO() {
    //fr(v + vs)/(v + vr) = fo
    let src, rcvr;
    src = vector2.si >= 0 ? soundSpeed - vector2.si : soundSpeed + vector2.si;
    rcvr = vector.si >= 0 ? soundSpeed + vector.si : soundSpeed - vector.si;

    let fo = frqr * ((src) / (rcvr))
    return fo
}

function doesLineInterceptCircle(A, B, C, radius) {
    var dist;
    const v1x = B.x - A.x;
    const v1y = B.y - A.y;
    const v2x = C.x - A.x;
    const v2y = C.y - A.y;
    // get the unit distance along the line of the closest point to
    // circle center
    const u = (v2x * v1x + v2y * v1y) / (v1y * v1y + v1x * v1x);


    // if the point is on the line segment get the distance squared
    // from that point to the circle center
    if (u >= 0 && u <= 1) {
        dist = (A.x + v1x * u - C.x) ** 2 + (A.y + v1y * u - C.y) ** 2;
    } else {
        // if closest point not on the line segment
        // use the unit distance to determine which end is closest
        // and get dist square to circle
        dist = u < 0 ?
            (A.x - C.x) ** 2 + (A.y - C.y) ** 2 :
            (B.x - C.x) ** 2 + (B.y - C.y) ** 2;
    }
    //console.log(dist < radius * radius);
    //console.log((B.x - C.x) ** 2 + (B.y - C.y) ** 2)
}
*/