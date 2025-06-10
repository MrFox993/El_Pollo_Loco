class Character extends MovableObject {
  imagesIdle = [
    "./assets/img/2_character_pepe/1_idle/idle/I-1.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-2.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-3.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-4.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-5.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-6.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-7.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-8.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-9.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-10.png",
  ];
  imagesWalking = [
    "./assets/img/2_character_pepe/2_walk/W-21.png",
    "./assets/img/2_character_pepe/2_walk/W-22.png",
    "./assets/img/2_character_pepe/2_walk/W-23.png",
    "./assets/img/2_character_pepe/2_walk/W-24.png",
    "./assets/img/2_character_pepe/2_walk/W-25.png",
    "./assets/img/2_character_pepe/2_walk/W-26.png",
  ];
  world;
  speed = 10;

  constructor() {
    super();
    this.x = 100;
    this.y = 130;
    this.width = 150;
    this.height = 300;
    this.loadImage("./assets/img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.imagesIdle);
    this.loadImages(this.imagesWalking);
  }

  animate() {
    setInterval(() => {
      if (this.world.keyboard.right && this.x <= this.world.level.level_end_x) {
        this.x += this.speed;
        this.otherDirection = false;
      } else if (this.world.keyboard.left && this.x >= 0) {
        this.x -= this.speed;
        this.otherDirection = true;
      }
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    setInterval(() => {
      if (this.world.keyboard.right || this.world.keyboard.left) {
        let index = this.currentImageIndex % this.imagesWalking.length;
        let imagePath = this.imagesWalking[index];
        this.img = this.imageCache[imagePath];
        this.currentImageIndex++;
      } else {
        let index = this.currentImageIndex % this.imagesIdle.length;
        let imagePath = this.imagesIdle[index];
        this.img = this.imageCache[imagePath];
        this.currentImageIndex++;
      }
    }, 50);
  }

  jump() {
    console.log("Jumping");
  }
}
