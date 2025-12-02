class Endboss extends MovableObject {
  imagesWalking = [
    "./assets/img/4_enemie_boss_chicken/1_walk/G1.png",
    "./assets/img/4_enemie_boss_chicken/1_walk/G2.png",
    "./assets/img/4_enemie_boss_chicken/1_walk/G3.png",
    "./assets/img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
  imagesAlert = [
    "./assets/img/4_enemie_boss_chicken/2_alert/G5.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G6.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G7.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G8.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G9.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G10.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G11.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G12.png",
  ];
  imagesHurt = [
    "./assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "./assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "./assets/img/4_enemie_boss_chicken/4_hurt/G23.png"
  ]
  imagesDead = [
    "./assets/img/4_enemie_boss_chicken/5_dead/G24.png",
    "./assets/img/4_enemie_boss_chicken/5_dead/G25.png",
    "./assets/img/4_enemie_boss_chicken/5_dead/G26.png"
  ]

  hp = 60;
  otherDirection = false;

  constructor() {
    super();
    this.loadImage(this.imagesAlert[0]);
    this.loadImages(this.imagesAlert);
    this.loadImages(this.imagesHurt);
    this.loadImages(this.imagesDead);
    this.x = 2500;
    this.y = 100;
    this.width = 360;
    this.height = 360;
    // this.animate();
  }

  startAnimation() {
    if (!gameStarted) return;
    if (gameOver) return;
    setInterval(() => {
        if (this.isDead()) {
            this.playAnimation(this.imagesDead);
        } else if (this.isHurt()) {
            this.playAnimation(this.imagesHurt);
        } else {
            this.playAnimation(this.imagesAlert);
        }
    }, 100);
  }
}
