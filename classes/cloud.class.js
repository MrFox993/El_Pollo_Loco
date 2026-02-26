/**
 * Represents a cloud object that moves slowly to the left.
 * Extends MovableObject.
 */
class Cloud extends MovableObject {
    y = 10 
    width = 500;
    height = 300;
    
    /**
     * Creates a new Cloud instance with random X position.
     */
    constructor() {
        super();
        this.loadImage('./assets/img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 700;
        this.speed = 0.15;
        this.animate();
    }

    /**
     * Starts the cloud animation (moving left continuously).
     */
    animate() {
        this.moveLeft();
    }
}