/**
 * Represents a collectible coin placed at a random location.
 * Extends CollectableObject.
 */
class Coin extends CollectableObject {
    offset = { top: 10, bottom: 10, left: 10, right: 10 };
    /**
     * Creates a new Coin instance at random X/Y coordinates.
     */
    constructor() {
        super();
        this.loadImage('./assets/img/8_coin/coin_1.png');
        this.height = 120;
        this.width = 100;
        this.y = this.placeObjectYRandomly();
        this.x = this.placeObjectXRandomly();
    }
}