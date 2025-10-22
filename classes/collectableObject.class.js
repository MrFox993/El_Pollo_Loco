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
        return this.x = 200 + Math.random() * 3000; // Random x position between 200 and 3200
    }
}