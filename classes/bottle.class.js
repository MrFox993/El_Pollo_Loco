class Bottle extends CollectableObject {
    constructor() {
        super();
        this.loadImage('assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.height = 80;
        this.width = 60;
        this.y = 350;
        this.x = this.placeObjectRandomly();
    }
}