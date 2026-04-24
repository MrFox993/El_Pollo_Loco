/**
 * Represents a complete world level including all objects required.
 */
class Level {
    /** @type {Object[]} */ enemies = [];
    /** @type {Object|null} */ endboss = null;
    /** @type {Cloud[]} */ clouds = [];
    /** @type {BackgroundObject[]} */ backgroundObjects = [];
    /** @type {Bottle[]} */ bottles = [];
    /** @type {Coin[]} */ coins = [];

    /**
     * X starting point for background image repeating.
     * @type {number}
     */
    bgImgStartingX = -719;
    /**
     * World end coordinate.
     * @type {number}
     */
    level_end_x = 2800;

    /**
     * Creates a new Level instance with all required objects.
     *
     * @param {Object} config - Level configuration object.
     * @param {Object[]} [config.enemies=[]] - List of enemy objects.
     * @param {Object|null} [config.endboss=null] - The endboss instance.
     * @param {Cloud[]} [config.clouds=[]] - Clouds in the level.
     * @param {string[]} [config.backgroundObject1=[]] - First repeating background image set.
     * @param {string[]} [config.backgroundObject2=[]] - Second repeating background image set.
     * @param {Bottle[]} [config.bottles=[]] - Bottles placed in the level.
     * @param {Coin[]} [config.coins=[]] - Coins placed in the level.
     */
    constructor({ enemies = [], endboss = null, clouds = [], backgroundObject1 = [], backgroundObject2 = [], bottles = [], coins = [] }) {
        this.enemies = enemies;
        this.endboss = endboss;
        this.clouds = clouds;
        this.bottles = bottles;
        this.coins = coins;
        this.backgroundObjects = [];
        this.generateBackgroundObjects(backgroundObject1, backgroundObject2);
    }

    /**
     * Generates alternating background objects along the level length.
     *
     * @param {string[]} backgroundObject1 - First image set.
     * @param {string[]} backgroundObject2 - Second image set.
     */
    generateBackgroundObjects(backgroundObject1, backgroundObject2) {
        if (!backgroundObject1.length || !backgroundObject2.length) return;
        const repetitions = 10;
        const segmentWidth = 719;
        let currentX = this.bgImgStartingX;

        for (let i = 0; i < repetitions; i++) {
            const imageSet = i % 2 === 0 ? backgroundObject1 : backgroundObject2;
            for (let img of imageSet) {
                this.backgroundObjects.push(new BackgroundObject(img, currentX));
            }
            currentX += segmentWidth;
        }
    }
}
