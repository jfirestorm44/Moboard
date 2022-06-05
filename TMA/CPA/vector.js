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
        let tbo;
        brg <= 180 ? tbo = brg + 180 : tbo = brg - 180 
        let dx = this.pt1.x - this.pt2.x;
        let dy = this.pt1.y - this.pt2.y;
        let theta = Math.atan2(dy, dx);
        theta -= Math.PI / 2;
        theta *= 180 / Math.PI;
        if (theta < 0) theta += 360;
        if (theta >= 180) {
            this.vNum == 1 ? this.crs = brg - this.lla : this.crs = tbo + this.lla
        }
        if (theta < 180) {
            this.vNum === 1 ? this.crs = brg + this.lla : this.crs = tbo - this.lla
        }
        if (this.crs < 0) {
            this.crs = 360 + this.crs
        }
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
let vector = new Vector(300, 300, 'blue', 1)
let vector2 = new Vector(550, 300, 'red', 2)