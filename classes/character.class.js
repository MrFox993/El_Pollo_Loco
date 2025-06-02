class Character extends MovableObject {

    constructor() {
        super();
        this.loadImage('../assets/img/2_character_pepe/1_idle/idle/I-1.png');
        this.x = 0;
        this.y = 130;
        this.width = 150;
        this.height = 300;
    }

    jump() {
        console.log('Jumping');
    }
}