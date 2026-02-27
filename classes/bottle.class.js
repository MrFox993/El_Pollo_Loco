/**
 * Represents a collectible salsa bottle object.
 * Includes rotation and splash animations.
 * Extends CollectableObject.
 */
class Bottle extends CollectableObject {
    offset = { top: 20, bottom: 20, left: 15, right: 15 };
    /**
     * Paths used for the bottle rotation animation.
     * @type {string[]}
     */
    static imagesBottleRotation = [
        './assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    /**
     * Paths used for the bottle splash animation.
     * @type {string[]}
     */
    static imagesBottleSplash = [
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png'
    ];

    /**
     * Creates a new Bottle instance at a random position.
     */
    constructor() {
        super();
        this.loadImage('assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.height = 80;
        this.width = 60;
        this.y = 350;
        this.x = this.placeObjectXRandomly();
    }
}