class ChickenSmall extends MovableObject {
  imagesSmallChickenWalking = [
    "./assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "./assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "./assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  imagesSmallChickenDead = [
    "./assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png"
  ]
  speed = 0.5;

  constructor() {
    super();
    this.x = 500 + Math.random() * 600; // Random x position
    this.y = 370;
    this.width = 60;
    this.height = 60;
    this.speed = 0.15 + Math.random() * 0.5;
    this.loadImage("./assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.imagesSmallChickenWalking);
    this.loadImages(this.imagesSmallChickenDead)
  }

  startAnimation() {
    if (!gameStarted) return;
    if (gameOver) return;
    setInterval(() => {
      this.playAnimation(this.imagesSmallChickenWalking);
    }, 1000 / 2);
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }
}
