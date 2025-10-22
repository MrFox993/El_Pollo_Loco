class Coin extends CollectableObject {
    constructor() {
        super();
        this.loadImage('./assets/img/8_coin/coin_1.png');
        this.height = 120;
        this.width = 100;
        this.y = this.placeObjectYRandomly();
        this.x = this.placeObjectXRandomly();
    }
}