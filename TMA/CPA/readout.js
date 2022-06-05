let losReadout = document.getElementById('los')
let tboReadout = document.getElementById('tbo')
let osCrsReadout = document.getElementById('CRSo')
let spdoReadout = document.getElementById('SPDo')
let soiReadout = document.getElementById('soi')
let soaReadout = document.getElementById('soa')
let llaReadout = document.getElementById('lla')
let aobReadout = document.getElementById('aob')
let tgtCrsReadout = document.getElementById('CRSt')
let spdtReadout = document.getElementById('SPDt')
let stiReadout = document.getElementById('sti')
let staReadout = document.getElementById('sta')
let sriReadout = document.getElementById('sri')
let sraReadout = document.getElementById('sra')
let ssReadout = document.getElementById('SS')
let frqoReadout = document.getElementById('FRQo')
let frqrReadout = document.getElementById('FRQr')

let enter = false;

function updateParameters() {
    calcLosAngle()
    vector.setSpeed()
    vector2.setSpeed()
    llaReadout.value = vector.lla.toFixed(1);
    aobReadout.value = vector2.lla.toFixed(1);
    losReadout.value = brg.toFixed(1)
    tboReadout.value = brg <= 180 ? brg + 180 : brg - 180;
    osCrsReadout.value = vector.crs.toFixed(1)
    tgtCrsReadout.value = vector2.crs.toFixed(1)
    spdoReadout.value = vector.spd.toFixed(2)
    spdtReadout.value = vector2.spd.toFixed(2)
    soiReadout.value = vector.si.toFixed(3);
    stiReadout.value = vector2.si.toFixed(3);
    soaReadout.value = Math.abs(vector.sa.toFixed(3));
    staReadout.value = Math.abs(vector2.sa.toFixed(3));
    sriReadout.value = calcSri().toFixed(2);
    sraReadout.value = calcSra().toFixed(2);
    frqoReadout.value = calcFrqO().toFixed(3);
}

losReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter') {
        brg = parseInt(losReadout.value)
        drawBoard()
    }
})

spdoReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        enter = true
        vector.spd = parseInt(spdoReadout.value)
        let l = vector.spd * 10
        let a = calcVectorAngle(vector.pt1, vector.pt2, vector);
        let aOffset = degreesToRadians(90)
        vector.pt2.x = vector.pt1.x + l * Math.cos(a + aOffset)
        vector.pt2.y = vector.pt1.y + l * Math.sin(a + aOffset)
        drawBoard()
    }
})

osCrsReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        enter = true;
        let l = vector.spd * 10;
        let a = degreesToRadians(parseInt(osCrsReadout.value));
        let aOffset = degreesToRadians(90 + brg);
        vector.pt2.x = vector.pt1.x + l * Math.cos(a - aOffset);
        vector.pt2.y = vector.pt1.y + l * Math.sin(a - aOffset);
        drawBoard();
    }
})

tgtCrsReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        enter = true;
        let l = vector2.spd * 10;
        let a = degreesToRadians(parseInt(tgtCrsReadout.value));
        let aOffset = degreesToRadians(90 + brg);
        vector2.pt2.x = vector2.pt1.x + l * Math.cos(a - aOffset);
        vector2.pt2.y = vector2.pt1.y + l * Math.sin(a - aOffset);
        drawBoard();
    }
})

spdtReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        enter = true
        vector2.spd = parseInt(spdtReadout.value)
        let l = vector2.spd * 10
        let a = calcVectorAngle(vector2.pt1, vector2.pt2, vector2);
        let aOffset = degreesToRadians(90)
        vector2.pt2.x = vector2.pt1.x + l * Math.cos(a - aOffset)
        vector2.pt2.y = vector2.pt1.y + l * Math.sin(a - aOffset)
        drawBoard()
    }
})

ssReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        soundSpeed = parseInt(ssReadout.value)
    }
})

frqrReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        frqr = parseInt(frqrReadout.value)
    }
})

window.addEventListener('keyup', e => {
    if (e.code == 'Enter') {
        enter = false;
        updateParameters();
    }
    console.log(calcCPA())
})

window.onload = function () {
    updateParameters();
}