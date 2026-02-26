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
  
  STATES = {
    ALERT: 'alert',
    WALK: 'walk',
    PREPARE: 'prepare',
    ATTACK: 'attack',
    HURT: 'hurt',
    DEAD: 'dead'
  };

  currentState = 'alert';

  hp = 100;
  otherDirection = false;
  hitCount = 0;
  isWalkingSoundPlaying = false;
  isAttacking = false;
  lastAttackTime = 0;
  attackCooldownMin = 2000; 
  attackCooldownMax = 6000; 
  jumpAttackForce = 30; 
  nextAttackTime = 0;
  attackSpeedX = 0;
  isPreparingAttack = false;
  prepareDuration = 600;


  constructor() {
    super();
    this.initImages();
    this.initStats();
    this.x = 2500;
    this.y = 100;
    this.width = 360;
    this.height = 360;
    this.speed = 0.5 + Math.random() * 0.5;
    this.leftBoundary = 0;
    this.rightBoundary = this.world?.level?.level_end_x - this.width;
    this.turnAroundOffset = 5;
    this.applyGravity();
  }
  
  initImages() {
    this.loadImage(this.imagesAlert[0]);
    this.loadImages(this.imagesWalking);
    this.loadImages(this.imagesAlert);
    this.loadImages(this.imagesAttack);
    this.loadImages(this.imagesHurt);
    this.loadImages(this.imagesDead);
  }

  initStats() {
    this.hp = 100;
    this.hitCount = 0;
    this.damageCooldownMs = 600;
    this.defaultHitDamage = 34;
  }

  
  setState(newState) {
    this.currentState = newState;
  }
  
  selectAnimation() {
    if (this.isDead()) return this.imagesDead;
    if (this.isHurt()) return this.imagesHurt;
    if (this.isPreparingAttack) return this.imagesAlert;
    if (this.isAttacking) return this.imagesAttack;
    return this.hitCount >= 1 ? this.imagesWalking : this.imagesAlert;
  }

  startAnimation() {
  if (this.animationInterval || this.moveInterval) return;
  if (!window.gameStarted || window.gameOver) return;
  this.animationInterval = setInterval(() => {
    if (window.gamePaused || (!window.gameStarted && !window.gameEnding)) return;
    this.playAnimation(this.selectAnimation());
  }, 200);

  this.moveInterval = setInterval(() => {
    if (window.gamePaused || (!window.gameStarted && !window.gameEnding)) return;
    if (this.isDead() || this.isHurt()) return this.handleDeadState() || this.handleHurtState();
    if (this.canAttack() && !this.isAttacking && !this.isPreparingAttack)
        return this.prepareAttack();
    this.handleAttackMovement();
    if (!this.isAttacking) this.handleWalking();
    }, 1000/60);
  }
  
  handleWalking() {
    if (this.hitCount < 1 || this.isPreparingAttack) {
      this.stopWalkingSound();
      return;
    }
    this.walkBetweenBoundaries();
    this.startWalkingSound();
  }

  handleAttackMovement() {
    if (!this.isAttacking) return;
    const dir = this.otherDirection ? 1 : -1;
    this.x += this.attackSpeedX * dir;
    if (!this.checkAboveGround()) this.finishAttack();
  }

  startWalkingSound() {
    this.ensureWalkingSound();
  }

  stopWalkingSound() {
    if (this.isWalkingSoundPlaying) {
        window.audioManager.stop('endbossWalking');
        this.isWalkingSoundPlaying = false;
    }
  }
  
  ensureWalkingSound() {
    this.ensureWalkingSoundStopped();
  }

  ensureWalkingSoundStopped() {
    if (this.isWalkingSoundPlaying) {
      window.audioManager.stop('endbossWalking');
      this.isWalkingSoundPlaying = false;
    }
  }
  
  handleHurtState() {
    if (this.isHurt()) this.stopWalkingSound();
  }

  handleDeadState() {
    if (this.isDead()) this.stopWalkingSound();
  }

  canAttack() {
    return Date.now() > this.nextAttackTime;
  }

  computeAttackCooldown() {
    return this.attackCooldownMin +
      Math.random() * (this.attackCooldownMax - this.attackCooldownMin);
  }

  setNextAttackTime() {
    this.nextAttackTime = Date.now() + this.computeAttackCooldown();
  }

  applyAttackJump() {
    this.speedY = this.jumpAttackForce;
  }

  computeAttackSpeedX() {
    this.attackSpeedX = this.speed * (2.5 + Math.random());
  }

  startAttack() {
    this.isAttacking = true;
    this.lastAttackTime = Date.now();
    this.setNextAttackTime();
    this.applyAttackJump();
    this.computeAttackSpeedX();
  } 

  finishAttack() {
    this.isAttacking = false;
    this.attackSpeedX = 0;
  
    this.speed += 0.1 + Math.random() * 0.2;
  }
  
  prepareAttack() {
    this.isPreparingAttack = true;
    this.stopWalkingSound();
    this.attackSpeedX = 0;
    setTimeout(() => {
      if (!this.isDead()) {
        this.isPreparingAttack = false;
        this.startAttack();
      }
    }, this.prepareDuration);
  }
  
  stop() {
    super.stop();

    window.audioManager.stop('endbossWalking');
    this.isWalkingSoundPlaying = false;

    this.isAttacking = false;
    this.isPreparingAttack = false;
  }
  
}