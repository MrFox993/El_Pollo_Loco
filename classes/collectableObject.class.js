/**
 * Base class for all collectible world objects (coins, bottles, etc.).
 * Extends DrawableObject.
 */
class CollectableObject extends DrawableObject {
    /**
     * Collision offset to shrink or expand the hitbox.
     * @type {{top:number, bottom:number, left:number, right:number}}
     */
    offset = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
    };

    constructor() {
        super();
    }

    /**
     * Places the object at a random X-coordinate in the world.
     *
     * @returns {number} The generated X position.
     */
    placeObjectXRandomly() {
        return this.x = 400 + Math.random() * 2000; 
    }

    /**
     * Places the object at a random Y-coordinate in the world.
     *
     * @returns {number} The generated Y position.
     */
    placeObjectYRandomly() {
        return this.y = 100 + Math.random() * 200;
    }
}