class Character extends MovableObject {
    imagesIdle = [
        '../assets/img/2_character_pepe/1_idle/idle/I-1.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-2.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-3.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-4.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-5.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-6.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-7.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-8.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-9.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-10.png'
    ];
    world;

    constructor() {
        super();
        this.x = 0;
        this.y = 130;
        this.width = 150;
        this.height = 300;
        this.speed = 1;
        this.loadImage('../assets/img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.imagesIdle);
        this.animate();
    }

    animate() {
            setInterval(() => {
                let index = this.currentImageIndex % this.imagesIdle.length;
                let imagePath = this.imagesIdle[index];
                this.img = this.imageCache[imagePath];
                this.currentImageIndex++;    
            }, 1000 / 4); 
    }

    jump() {
        console.log('Jumping');
    }
}