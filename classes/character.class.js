class Character extends MovableObject {

    constructor() {
        super();
        this.loadImage('../assets/img/2_character_pepe/1_idle/idle/I-1.png');
        this.x = 100;
        this.y = 200;
        this.width = 150;
        this.height = 250;
    }

    jump() {
        console.log('Jumping');
    }
}