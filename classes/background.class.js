/**
 * Represents a background image object fixed in position but part of the parallax scrolling world.
 * Extends MovableObject.
 */
class BackgroundObject extends MovableObject{
    height = 480;
    width = 720;

    /**
     * Creates a new BackgroundObject instance.
     *
     * @param {string} imagePath - Path to the background image.
     * @param {number} [x=0] - Initial horizontal position of the object.
     */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.x = x || 0;
        this.y = 480 - this.height;
    }
}