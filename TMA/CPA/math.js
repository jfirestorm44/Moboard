function calcAngleOfLine(pt1, pt2, v) {
    let dx = pt1.x - pt2.x;
    let dy = pt1.y - pt2.y;
    let theta;
    if (v !== undefined && v.vNum == 1) {
        theta = Math.atan2(-dy, -dx)
    } else {
        theta = Math.atan2(dy, dx);
    }
    theta -= Math.PI / 2
    theta *= 180 / Math.PI;
    if (theta < 0) theta += 360;
    return theta
}

function calcLosAngle() {
    let theta = calcAngleOfLine(los, tbo)
    losAngle = theta;
}

function calcZeroReference() {
    
}

function calcVectorAngle(v1, v2, v) {
    let theta = calcAngleOfLine(v1, v2, v)
    return degreesToRadians(theta);
}

function calcSra() {
    if ((vector.pt2.x < los.x && vector2.pt2.x < los.x) || (vector.pt2.x >= los.x && vector2.pt2.x >= los.x)) {
        return Math.abs(Math.abs(vector.sa) - Math.abs(vector2.sa))
    }    
    return Math.abs(Math.abs(vector.sa) + Math.abs(vector2.sa))
}

function calcSri() {
        return vector.si + vector2.si
}

function calcFrqO() {
    //fr(v + vs)/(v + vr) = fo
    let src, rcvr;
    src = vector2.si >= 0 ? soundSpeed - vector2.si : soundSpeed + vector2.si;
    rcvr = vector.si >= 0 ? soundSpeed + vector.si : soundSpeed - vector.si;

    let fo = frqr * ((src) / (rcvr))
    return fo
}

function calcCPA() {
    let dx = vector.pt2.x - vector2.pt2.x;
    let dy = vector.pt2.y - vector2.pt2.y;
    let dist = Math.hypot(dx, dy)
    let a = calcAngleOfLine(vector.pt2, vector2.pt2, vector2)
    
    return (a + 90) % 360; ;
    
}

/*
function calcLLA() {
    let distBA_x = vector.pt1.x - vector.pt2.x;
    let distBA_y = vector.pt1.y - vector.pt2.y;
    let distBC_x = vector.pt1.x - los.x;
    let distBC_y = vector.pt1.y - los.y;

    let angle1 = Math.atan2(distBA_x * distBC_y - distBA_y * distBC_x, distBA_x * distBC_x + distBA_y * distBC_y);
    if (angle1 < 0) {
        angle1 = angle1 * -1;
    }
    lla = angle1 * (180 / Math.PI);
}

function calcOsCrs() {
    let dx = vector.pt1.x - vector.pt2.x;
    let dy = vector.pt1.y - vector.pt2.y;
    let theta = Math.atan2(dy, dx);
    theta -= Math.PI / 2;
    theta *= 180 / Math.PI;
    if (theta < 0) theta += 360;
    if (theta >= 180) {
        osCrs = brg - lla
    }
    if (theta < 180) {
        osCrs = brg + lla
    }
    if (osCrs < 0) {
        osCrs = 360 + osCrs
    }
}


function calcSoiSoa() {
    let a = degreesToRadians(brg - osCrs)
    let a2 = degreesToRadians(brg - tgtCrs)
    vector.si = Math.cos(a) * vector.spd;
    vector.sa = Math.sin(a) * vector.spd;
    vector2.si = Math.cos(a2) * vector2.spd;
    vector2.sa = Math.sin(a2) * vector2.spd;
}
*/
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