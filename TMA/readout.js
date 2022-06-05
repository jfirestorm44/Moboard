let losReadout = document.getElementById('los');
let tboReadout = document.getElementById('tbo');
let osCrsReadout = document.getElementById('CRSo');
let spdoReadout = document.getElementById('SPDo');
let soiReadout = document.getElementById('soi');
let soaReadout = document.getElementById('soa');
let llaReadout = document.getElementById('lla');
let aobReadout = document.getElementById('aob');
let tgtCrsReadout = document.getElementById('CRSt');
let spdtReadout = document.getElementById('SPDt');
let stiReadout = document.getElementById('sti');
let staReadout = document.getElementById('sta');
let sriReadout = document.getElementById('sri');
let sraReadout = document.getElementById('sra');
let ssReadout = document.getElementById('ss');
let frqoReadout = document.getElementById('FRQo');
let frqrReadout = document.getElementById('FRQr');
let cpaTgtBrgReadout = document.getElementById('brg');
let cpaRngReadout = document.getElementById('rng');
let cpaReadout = document.getElementById('cpaBrg');
let rngAtCpaReadout = document.getElementById('cpaRng');
let timeUntilCpaReadout = document.getElementById('cpaTime');
let enter = false;

function setReadout() {
    if (cpa.checked) {
        losReadout.value = 0;
        brg = 0;
        drawCPA();
        losReadout.setAttribute('readonly', 'readonly');
        losReadout.style.color = "lightgrey";
        cpaTgtBrgReadout.removeAttribute('readonly');
        cpaRngReadout.removeAttribute('readonly');
        cpaTgtBrgReadout.style.color = "black";
        cpaRngReadout.style.color = "black";
    }
    if (plot.checked) {
        drawPlot();
        losReadout.removeAttribute('readonly');
        losReadout.style.color = "black";
        cpaTgtBrgReadout.setAttribute('readonly', 'readonly');
        cpaRngReadout.setAttribute('readonly', 'readonly');
        cpaTgtBrgReadout.style.color = "lightgrey";
        cpaRngReadout.style.color = "lightgrey";
    }
}

function updatePlot() {
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
    cpaTgtBrgReadout.value = target1.brg.toFixed(1)
    cpaRngReadout.value = target1.rng.toFixed(2)
}

function updateCPA() {
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
    cpaTgtBrgReadout.value = target1.brg.toFixed(1)
    cpaRngReadout.value = target1.rng.toFixed(2)
}

losReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter') {
        if (losReadout.value > 359.9) {
            losReadout.value = 0;
        }
        brg = parseInt(losReadout.value)
        if (plot.checked) drawPlot()
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
        if (plot.checked) drawPlot()
        if (cpa.checked) drawCPA();
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
        if (plot.checked) drawPlot();
        if (cpa.checked) drawCPA();
    }
})

tgtCrsReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        enter = true;
        if (tgtCrsReadout.value > 359.9) {
            tgtCrsReadout.style.borderColor = 'red'
            return
        }
        tgtCrsReadout.style.borderColor = 'black';
        let l = vector2.spd * 10;
        let a = degreesToRadians(parseInt(tgtCrsReadout.value));
        let aOffset = degreesToRadians(90 + brg);
        vector2.pt2.x = vector2.pt1.x + l * Math.cos(a - aOffset);
        vector2.pt2.y = vector2.pt1.y + l * Math.sin(a - aOffset);
        if (plot.checked) drawPlot();
        if (cpa.checked) drawCPA();
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
        if (plot.checked) drawPlot()
        if (cpa.checked) drawCPA();
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

//CPA CONTROLS
cpaTgtBrgReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter && cpa.checked) {
        target1.brg = parseInt(cpaTgtBrgReadout.value)
        target1.setPosition()
        drawCPA()
    }
})

cpaRngReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter && cpa.checked) {
        target1.rng = parseInt(cpaRngReadout.value)
        target1.setPosition()
        drawCPA()
    }
})

window.addEventListener('keyup', e => {
    if (e.code == 'Enter') {
        enter = false;
        updatePlot();
    }

})

window.onload = function () {
    updatePlot();
}