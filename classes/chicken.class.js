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
  imagesDead = this.imagesSmallChickenDead;

  constructor() {
    super();
    this.x = 500 + Math.random() * 600; 
    this.y = 370;
    this.width = 60;
    this.height = 60;
    this.speed = 0.15 + Math.random() * 0.5;
    this.leftBoundary = 0;
    this.rightBoundary = this.world?.level?.level_end_x - this.width;
    this.loadImage("./assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.imagesSmallChickenWalking);
    this.loadImages(this.imagesSmallChickenDead)
  }

  startAnimation() {
    if (this.animationInterval || this.moveInterval) return;
    if (!window.gameStarted || window.gameOver) return;

    this.animationInterval = setInterval(() => {
      if (!window.gameStarted || window.gamePaused || window.gameOver) return;
      this.playAnimation(this.imagesSmallChickenWalking);
    }, 1000 / 2);
    this.moveInterval = setInterval(() => {
      if (!window.gameStarted || window.gamePaused || window.gameOver) return;
      this.walkBetweenBoundaries();
    }, 1000 / 60);
  }
}

class ChickenBig extends MovableObject {
  imagesBigChickenWalking = [
    "./assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "./assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "./assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  imagesBigChickenDead = [
    "./assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png"
  ]
  speed = 0.5;
  imagesDead = this.imagesBigChickenDead;

  constructor() {
    super();
    this.x = 650 + Math.random() * 600; 
    this.y = 370;
    this.width = 60;
    this.height = 60;
    this.speed = 0.25 + Math.random() * 0.5;
    this.leftBoundary = 0;
    this.rightBoundary = this.world?.level?.level_end_x - this.width;
    this.loadImage("./assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.imagesBigChickenWalking);
    this.loadImages(this.imagesBigChickenDead)
  }

  startAnimation() {
    if (this.animationInterval || this.moveInterval) return;
    if (!window.gameStarted || window.gameOver) return;

    this. animationInterval = setInterval(() => {
      if (!window.gameStarted || window.gamePaused || window.gameOver) return;
      this.playAnimation(this.imagesBigChickenWalking);
    }, 1000 / 2);
    this. moveInterval = setInterval(() => {
      if (!window.gameStarted || window.gamePaused || window.gameOver) return;
      this.walkBetweenBoundaries();
    }, 1000 / 60);
  }
}
