let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

canvas.width = 850
canvas.height = 850

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
}
let tbo = {
    x: 0,
    y: 0
}
let losAngle = 0;
let lla = 0;
let osCrs = 315;
let tgtCrs = 0;
let spdo = 5;
let spdt = 0;
let soa = 0;
let sra = 0;
let showOS = document.getElementById('os');
let showTGT = document.getElementById('tgt');
let soundSpeed = 4800;
let frqr = 0;
let zeroReferenceOpp = {x: 425, y: 850}

class Moboard {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedCircles = 40;
        this.a = 0;
        this.rot = 0;
    }
    draw() {
        ctx.strokeStyle = 'black';
        ctx.setLineDash([5, 15])
        for (let i = 1; i <= 10; i++) {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.speedCircles * i, 0, Math.PI * 2)
            ctx.closePath()
            ctx.stroke()
        }
        ctx.setLineDash([2, 20])
        for (let i = 1; i <= 9; i++) {
            ctx.beginPath()
            ctx.arc(this.x, this.y, (this.speedCircles) * i + 20, 0, Math.PI * 2)
            ctx.closePath()
            ctx.stroke()
        }
        ctx.setLineDash([10, 20])
        for (let i = 0; i < 360; i += 10) {
            ctx.save()
            ctx.globalAlpha = 0.1;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(this.x + Math.cos((i - 90 - brg) * Math.PI / 180) * canvas.width / 2.05, this.y + Math.sin((i - 90 - brg) * Math.PI / 180) * canvas.height / 2.05)
            ctx.stroke()
            ctx.closePath()
            ctx.restore()
        }
    }
    numbers() {
        ctx.fillStyle = 'black'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        ctx.font = '10pt serif';
        for (let i = 2; i <= 20; i += 2) {
            ctx.save()
            ctx.globalAlpha = 0.3;
            let y1 = (-i * 20) + canvas.height / 2;
            let y2 = (i * 20) + canvas.height / 2 - 15;
            ctx.fillText(i + '', this.x + 2, y1);
            ctx.fillText(i + '', this.x + 2, y2);

            ctx.restore();
        }

        ctx.fillStyle = 'black'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        for (let i = 0; i < 360; i += 10) {
           
            let xCoord = (this.x + Math.cos((i - 90 - brg) * Math.PI / 180) * canvas.width / 2.05)
            let yCoord = (this.y + Math.sin((i - 90 - brg) * Math.PI / 180) * canvas.height / 2.05)
            zeroReferenceOpp.x = (this.x + Math.cos((180 - 90 - brg) * Math.PI / 180) * canvas.width / 2.05)
            zeroReferenceOpp.y = (this.y + Math.sin((180 - 90 - brg) * Math.PI / 180) * canvas.height / 2.05)
            console.log(zeroReferenceOpp.x)
            let num = i;
            if (i.toString().length <= 2) {
                num = '0' + i
            }
            if (i.toString().length <= 1) {
                num = '00' + i
            }
            ctx.fillText(num, xCoord, yCoord)
        }
    }
}

class Vector {
    constructor(x, y, c, v) {
        this.pt1 = {
            x: canvas.width / 2,
            y: canvas.height / 2
        }
        this.pt2 = {
            x: x,
            y: y
        }
        this.color = c
        this.crs = 0;
        this.spd = 5;
        this.lla = 0;
        this.si = 0;
        this.sa = 0;
        this.vNum = v;
    }
    draw() {
        ctx.setLineDash([])
        ctx.strokeStyle = this.color;
        ctx.beginPath()
        ctx.moveTo(this.pt1.x, this.pt1.y)
        ctx.lineTo(this.pt2.x, this.pt2.y)
        ctx.closePath()
        ctx.stroke()
    }
    setSpeed() {
        let dx = this.pt1.x - this.pt2.x;
        let dy = this.pt1.y - this.pt2.y;
        let length = Math.hypot(dx, dy)
        this.spd = length / 10
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

        let angle1 = Math.atan2(distBA_x * distBC_y - distBA_y * distBC_x, distBA_x * distBC_x + distBA_y * distBC_y);
        if (angle1 < 0) {
            angle1 = angle1 * -1;
        }
        this.lla = angle1 * (180 / Math.PI);
    }
    calcCrs() {
        let distBA_x = this.pt1.x - this.pt2.x;
        let distBA_y = this.pt1.y - this.pt2.y;
        let distBC_x = this.pt1.x - zeroReferenceOpp.x;
        let distBC_y = this.pt1.y - zeroReferenceOpp.y;

        let angle1 = Math.atan2(distBA_x * distBC_y - distBA_y * distBC_x, distBA_x * distBC_x + distBA_y * distBC_y);       
        this.crs = 180 - angle1 * (180 / Math.PI);
    }
    calcSiSa() {
        let a;
        let tbo;
        brg <= 180 ? tbo = brg + 180 : tbo = brg - 180 
        this.vNum === 1 ? a = degreesToRadians(brg - this.crs) : a = degreesToRadians(tbo - this.crs)
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
        this.calcLla()
        this.calcCrs()
        this.calcSiSa()
    }
}
let vector = new Vector(389, 389, 'blue', 1)
let vector2 = new Vector(490, 350, 'red', 2)

class Target {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.c = 'red';
        this.range = 0;
    }
    draw() {
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 7, 0, Math.PI * 2)
        ctx.stroke();
        ctx.closePath();
    }
}

function drawLOS(brg) {
    los.x = (canvas.width / 2 + Math.cos((-90) * Math.PI / 180) * canvas.width / 2)
    los.y = (canvas.height / 2 + Math.sin((-90) * Math.PI / 180) * canvas.height / 2)
    tbo.x = (canvas.width / 2 + Math.cos((90) * Math.PI / 180) * canvas.width / 2)
    tbo.y = (canvas.height / 2 + Math.sin((90) * Math.PI / 180) * canvas.height / 2)
    ctx.strokeStyle = 'red';
    ctx.beginPath()
    ctx.moveTo(los.x, los.y)
    ctx.lineTo(tbo.x, tbo.y)
    ctx.stroke()
    ctx.closePath()
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
    ctx.stroke();
    ctx.closePath();
}

function drawOpenCloseLine() {
    ctx.strokeStyle = 'red';
    ctx.beginPath()
    ctx.moveTo(0, vector.pt2.y);
    ctx.lineTo(canvas.width, vector.pt2.y);
    ctx.stroke()
    ctx.closePath()
}

canvas.addEventListener("mousemove", e => {
    mouse.x = e.x - canvasBounds.x;
    mouse.y = e.y - canvasBounds.y;
})

canvas.addEventListener("mousedown", e => {
    canvasBounds = canvas.getBoundingClientRect();
    mouse.clicked = true;
    doesLineInterceptCircle({
        x: los.x,
        y: los.y
    }, {
        x: tbo.x,
        y: tbo.y
    }, {
        x: canvas.width / 2,
        y: canvas.height / 2
    }, 160)
    updateParameters()
    animate()
})

canvas.addEventListener("mouseup", e => {
    mouse.clicked = false;
    cancelAnimationFrame(draw)
    updateParameters()
})

showOS.addEventListener('change', e => {
    drawBoard()
});

showTGT.addEventListener('change', e => {
    drawBoard()
});

function degreesToRadians(deg) {
    return deg * Math.PI / 180;
}

function radiansToDegrees(rad) {
    return rad * 180 / Math.PI;
}

let moboard = new Moboard()

function drawBoard() {
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    ctx.fillStyle = 'lightgrey'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawLOS(brg)
    moboard.numbers()
    moboard.draw();
    vector.update();
    vector2.update();
    if (showOS.checked) {
        vector.draw()
        drawOpenCloseLine()
        drawLeftRight()
    }
    if (showTGT.checked) {
        vector2.draw()
    }
}
drawBoard()

function animate() {
    drawBoard()
    updateParameters()
    draw = requestAnimationFrame(animate)
}