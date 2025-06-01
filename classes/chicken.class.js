class Chicken extends MovableObject{

    constructor() {
        super();
        this.loadImage('../assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.x = 300 + Math.random() * 400; // Random x position
        this.y = 370 
        this.width = 60;
        this.height = 60;
    }

}