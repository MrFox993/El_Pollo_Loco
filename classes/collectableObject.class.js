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

    placeObjectRandomly() {
        return this.x = 400 + Math.random() * 2000; // Random x position between 400 and 2400
    }
}