class Endboss extends MovableObject {
  imagesWalking = [
    "./assets/img/4_enemie_boss_chicken/1_walk/G1.png",
    "./assets/img/4_enemie_boss_chicken/1_walk/G2.png",
    "./assets/img/4_enemie_boss_chicken/1_walk/G3.png",
    "./assets/img/4_enemie_boss_chicken/1_walk/G4.png",
  ]
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
  imagesAttack = [
    "./assets/img/4_enemie_boss_chicken/3_attack/G13.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G14.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G15.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G16.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G17.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G18.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G19.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G20.png"
  ]
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

  hp = 100;
  otherDirection = false;
  hitCount = 0;
  isWalkingSoundPlaying = false;
  isAttacking = false;
  lastAttackTime = 0;
  attackCooldownMin = 2000; 
  attackCooldownMax = 6000; 
  jumpAttackForce = 40; 
  nextAttackTime = 0;
  attackSpeedX = 0;


  constructor() {
    super();
    this.loadImage(this.imagesAlert[0]);
    this.loadImages(this.imagesWalking);
    this.loadImages(this.imagesAlert);
    this.loadImages(this.imagesAttack);
    this.loadImages(this.imagesHurt);
    this.loadImages(this.imagesDead);
    this.x = 2500;
    this.y = 100;
    this.width = 360;
    this.height = 360;
    this.speed = 0.5 + Math.random() * 0.5;
    this.damageCooldownMs = 600;
    this.defaultHitDamage = 34;
    this.applyGravity();
  }

  startAnimation() {
    if (!gameStarted) return;
    if (gameOver) return;
    setInterval(() => {
        if (this.isDead()) {
            this.playAnimation(this.imagesDead);
        } else if (this.isHurt()) {
            this.playAnimation(this.imagesHurt);
        } else if (this.isAttacking) {
          this.playAnimation(this.imagesAttack);
        } else {
          if (this.hitCount >= 1) {
            this.playAnimation(this.imagesWalking);
          }else {
          this.playAnimation(this.imagesAlert);
          }
        }
    }, 200);
    setInterval(() => {
      if (this.isDead() || this.isHurt()) {
        this.stopWalkingSound();
        return;
      }
    
      if (this.hitCount < 1) {
        this.stopWalkingSound();
        return;
      }
    
      if (!this.isAttacking && this.canAttack()) {
        this.startAttack();
        return;
      }
    
      if (this.isAttacking) {
        this.x -= this.attackSpeedX;
        if (!this.checkAboveGround()) {
          this.finishAttack();
        }
        return;
      }
    
      this.moveLeft();
      this.startWalkingSound();
    
    }, 1000 / 60);
    
  }

  startWalkingSound() {
    if (!this.isWalkingSoundPlaying) {
        window.audioManager.play('endbossWalking');
        this.isWalkingSoundPlaying = true;
    }
  }

  stopWalkingSound() {
    if (this.isWalkingSoundPlaying) {
        window.audioManager.stop('endbossWalking');
        this.isWalkingSoundPlaying = false;
    }
  }

  canAttack() {
    return Date.now() > this.nextAttackTime;
  }

  startAttack() {
    this.isAttacking = true;
    this.lastAttackTime = Date.now();
  
    const cooldown =
      this.attackCooldownMin +
      Math.random() * (this.attackCooldownMax - this.attackCooldownMin);
  
    this.nextAttackTime = Date.now() + cooldown;
  
    this.stopWalkingSound();
  
    this.speedY = this.jumpAttackForce;
    this.attackSpeedX = this.speed * 3; 
  }

  finishAttack() {
    this.isAttacking = false;
    this.attackSpeedX = 0;
  
    this.speed += 0.1 + Math.random() * 0.2;
  }
  
  
}