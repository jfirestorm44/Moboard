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
let expRngReadout0 = document.getElementById('rng1');
let expRngReadout1 = document.getElementById('rng2');
let expRngReadout2 = document.getElementById('rng3');
let expBrgRateReadout = [document.getElementById('brgRate1'), document.getElementById('brgRate2'), document.getElementById('brgRate3')]
let expBrgXingReadout = [document.getElementById('brgXing1'), document.getElementById('brgXing2'), document.getElementById('brgXing3')]
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
    vector.setSpeed();
    vector3[vectorSelect].setSpeed();
    llaReadout.value = vector.lla.toFixed(1);
    aobReadout.value = vector3[vectorSelect].lla.toFixed(1);
    losReadout.value = brg.toFixed(1);
    tboReadout.value = brg <= 180 ? brg + 180 : brg - 180;
    osCrsReadout.value = vector.crs.toFixed(1);
    tgtCrsReadout.value = vector3[vectorSelect].crs.toFixed(1);
    spdoReadout.value = vector.spd.toFixed(2);
    spdtReadout.value = vector3[vectorSelect].spd.toFixed(2);
    soiReadout.value = vector.si.toFixed(3);
    stiReadout.value = vector3[vectorSelect].si.toFixed(3);
    soaReadout.value = Math.abs(vector.sa.toFixed(3));
    staReadout.value = Math.abs(vector3[vectorSelect].sa.toFixed(3));
    sriReadout.value = calcSri().toFixed(2);
    sraReadout.value = calcSra().toFixed(2);
    //frqoReadout.value = calcFrqO().toFixed(3);
    cpaTgtBrgReadout.value = target[vectorSelect].brg.toFixed(1);
    cpaRngReadout.value = target[vectorSelect].rng.toFixed(2);
}

function updateCPA() {
    vector.setSpeed();
    vector3[vectorSelect].setSpeed();
    llaReadout.value = vector.lla.toFixed(1);
    aobReadout.value = vector3[vectorSelect].lla.toFixed(1);
    losReadout.value = brg.toFixed(1);
    tboReadout.value = brg <= 180 ? brg + 180 : brg - 180;
    osCrsReadout.value = vector.crs.toFixed(1);
    tgtCrsReadout.value = vector3[vectorSelect].crs.toFixed(1);
    spdoReadout.value = vector.spd.toFixed(2);
    spdtReadout.value = vector3[vectorSelect].spd.toFixed(2);
    soiReadout.value = vector.si.toFixed(3);
    stiReadout.value = vector3[vectorSelect].si.toFixed(3);
    soaReadout.value = Math.abs(vector.sa.toFixed(3));
    staReadout.value = Math.abs(vector3[vectorSelect].sa.toFixed(3));
    sriReadout.value = calcSri().toFixed(2);
    sraReadout.value = calcSra().toFixed(2);
    cpaTgtBrgReadout.value = target[vectorSelect].brg.toFixed(1);
    cpaRngReadout.value = target[vectorSelect].rng.toFixed(2);
}

losReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter') {
        if (losReadout.value > 359.9) {
            losReadout.value = 0;
        }
        brg = parseInt(losReadout.value)
        if (plot.checked) drawPlot();
    }
})

spdoReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        enter = true;
        if (spdoReadout.value > 30) spdoReadout.value = 30;
        vector.spd = parseInt(spdoReadout.value);
        let l = vector.spd * 10;
        let a = calcVectorAngle(vector.pt1, vector.pt2, vector);
        let aOffset = degreesToRadians(90);
        vector.pt2.x = vector.pt1.x + l * Math.cos(a + aOffset);
        vector.pt2.y = vector.pt1.y + l * Math.sin(a + aOffset);
        if (plot.checked) drawPlot();
        if (cpa.checked) drawCPA();
    }
})

osCrsReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        enter = true;
        if (osCrsReadout.value > 359.9) osCrsReadout.value = 359.9;
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
        if (tgtCrsReadout.value > 359.9) tgtCrsReadout.value = 359.9;
        vector3[vectorSelect].crs = parseFloat(tgtCrsReadout.value);
        let l = vector3[vectorSelect].spd * 10;
        let a = degreesToRadians(parseInt(tgtCrsReadout.value));
        let aOffset = degreesToRadians(90 + brg);
        vector3[vectorSelect].pt2.x = vector3[vectorSelect].pt1.x + l * Math.cos(a - aOffset);
        vector3[vectorSelect].pt2.y = vector3[vectorSelect].pt1.y + l * Math.sin(a - aOffset);
        if (plot.checked) drawPlot();
        if (cpa.checked) drawCPA();
    }
})

spdtReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        enter = true;
        if (spdtReadout.value > 30) spdtReadout.value = 30;
        vector3[vectorSelect].spd = parseFloat(spdtReadout.value);
        let l = vector3[vectorSelect].spd * 10;
        let a = calcVectorAngle(vector3[vectorSelect].pt1, vector3[vectorSelect].pt2, vector3[vectorSelect]);
        let aOffset = degreesToRadians(90);
        vector3[vectorSelect].pt2.x = vector3[vectorSelect].pt1.x + l * Math.cos(a - aOffset);
        vector3[vectorSelect].pt2.y = vector3[vectorSelect].pt1.y + l * Math.sin(a - aOffset);
        if (plot.checked) drawPlot();
        if (cpa.checked) drawCPA();
    }
})

ssReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        soundSpeed = parseInt(ssReadout.value);
    }
})

frqrReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        frqr = parseInt(frqrReadout.value);
        console.log(calcFRQc())
    }
})

//CPA CONTROLS
cpaTgtBrgReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter && cpa.checked) {
        if (cpaTgtBrgReadout.value > 359.9) {
            cpaTgtBrgReadout.value = 0;
        }
        target[vectorSelect].brg = parseInt(cpaTgtBrgReadout.value);
        target[vectorSelect].setPosition();
        drawCPA();
    }
})

cpaRngReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter && cpa.checked) {
        target[vectorSelect].rng = parseInt(cpaRngReadout.value);
        target[vectorSelect].setPosition();
        drawCPA();
    }
})

expRngReadout0.addEventListener('keydown', e => {
    if (e.code == 'Enter') {
        target[vectorSelect].exRng[0] = Number(expRngReadout0.value);
        calcExpectedBrgRate(target[vectorSelect].exRng[0], 0)
    }
})

expRngReadout1.addEventListener('keydown', e => {
    if (e.code == 'Enter') {
        target[vectorSelect].exRng[1] = Number(expRngReadout1.value);
        calcExpectedBrgRate(target[vectorSelect].exRng[1], 1)
    }
})

expRngReadout2.addEventListener('keydown', e => {
    if (e.code == 'Enter') {
        target[vectorSelect].exRng[2] = Number(expRngReadout2.value);
        calcExpectedBrgRate(target[vectorSelect].exRng[2], 2)
    }
})

window.addEventListener('keyup', e => {
    if (e.code == 'Enter') {
        enter = false;
        updatePlot();
    }

})
window.onload = load()