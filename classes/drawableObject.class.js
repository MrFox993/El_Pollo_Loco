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
    offset = { top: 0, bottom: 0, left: 0, right: 0 };

    /**
     * Draws the object on the provided canvas context.
     *
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    getBounds() {
        const off = this.offset || { top:0, bottom:0, left:0, right:0 };
        return {
            left:   this.x + off.left,
            right:  this.x + this.width  - off.right,
            top:    this.y + off.top,
            bottom: this.y + this.height - off.bottom
        };
    }

    setOffset(top=0, right=0, bottom=0, left=0) {
        this.offset = { top, right, bottom, left };
    }

    /**
     * Draws the hitbox frame for debugging.
     * Only for characters, chickens, endboss, bottles, and coins.
     *
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    drawFrame(ctx) {
        const isDebuggable =
            this instanceof Character ||
            this instanceof ChickenSmall ||
            this instanceof ChickenBig ||
            this instanceof Endboss ||
            this instanceof Bottle ||
            this instanceof Coin;

        if (!isDebuggable) return;

        const b = this.getBounds();
        ctx.beginPath();
        ctx.rect(b.left, b.top, b.right - b.left, b.bottom - b.top);
        ctx.stroke();
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

    drawWithOrientation(ctx) {
        if (this.otherDirection) {
            ctx.save();
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.translate(-this.x, -this.y);
        }

        this.draw(ctx);

        if (this.otherDirection) {
            ctx.restore();
        }
    }
}