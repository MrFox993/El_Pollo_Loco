/**
 * Represents a throwable object (salsa bottle) with rotation and splash animations.
 * When thrown, it moves horizontally in a given direction and vertically under gravity.
 * On impact (e.g., hitting ground or enemy), it plays a splash animation and marks itself for removal.
 *
 * Extends MovableObject for gravity and animation utilities.
 *
 * @class ThrowableObject
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    /**
     * Creates a new throwable bottle at the specified position and direction,
     * preloading rotation and splash image sets, and immediately starts its throw behavior.
     *
     * @param {number} x - Initial X position.
     * @param {number} y - Initial Y position.
     * @param {'left'|'right'} [direction='right'] - Horizontal throw direction.
     * @param {string[]} rotationImages - Image paths for the rotation animation.
     * @param {string[]} splashImages - Image paths for the splash (impact) animation.
     */
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
        this.hasSplashed = false;
        this.direction = direction || 'right';
        this.throw();
    }

    /**
     * Starts the throw behavior:
     * - Applies an initial upward velocity and starts gravity.
     * - Moves horizontally in the specified direction at a constant rate.
     * - Plays rotation animation at a fixed interval.
     *
     * @returns {void}
     */
    throw () {
        this.speedY = 30;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            if (window.gamePaused || (!window.gameStarted && !window.gameEnding)) return;
            if (this.direction === 'left') {
                    this.x -= 10;
                } else {
                    this.x += 10;
                }
        }, 25);
        
        this.rotationInterval = setInterval(() => {
            if (window.gamePaused || (!window.gameStarted && !window.gameEnding)) return;
            this.playAnimation(this.imagesBottleRotation);
        }, 100);
    } 

    /**
     * Stops the ongoing throw and rotation intervals.
     *
     * @returns {void}
     */
    stopThrow() {
        clearInterval(this.throwInterval);
        clearInterval(this.rotationInterval);
    }

    /**
     * Plays the splash animation once and then marks the object for removal after a short delay.
     * Subsequent calls are ignored if splash has already been played.
     *
     * @returns {void}
     */
    playSplashAnimation() {
        if (this.hasSplashed) return;
        this.hasSplashed = true;
        let splashInterval = setInterval(() => {
            if (window.gamePaused || (!window.gameStarted && !window.gameEnding)) return;
            this.playAnimation(this.imagesBottleSplash);
        }, 100);
        
        setTimeout(() => {
                clearInterval(splashInterval);
                this.markForRemoval = true;
            }, 500);
    }
}