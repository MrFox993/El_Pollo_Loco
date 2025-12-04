class CollectableObject extends DrawableObject {
    offset = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
    };

    constructor() {
        super();
    }

    placeObjectXRandomly() {
        return this.x = 400 + Math.random() * 2000; // Random x position between 400 and 2400
    }

    placeObjectYRandomly() {
        return this.y = 100 + Math.random() * 200; // Random x position between 100 and 700
    }
}