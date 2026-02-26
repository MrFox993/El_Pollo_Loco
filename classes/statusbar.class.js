/**
 * Heads-up display (HUD) status bar for different game metrics:
 * - Player health
 * - Bottle count
 * - Coin count
 * - Endboss health
 *
 * Selects the appropriate image set and maps the given percentage/index to an image.
 * For health and endboss health, percentages (0–100) are internally mapped to a 0–5 index.
 * For bottles and coins, the numeric value is mapped to a display index via resolveImageIndex.
 *
 * Extends DrawableObject, which provides image loading and drawing functionalities.
 *
 * @class StatusBar
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
    imagesHealthBar = [
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
    ];
    imagesBootleBar = [
        "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png",
        "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
        "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
        "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
        "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
        "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    ];
    imagesCoinBar = [
        "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
        "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
        "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
        "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
        "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
        "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
    ];
    imagesEndbossHealthBar = [
        "./assets/img/7_statusbars/2_statusbar_endboss/green/green100.png",
        "./assets/img/7_statusbars/2_statusbar_endboss/green/green80.png",
        "./assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
        "./assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
        "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
        "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
    ];
    healthBarPercentage = 100;
    endbossHealthBarPercentage = 100;
    bottleBarPercentage = 0;
    coinBarPercentage = 0;

    /**
     * Creates a status bar for the given type, positions it on the canvas,
     * and preloads the corresponding images. Initializes its displayed percentage.
     *
     * @param {'health'|'bottle'|'coins'|'endboss'} type - The status bar type to create.
     * @param {number} [canvasWidth] - Canvas width, required for positioning the endboss bar on the right.
     */
    constructor(type, canvasWidth){
        super();
        this.width = 200;
        this.height = 60;
        this.x = type === 'endboss' ? canvasWidth - this.width - 20 : 20;
        this.y = this.getYByType(type);
        this.images = this.getImagesByType(type);
        this.loadImages(this.images);
        this.initPercentageByType(type);
    }

    /**
     * Resolves vertical position (y) based on the status bar type.
     *
     * @param {'health'|'bottle'|'coins'|'endboss'} type - Status bar type.
     * @returns {number} Y-coordinate for the status bar.
     */
    getYByType(type) {
        if (type == 'health') return 0;
        if (type == 'bottle') return 50;
        if (type == 'coins') return 100;
        if (type == 'endboss') return 0;
    }

    /**
     * Returns the image set corresponding to the provided type.
     *
     * @param {'health'|'bottle'|'coins'|'endboss'} type - Status bar type.
     * @returns {string[]} Array of image paths for the bar's levels.
     */
    getImagesByType(type) {
        if (type == 'health') return this.imagesHealthBar;
        if (type == 'bottle') return this.imagesBootleBar;
        if (type == 'coins') return this.imagesCoinBar;
        if (type == 'endboss') return this.imagesEndbossHealthBar;
    }

    /**
     * Initializes the displayed percentage for the given type.
     *
     * @param {'health'|'bottle'|'coins'|'endboss'} type - Status bar type.
     * @returns {void}
     */
    initPercentageByType(type) {
        if (type == 'health') this.setHealthBarPercentage(100);
        if (type == 'bottle') this.setBottleBarPercentage(0);
        if (type == 'coins') this.setCoinBarPercentage(0);
        if (type == 'endboss') this.setEndbossHealthBarPercentage(100);
    }

    /**
     * Maps a health percentage (0–100) to a 0–5 index for image selection.
     *
     * @param {number} healthPercentage - Health percentage between 0 and 100.
     * @returns {number} Index between 0 and 5 for the health bar image set.
     */
    mapHealthToIndex(healthPercentage) {
        let index = Math.floor(healthPercentage / 20);
        return index;
    }

    /**
     * Updates the health bar image based on the given percentage (0–100).
     *
     * @param {number} percentage - Health percentage.
     * @returns {void}
     */
    setHealthBarPercentage(percentage) {
        this.healthBarPercentage = this.mapHealthToIndex(percentage);
        let path = this.imagesHealthBar[this.resolveImageIndex(this.healthBarPercentage)];
        this.img = this.imageCache[path];
    }

    /**
     * Updates the bottle bar image based on the given value.
     * The provided value is mapped to an index via resolveImageIndex.
     *
     * @param {number} percentage - Bottle count or percentage-like value.
     * @returns {void}
     */
    setBottleBarPercentage(percentage) {
        this.bottleBarPercentage = percentage;
        let path = this.imagesBootleBar[this.resolveImageIndex(percentage)];
        this.img = this.imageCache[path];
    }

    /**
     * Updates the coin bar image based on the given value.
     * The provided value is mapped to an index via resolveImageIndex.
     *
     * @param {number} percentage - Coin count or percentage-like value.
     * @returns {void}
     */
    setCoinBarPercentage(percentage) {
        this.coinBarPercentage = percentage;
        let path = this.imagesCoinBar[this.resolveImageIndex(percentage)];
        this.img = this.imageCache[path];
    }

    /**
     * Updates the endboss health bar image based on the given percentage (0–100),
     * internally mapped to a 0–5 index.
     *
     * @param {number} percentage - Endboss health percentage.
     * @returns {void}
     */
    setEndbossHealthBarPercentage(percentage) {
        this.endbossHealthBarPercentage = this.mapHealthToIndex(percentage);
        let path = this.imagesEndbossHealthBar[this.resolveImageIndex(this.endbossHealthBarPercentage)];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves a provided value into an index for selecting the appropriate bar image.
     * Mapping:
     * - >= 5 -> index 0 (100%)
     * - 4 -> index 1 (80%)
     * - 3 -> index 2 (60%)
     * - 2 -> index 3 (40%)
     * - 1 -> index 4 (20%)
     * - 0 or less -> index 5 (0%)
     *
     * @param {number} ObjectPercentage - Value to map to a display index.
     * @returns {number} Index between 0 and 5.
     */
    resolveImageIndex(ObjectPercentage) {
    if (ObjectPercentage >= 5) {
            return 0;
        } else if (ObjectPercentage === 4) {
            return 1;
        } else if (ObjectPercentage === 3) {
            return 2;
        } else if (ObjectPercentage === 2) {
            return 3;
        } else if (ObjectPercentage === 1) {
            return 4;
        } else {
            return 5;
        }
    }
}