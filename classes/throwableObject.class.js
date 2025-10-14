class ThrowableObject extends MovableObject {
    constructor () {
        super();
        this.loadImage('assets/img/6_salsa_bottle/salsa_bottle.png');
        this.x = 200;
        this.y = 350;
        this.height = 80;
        this.width = 60;
        this.throw(200, 350);
    }


    throw (x, y) {
        this.x = x;
        this.y = y;
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 25);
    } 
}