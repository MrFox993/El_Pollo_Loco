class ThrowableObject extends MovableObject {
    constructor (x, y, direction) {
        super();
        this.loadImage('assets/img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 80;
        this.width = 60;
        this.direction = direction || 'right';
        this.throw();
    }


    throw () {
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
        if (this.direction === 'left') {
                    this.x -= 10;
                } else {
                    this.x += 10;
                }
        }, 25);
    } 
}