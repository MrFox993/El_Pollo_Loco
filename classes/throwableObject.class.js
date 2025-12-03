class ThrowableObject extends MovableObject {
    constructor (x, y, direction, rotationImages, splashImages) {
        super();
        this.loadImage('assets/img/6_salsa_bottle/salsa_bottle.png');
        this.imagesBottleRotation = rotationImages;
        this.imagesBottleSplash = splashImages;
        this.loadImages(this.imagesBottleRotation);
        this.loadImages(this.imagesBottleSplash);
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
        this.throwInterval = setInterval(() => {
        if (this.direction === 'left') {
                    this.x -= 10;
                } else {
                    this.x += 10;
                }
        }, 25);
        
        this.rotationInterval = setInterval(() => {
            this.playAnimation(this.imagesBottleRotation);
        }, 100);
    } 

    stopThrow() {
        clearInterval(this.throwInterval);
        clearInterval(this.rotationInterval);
    }

    playSplashAnimation() {
        let splashInterval = setInterval(() => {
            this.playAnimation(this.imagesBottleSplash);
        }, 100);
        
        setTimeout(() => {
                clearInterval(splashInterval);
                this.markForRemoval = true;
            }, 500);
    }
}