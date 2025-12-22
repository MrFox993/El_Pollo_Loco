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
  imagesLongIdle = [
    "./assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-20.png"
  ];
  imagesWalking = [
    "./assets/img/2_character_pepe/2_walk/W-21.png",
    "./assets/img/2_character_pepe/2_walk/W-22.png",
    "./assets/img/2_character_pepe/2_walk/W-23.png",
    "./assets/img/2_character_pepe/2_walk/W-24.png",
    "./assets/img/2_character_pepe/2_walk/W-25.png",
    "./assets/img/2_character_pepe/2_walk/W-26.png",
  ];
  imagesJumping = [
    "./assets/img/2_character_pepe/3_jump/J-31.png",
    "./assets/img/2_character_pepe/3_jump/J-32.png",
    "./assets/img/2_character_pepe/3_jump/J-33.png",
    "./assets/img/2_character_pepe/3_jump/J-34.png",
    "./assets/img/2_character_pepe/3_jump/J-35.png",
    "./assets/img/2_character_pepe/3_jump/J-36.png",
    "./assets/img/2_character_pepe/3_jump/J-37.png",
    "./assets/img/2_character_pepe/3_jump/J-38.png",
    "./assets/img/2_character_pepe/3_jump/J-39.png",
  ];
  imagesDead = [
    "./assets/img/2_character_pepe/5_dead/D-51.png",
    "./assets/img/2_character_pepe/5_dead/D-52.png",
    "./assets/img/2_character_pepe/5_dead/D-53.png",
    "./assets/img/2_character_pepe/5_dead/D-54.png",
    "./assets/img/2_character_pepe/5_dead/D-55.png",
    "./assets/img/2_character_pepe/5_dead/D-56.png",
    "./assets/img/2_character_pepe/5_dead/D-57.png",
    ];
  imagesHurt = [
    "./assets/img/2_character_pepe/4_hurt/H-41.png",
    "./assets/img/2_character_pepe/4_hurt/H-42.png",
    "./assets/img/2_character_pepe/4_hurt/H-43.png",
  ]  

  world;
  speed = 10;
  offset = {
    top: 120,
    bottom: 20,
    left: 30,
    right: 30,
  }
  lastActiveAt = Date.now();
  isLongIdling = false;
  longIdleThresholdMs = 15000; 


  constructor() {
    super();
    this.x = 100;
    this.y = 130;
    this.width = 150;
    this.height = 300;
    this.bottles = 0;
    this.coins = 0;
    this.loadImage("./assets/img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.imagesIdle);
    this.loadImages(this.imagesLongIdle);
    this.loadImages(this.imagesWalking);
    this.loadImages(this.imagesJumping);
    this.loadImages(this.imagesDead);
    this.loadImages(this.imagesHurt);
    this.applyGravity();
  }

  resetIdleTimer() {
    this.lastActiveAt = Date.now();
    if (this.isLongIdling) {
      this.isLongIdling = false;
    }
  }

  animate() {    
    if (this.animationInterval) return; 
    if (!window.gameStarted || window.gameOver) return;
    this.animationInterval = setInterval(() => {
      if (!window.gameStarted || window.gamePaused || window.gameOver) return;

      if (this.isDead()) {
        this.isLongIdling = false;
        this.playAnimation(this.imagesDead);
      } else if (this.isHurt()){
        this.isLongIdling = false;
        this.playAnimation(this.imagesHurt);
        window.audioManager.play('hpLost');
      } else if (this.checkAboveGround()) {
        this.isLongIdling = false;
        this.playAnimation(this.imagesJumping);
      } else if (this.world.keyboard.right || this.world.keyboard.left) {
        this.isLongIdling = false;
        this.playAnimation(this.imagesWalking);
      } else {
        const idleDurationMs = Date.now() - this.lastActiveAt;
        if (idleDurationMs >= this.longIdleThresholdMs) {
            this.isLongIdling = true;
            this.playAnimation(this.imagesLongIdle);
            if (!this.isSnoringPlaying) {
                window.audioManager.play('snoring');
                this.isSnoringPlaying = true;
              }
    }else {
          this.isLongIdling = false;
          this.playAnimation(this.imagesIdle);
          if (this.isSnoringPlaying) {
              window.audioManager.stop('snoring');
              this.isSnoringPlaying = false;
            }
        }
      }
    }, 100);
  }

  stop() {
    super.stop();
  
    window.audioManager.stop('walking');
    window.audioManager.stop('snoring');
  
    this.isWalkingSoundPlaying = false;
    this.isSnoringPlaying = false;
  }  

  update() {
    let didAction = false;
  
    if (this.world.keyboard.right && this.x <= this.world.level.level_end_x) {
      this.otherDirection = false;
      this.moveRight();
      didAction = true;
    } 
    else if (this.world.keyboard.left && this.x >= 0) {
      this.otherDirection = true;
      this.moveLeft();
      didAction = true;
    }
  
    if ((this.world.keyboard.up || this.world.keyboard.space) && !this.checkAboveGround()) {
      this.jump();
      didAction = true;
    }
  
    if (didAction) this.resetIdleTimer();
  }  
}
