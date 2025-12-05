
class Level {
    enemies = [];
    endboss = null;
    clouds = [];
    backgroundObjects = [];
    bottles = [];
    coins = [];
    bgImgStartingX = -719;
    level_end_x = 5750;

    constructor({ enemies = [], endboss = null, clouds = [], backgroundObject1 = [], backgroundObject2 = [], bottles = [], coins = [] }) {
        this.enemies = enemies;
        this.endboss = endboss;
        this.clouds = clouds;
        this.bottles = bottles;
        this.coins = coins;
        this.backgroundObjects = [];
        this.generateBackgroundObjects(backgroundObject1, backgroundObject2);
    }


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
