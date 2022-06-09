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
let frqcReadout = document.getElementById('FRQc');
let cpaTgtBrgReadout = document.getElementById('brg');
let cpaRngReadout = document.getElementById('rng');
let cpaReadout = document.getElementById('cpaBrg');
let rngAtCpaReadout = document.getElementById('cpaRng');
let timeUntilCpaReadout = document.getElementById('cpaTime');
let expRngReadout0 = document.getElementById('rng1');
let expRngReadout1 = document.getElementById('rng2');
let expRngReadout2 = document.getElementById('rng3');
let expBrgRateReadout = [document.getElementById('brgRate1'), document.getElementById('brgRate2'), document.getElementById('brgRate3')];
let expBrgXingReadout = [document.getElementById('brgXing1'), document.getElementById('brgXing2'), document.getElementById('brgXing3')];
let currentBrg = document.getElementById('currentBrg');
let currentRng = document.getElementById('currentRng');
let timeLate = document.getElementById('timeLate');
let enter = false;

function setReadout() {
    if (cpa.checked) {
        losReadout.value = 0;
        brg = 0;
        drawCPA();
        updateReadout()
        losReadout.setAttribute('readonly', 'readonly');
        losReadout.style.color = "lightgrey";
        cpaTgtBrgReadout.removeAttribute('readonly');
        cpaRngReadout.removeAttribute('readonly');
        cpaTgtBrgReadout.style.color = "black";
        cpaRngReadout.style.color = "black";
    }
    if (plot.checked) {
        drawPlot();
        updateReadout()
        losReadout.removeAttribute('readonly');
        losReadout.style.color = "black";
        cpaTgtBrgReadout.setAttribute('readonly', 'readonly');
        cpaRngReadout.setAttribute('readonly', 'readonly');
        cpaTgtBrgReadout.style.color = "lightgrey";
        cpaRngReadout.style.color = "lightgrey";
    }
}

function updateReadout() {
    vector.setSpeed();
    tgtVector[vectorSelect].setSpeed();
    aobReadout.value = tgtVector[vectorSelect].lla.toFixed(1);
    losReadout.value = brg.toFixed(1);
    tboReadout.value = brg <= 180 ? brg + 180 : brg - 180;
    osCrsReadout.value = vector.crs.toFixed(1);
    tgtCrsReadout.value = tgtVector[vectorSelect].crs.toFixed(1);
    llaReadout.value = vector.lla.toFixed(1);
    spdoReadout.value = vector.spd.toFixed(2);
    spdtReadout.value = tgtVector[vectorSelect].spd.toFixed(2);
    soiReadout.value = vector.si.toFixed(3);
    stiReadout.value = tgtVector[vectorSelect].si.toFixed(3);
    soaReadout.value = Math.abs(vector.sa.toFixed(3));
    staReadout.value = Math.abs(tgtVector[vectorSelect].sa.toFixed(3));
    sriReadout.value = calcSri().toFixed(2);
    sraReadout.value = calcSra().toFixed(2);
    cpaTgtBrgReadout.value = target[vectorSelect].brg.toFixed(1);
    cpaRngReadout.value = target[vectorSelect].rng.toFixed(2);
    currentRng.value = target[vectorSelect].currentRng;
    currentBrg.value = target[vectorSelect].currentBrg;
    timeLate.value = target[vectorSelect].timeLate;
    frqrReadout.value = target[vectorSelect].frqr;
    frqcReadout.value = target[vectorSelect].frqc;
    frqoReadout.value = target[vectorSelect].frqo;
    ssReadout.value = target[vectorSelect].ss;
}

losReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        enter = true;
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
        tgtVector[vectorSelect].crs = parseInt(tgtCrsReadout.value);
        let l = tgtVector[vectorSelect].spd * 10;
        let a = degreesToRadians(parseInt(tgtCrsReadout.value));
        let aOffset = degreesToRadians(90 + brg);
        tgtVector[vectorSelect].pt2.x = tgtVector[vectorSelect].pt1.x + l * Math.cos(a - aOffset);
        tgtVector[vectorSelect].pt2.y = tgtVector[vectorSelect].pt1.y + l * Math.sin(a - aOffset);
        if (plot.checked) drawPlot();
        if (cpa.checked)  drawCPA()
    }
})

spdtReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        enter = true;
        if (spdtReadout.value > 30) spdtReadout.value = 30;
        tgtVector[vectorSelect].spd = parseFloat(spdtReadout.value);
        let l = tgtVector[vectorSelect].spd * 10;
        let a = calcVectorAngle(tgtVector[vectorSelect].pt1, tgtVector[vectorSelect].pt2, tgtVector[vectorSelect]);
        let aOffset = degreesToRadians(90);
        tgtVector[vectorSelect].pt2.x = tgtVector[vectorSelect].pt1.x + l * Math.cos(a - aOffset);
        tgtVector[vectorSelect].pt2.y = tgtVector[vectorSelect].pt1.y + l * Math.sin(a - aOffset);
        if (plot.checked) drawPlot();
        if (cpa.checked) drawCPA();
    }
})

ssReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        enter = true
        target[vectorSelect].ss = Number(ssReadout.value);
    }
})

frqrReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        enter = true
        target[vectorSelect].frqr = Number(frqrReadout.value);
        target[vectorSelect].frqc = frqcReadout.value = calcFRQc(target[vectorSelect].ss).toFixed(3);
        target[vectorSelect].frqo = frqoReadout.value = calcFRQo(target[vectorSelect].ss).toFixed(3);
    }
})

//CPA CONTROLS
cpaTgtBrgReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        enter = true;
        if (cpaTgtBrgReadout.value > 359.9) {
            cpaTgtBrgReadout.value = 0;
        }
        target[vectorSelect].brg = parseInt(cpaTgtBrgReadout.value);
        target[vectorSelect].setPosition();
        target[vectorSelect].updateCurrentInfo();
        updateReadout()
        drawCPA();
    }
})

cpaRngReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        enter = true;
        target[vectorSelect].rng = parseInt(cpaRngReadout.value);
        target[vectorSelect].setPosition();
        target[vectorSelect].updateCurrentInfo();
        updateReadout()
        drawCPA();
    }
})

timeLate.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        enter = true;
        target[vectorSelect].timeLate = Number(timeLate.value)
        target[vectorSelect].setPosition();
        target[vectorSelect].updateCurrentInfo();
        updateReadout()
        drawCPA();
    }
})

expRngReadout0.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        enter = true;
        target[vectorSelect].exRng[0] = Number(expRngReadout0.value);
        calcExpectedBrgRate(target[vectorSelect].exRng[0], 0)
    }
})

expRngReadout1.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        enter = true;
        target[vectorSelect].exRng[1] = Number(expRngReadout1.value);
        calcExpectedBrgRate(target[vectorSelect].exRng[1], 1)
    }
})

expRngReadout2.addEventListener('keydown', e => {
    if (e.code == 'Enter' && !enter) {
        enter = true;
        target[vectorSelect].exRng[2] = Number(expRngReadout2.value);
        calcExpectedBrgRate(target[vectorSelect].exRng[2], 2)
    }
})

window.addEventListener('keyup', e => {
    if (e.code == 'Enter') {
        enter = false;
    }
})

window.onload = load()