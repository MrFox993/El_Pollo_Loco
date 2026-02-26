/**
 * Base class for drawable objects that can be rendered on the canvas.
 */
class DrawableObject {
    /**
     * Cache storing already-loaded images.
     * @type {Object.<string, HTMLImageElement>}
     */
    imageCache = {};
    /**
     * Index of the current image in an animation sequence.
     * @type {number}
     */
    currentImageIndex = 0;
    /** @type {HTMLImageElement} */
    img;
    /** @type {number} */
    x;
    /** @type {number} */
    y;

    /**
     * Draws the object on the provided canvas context.
     *
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws the hitbox frame for debugging.
     * Only for characters, chickens, endboss, bottles, and coins.
     *
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof ChickenSmall || this instanceof Endboss || this instanceof Bottle || this instanceof Coin) {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    /**
     * Loads a single image into the object.
     *
     * @param {string} imagePath - Path to the image file.
     */
    loadImage(imagePath) {
        this.img = new Image();
        this.img.src = imagePath;
    }
    
    /**
     * Loads multiple images and stores them in the image cache.
     *
     * @param {string[]} array - List of file paths.
     */
    loadImages(array) {
        array.forEach((path) => {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
        });
    }
}