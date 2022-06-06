let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = 850;
canvas.height = 850;

let canvasBounds = canvas.getBoundingClientRect();
let brg = 0;
let mouse = {
    x: 100,
    y: 100,
    clicked: false
};
let los = {
    x: 0,
    y: 0
};
let tbo = {
    x: 0,
    y: 0
};
let showOS = document.getElementById('os');
let showTGT = document.getElementById('tgt');
let soundSpeed = 4800;
let frqr = 0;
let zeroReferenceOpp = {
    x: 425,
    y: 850
};
let interval = 1000 * 60;
let expected = Date.now() + interval;
plot.checked = 'checked';

class Moboard {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedCircles = 40;
    }
    draw() {
        ctx.strokeStyle = 'black';
        ctx.setLineDash([5, 15]);
        for (let i = 1; i <= 10; i++) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.speedCircles * i, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.setLineDash([2, 20]);
        for (let i = 1; i <= 9; i++) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.speedCircles * i + 20, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.setLineDash([10, 20]);
        for (let i = 0; i < 360; i += 10) {
            ctx.save();
            ctx.globalAlpha = 0.1;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + Math.cos((i - 90 - brg) * Math.PI / 180) * canvas.width / 2.05, this.y + Math.sin((i - 90 - brg) * Math.PI / 180) * canvas.height / 2.05);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
    }
    numbers() {
        ctx.fillStyle = 'black';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = '10pt serif';
        for (let i = 2; i <= 20; i += 2) {
            ctx.save();
            ctx.globalAlpha = 0.3;
            let y1 = (-i * 20) + canvas.height / 2;
            let y2 = (i * 20) + canvas.height / 2 - 15;
            ctx.fillText(i + '', this.x + 2, y1);
            ctx.fillText(i + '', this.x + 2, y2);
            ctx.restore();
        }
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < 360; i += 10) {
            let xCoord = (this.x + Math.cos((i - 90 - brg) * Math.PI / 180) * canvas.width / 2.05);
            let yCoord = (this.y + Math.sin((i - 90 - brg) * Math.PI / 180) * canvas.height / 2.05);
            zeroReferenceOpp.x = (this.x + Math.cos((180 - 90 - brg) * Math.PI / 180) * canvas.width / 2.05);
            zeroReferenceOpp.y = (this.y + Math.sin((180 - 90 - brg) * Math.PI / 180) * canvas.height / 2.05);
            let num = i;
            if (i.toString().length <= 2) {
                num = '0' + i;
            }
            if (i.toString().length <= 1) {
                num = '00' + i;
            }
            ctx.fillText(num, xCoord, yCoord);
        }
    }
}
let moboard = new Moboard()

class Vector {
    constructor(x, y, c, v) {
        this.pt1 = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        this.pt2 = {
            x: x,
            y: y
        };
        this.color = c;
        this.crs = 0;
        this.spd = 5;
        this.lla = 0;
        this.si = 0;
        this.sa = 0;
        this.vNum = v;
    }
    draw() {
        ctx.setLineDash([]);
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.pt1.x, this.pt1.y);
        ctx.lineTo(this.pt2.x, this.pt2.y);
        ctx.closePath();
        ctx.stroke();
    }
    setSpeed() {
        let dx = this.pt1.x - this.pt2.x;
        let dy = this.pt1.y - this.pt2.y;
        let length = Math.hypot(dx, dy);
        this.spd = length / 10;
    }
    calcLla() {
        let distBA_x = this.pt1.x - this.pt2.x;
        let distBA_y = this.pt1.y - this.pt2.y;
        let distBC_x, distBC_y;
        if (this.vNum === 1) {
            distBC_x = this.pt1.x - los.x;
            distBC_y = this.pt1.y - los.y;
        } else {
            distBC_x = this.pt1.x - tbo.x;
            distBC_y = this.pt1.y - tbo.y;
        }
        let a = Math.atan2(distBA_x * distBC_y - distBA_y * distBC_x, distBA_x * distBC_x + distBA_y * distBC_y);
        if (a < 0) {
            a = a * -1;
        }
        this.lla = a * (180 / Math.PI);
    }
    calcLlaCpa() {
        let distBA_x = this.pt1.x - this.pt2.x;
        let distBA_y = this.pt1.y - this.pt2.y;
        let distBC_x, distBC_y, tbo;
        target1.brg <= 180 ? tbo = target1.brg + 180 : tbo = target1.brg - 180;
        let oppX = canvas.width / 2 + 400 * Math.cos(degreesToRadians(tbo - 90));
        let oppY = canvas.height / 2 + 400 * Math.sin(degreesToRadians(tbo - 90));
        if (this.vNum === 1) {
            distBC_x = this.pt1.x - target1.x;
            distBC_y = this.pt1.y - target1.y;
        } else {
            distBC_x = this.pt1.x - oppX;
            distBC_y = this.pt1.y - oppY;
        }
        let a = Math.atan2(distBA_x * distBC_y - distBA_y * distBC_x, distBA_x * distBC_x + distBA_y * distBC_y);
        if (a < 0) {
            a = a * -1;
        }
        this.lla = a * (180 / Math.PI);
    }
    calcCrs() {
        let distBA_x = this.pt1.x - this.pt2.x;
        let distBA_y = this.pt1.y - this.pt2.y;
        let distBC_x = this.pt1.x - zeroReferenceOpp.x;
        let distBC_y = this.pt1.y - zeroReferenceOpp.y;
        let a = Math.atan2(distBA_x * distBC_y - distBA_y * distBC_x, distBA_x * distBC_x + distBA_y * distBC_y);
        this.crs = 180 - a * (180 / Math.PI);
    }
    calcSiSa() {
        let a, tbo;
        brg <= 180 ? tbo = brg + 180 : tbo = brg - 180;
        this.vNum === 1 ? a = degreesToRadians(brg - this.crs) : a = degreesToRadians(tbo - this.crs);
        this.si = Math.cos(a) * this.spd;
        this.sa = Math.sin(a) * this.spd;
    }
    update() {
        let dx = mouse.x - this.pt2.x;
        let dy = mouse.y - this.pt2.y;
        if (Math.hypot(dx, dy) < 15 && mouse.clicked) {
            this.pt2.x = mouse.x;
            this.pt2.y = mouse.y;
        }
        if (plot.checked) this.calcLla();
        if (cpa.checked) this.calcLlaCpa();
        this.calcCrs();
        this.calcSiSa();
    }
}
let vector = new Vector(389, 389, 'blue', 1);
let vector2 = new Vector(490, 350, 'red', 2);

class Target {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.c = 'red';
        this.rng = 50;
        this.brg = 0;
        this.crs = vector2.crs;
        this.spd = vector2.spd;
    }
    draw() {
        ctx.setLineDash([]);
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
    }
    setPosition() {
        let l = this.rng * 5;
        let a = degreesToRadians(this.brg - 90);
        this.x = canvas.width / 2 + l * Math.cos(a);
        this.y = canvas.height / 2 + l * Math.sin(a);
    }
    updatePosition() {
        let distPerHour = this.spd * 5;
        let distPerMin = distPerHour / 60;
        let a = calcSRM() - degreesToRadians(90);
        let x = this.x;
        let y = this.y;
        this.x = x + distPerMin * Math.cos(a);
        this.y = y + distPerMin * Math.sin(a);
    }
}
let target1 = new Target();
window.onload = target1.setPosition()

function drawLOS(brg) {
    los.x = (canvas.width / 2 + Math.cos((-90) * Math.PI / 180) * canvas.width / 2);
    los.y = (canvas.height / 2 + Math.sin((-90) * Math.PI / 180) * canvas.height / 2);
    tbo.x = (canvas.width / 2 + Math.cos((90) * Math.PI / 180) * canvas.width / 2);
    tbo.y = (canvas.height / 2 + Math.sin((90) * Math.PI / 180) * canvas.height / 2);
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(los.x, los.y);
    ctx.lineTo(tbo.x, tbo.y);
    ctx.closePath();
    ctx.stroke();
}

function drawLeftRight() {
    let x1 = vector.pt2.x;
    let y1 = los.y;
    let x2 = vector.pt2.x;
    let y2 = tbo.y;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
}

function drawOpenCloseLine() {
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(0, vector.pt2.y);
    ctx.lineTo(canvas.width, vector.pt2.y);
    ctx.closePath();
    ctx.stroke();
}

function drawSRM() {
    ctx.setLineDash([5, 10]);
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(vector.pt2.x, vector.pt2.y);
    ctx.lineTo(vector2.pt2.x, vector2.pt2.y);
    ctx.closePath();
    ctx.stroke();
}

function drawDRM() {
    let a = calcSRM() - degreesToRadians(90);
    let c = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };
    let x2 = target1.x + 800 * Math.cos(a);
    let y2 = target1.y + 800 * Math.sin(a);
    let x3 = c.x + 100 * Math.cos(a);
    let y3 = c.y + 100 * Math.sin(a);
    ctx.setLineDash([5, 10]);
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(target1.x, target1.y);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
    //position = sign((Bx - Ax) * (Y - Ay) - (By - Ay) * (X - Ax))
    let check = Math.sign((x3 - c.x) * (target1.y - c.y) - (y3 - c.y) * (target1.x - c.x));
    calcCpaLine({
        x: target1.x,
        y: target1.y
    }, {
        x: x2,
        y: y2
    }, check);
}

canvas.addEventListener("mousemove", e => {
    mouse.x = e.x - canvasBounds.x;
    mouse.y = e.y - canvasBounds.y;
})

canvas.addEventListener("mousedown", () => {
    canvasBounds = canvas.getBoundingClientRect();
    mouse.clicked = true;
    animate();
})

canvas.addEventListener("mouseup", () => {
    mouse.clicked = false;
    cancelAnimationFrame(draw);
    if (plot.checked) updatePlot();
    if (cpa.checked) updateCPA();
})

showOS.addEventListener('change', () => {
    if (plot.checked) drawPlot();
    if (cpa.checked) drawCPA();
})

showTGT.addEventListener('change', () => {
    if (plot.checked) drawPlot();
    if (cpa.checked) drawCPA();
})

function degreesToRadians(deg) {
    return deg * Math.PI / 180;
}

function radiansToDegrees(rad) {
    return rad * 180 / Math.PI;
}

function drawPlot() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = 'lightgrey';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawLOS(brg);
    moboard.numbers();
    moboard.draw();
    vector.update();
    vector2.update();
    if (showOS.checked) {
        vector.draw();
        drawOpenCloseLine();
        drawLeftRight();
    }
    if (showTGT.checked) {
        vector2.draw();
    }
}

function drawCPA() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = 'lightgrey';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    moboard.numbers();
    moboard.draw();
    vector.update();
    vector2.update();
    target1.draw();
    drawSRM();
    drawDRM();
    if (showOS.checked) {
        vector.draw();
    }
    if (showTGT.checked) {
        vector2.draw();
    }
}

function step() {
    var dt = Date.now() - expected;
    if (dt > interval) {
        expected += dt;
    }
    target1.updatePosition();
    if (cpa.checked) drawCPA();
    expected += interval;
    setTimeout(step, Math.max(0, interval - dt));
}
setTimeout(step, interval);

function animate() {
    if (plot.checked) {
        drawPlot();
        updatePlot();
    }
    if (cpa.checked) {
        drawCPA();
        updateCPA();
    }
    draw = requestAnimationFrame(animate);
}
drawPlot();