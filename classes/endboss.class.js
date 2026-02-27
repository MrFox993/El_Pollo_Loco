/**
 * Represents the end boss enemy with multiple states (alert, walk, prepare, attack, hurt, dead),
 * animations, and a jump-attack behavior. The end boss patrols, prepares and performs attacks with
 * randomized cooldowns, reacts to damage (hurt/dead), and integrates with a global audio manager
 * to play/stop walking sounds. Movement and animations pause when the game is paused or ended.
 *
 * Extends MovableObject, which provides gravity, movement helpers, and animation playback.
 *
 * @class Endboss
 * @extends MovableObject
 */

/**
 * @typedef {'alert'|'walk'|'prepare'|'attack'|'hurt'|'dead'} EndbossState
 */
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

  /**
   * Constructs the Endboss, initializes images and stats, sets up position, size,
   * movement parameters, and applies gravity. World boundaries are derived from
   * level settings if available.
   *
   * @constructor
   * @param {Object} [options]
   * @param {number} [options.defaultHitDamage] - Damage the boss takes per hit (lower = tougher).
   * @param {number} [options.speed] - Base walking speed (higher = faster).
   * @param {number} [options.speedMultiplier] - Multiplier applied to the random base speed if speed is not provided.
   */
  constructor(options = {}) {
    super();
    this.initImages();
    this.initStats();
    this.x = 2500;
    this.y = 130;
    this.width = 360;
    this.height = 360;
    this.offset = { 
      top: 100, 
      bottom: 50, 
      left: 50, 
      right: 70 
    };
    this.baseSpeed = 0.5 + Math.random() * 0.5;
    this.speed = options.speed ?? this.baseSpeed;
    if (options.speedMultiplier && options.speed == null) { this.speed = this.baseSpeed * options.speedMultiplier };
    if (typeof options.defaultHitDamage === 'number') { this.defaultHitDamage = options.defaultHitDamage };
    this.leftBoundary = 0;
    this.rightBoundary = this.world?.level?.level_end_x - this.width;
    this.turnAroundOffset = 5;
    this.applyGravity();
  }
  
  /**
   * Preloads all animation image sets and sets the initial image for the alert state.
   *
   * @returns {void}
   */
  initImages() {
    this.loadImage(this.imagesAlert[0]);
    this.loadImages(this.imagesWalking);
    this.loadImages(this.imagesAlert);
    this.loadImages(this.imagesAttack);
    this.loadImages(this.imagesHurt);
    this.loadImages(this.imagesDead);
  }

  /**
   * Initializes combat stats and damage parameters.
   *
   * @returns {void}
   */
  initStats() {
    this.hp = 100;
    this.hitCount = 0;
    this.damageCooldownMs = 600;
    this.defaultHitDamage = 34;
  }

  /**
   * Sets the boss's current high-level state (for external control if needed).
   *
   * @param {EndbossState} newState - The state to assign.
   * @returns {void}
   */
  setState(newState) {
    this.currentState = newState;
  }
  
  /**
   * Chooses the appropriate animation sequence based on current conditions:
   * - Dead > Hurt > Preparing (alert frames) > Attacking > Walking (if engaged) > Alert.
   *
   * @returns {string[]} The image sequence for the current animation.
   */
  selectAnimation() {
    if (this.isDead()) return this.imagesDead;
    if (this.isHurt()) return this.imagesHurt;
    if (this.isPreparingAttack) return this.imagesAlert;
    if (this.isAttacking) return this.imagesAttack;
    return this.hitCount >= 1 ? this.imagesWalking : this.imagesAlert;
  }

  /**
   * Starts the animation and movement loops, if not already running and if the game is active.
   * - Animation loop: updates frames every 200 ms using selectAnimation.
   * - Movement loop: 60 FPS; handles dead/hurt states, attack preparation/execution, and walking.
   * Respects global pause and end-game flags on each tick.
   *
   * @returns {void}
   */
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
  
  /**
   * Handles patrol movement and walking audio while the boss is in a walking-capable state.
   * Stops walking sound if not eligible to walk (e.g., before first hit or while preparing).
   *
   * @returns {void}
   */
  handleWalking() {
    if (this.hitCount < 1 || this.isPreparingAttack) {
      this.stopWalkingSound();
      return;
    }
    this.walkBetweenBoundaries();
    this.startWalkingSound();
  }

  /**
   * Updates boss position during an attack. Moves horizontally at attackSpeedX in the current
   * facing direction. If the boss lands (no longer above ground), the attack is finished.
   *
   * @returns {void}
   */
  handleAttackMovement() {
    if (!this.isAttacking) return;
    const dir = this.otherDirection ? 1 : -1;
    this.x += this.attackSpeedX * dir;
    if (!this.checkAboveGround()) this.finishAttack();
  }

  /**
   * Ensures walking sound is started if appropriate. Delegates to ensureWalkingSound.
   *
   * @returns {void}
   */
  startWalkingSound() {
    this.ensureWalkingSound();
  }

  /**
   * Stops the end boss walking sound if it is currently playing, and updates the flag.
   *
   * @returns {void}
   */
  stopWalkingSound() {
    if (this.isWalkingSoundPlaying) {
        window.audioManager.stop('endbossWalking');
        this.isWalkingSoundPlaying = false;
    }
  }
  
  /**
   * Ensures the correct walking sound state. Currently implemented to ensure the sound is stopped.
   * Can be extended to start the sound conditionally.
   *
   * @returns {void}
   */
  ensureWalkingSound() {
    this.ensureWalkingSoundStopped();
  }

  /**
   * Helper to stop the walking sound if it's playing.
   *
   * @returns {void}
   */
  ensureWalkingSoundStopped() {
    if (this.isWalkingSoundPlaying) {
      window.audioManager.stop('endbossWalking');
      this.isWalkingSoundPlaying = false;
    }
  }
  
  /**
   * Handles actions necessary while in the hurt state (e.g., stopping walking sound).
   *
   * @returns {void}
   */
  handleHurtState() {
    if (this.isHurt()) this.stopWalkingSound();
  }

  /**
   * Handles actions necessary while in the dead state (e.g., stopping walking sound).
   *
   * @returns {void}
   */
  handleDeadState() {
    if (this.isDead()) this.stopWalkingSound();
  }

  /**
   * Checks whether the boss is eligible to start a new attack based on its cooldown timer.
   *
   * @returns {boolean} True if a new attack can start now.
   */
  canAttack() {
    return Date.now() > this.nextAttackTime;
  }

  /**
   * Computes a randomized attack cooldown within the configured min/max bounds.
   *
   * @returns {number} Milliseconds until the next attack can start.
   */
  computeAttackCooldown() {
    return this.attackCooldownMin +
      Math.random() * (this.attackCooldownMax - this.attackCooldownMin);
  }

  /**
   * Sets the next allowable attack time based on a newly computed cooldown.
   *
   * @returns {void}
   */
  setNextAttackTime() {
    this.nextAttackTime = Date.now() + this.computeAttackCooldown();
  }

  /**
   * Applies the vertical jump component of the attack by setting the vertical speed.
   *
   * @returns {void}
   */
  applyAttackJump() {
    this.speedY = this.jumpAttackForce;
  }

  /**
   * Computes and sets the horizontal speed used during the attack movement.
   *
   * @returns {void}
   */
  computeAttackSpeedX() {
    this.attackSpeedX = this.speed * (2.5 + Math.random());
  }

  /**
   * Initiates the attack: flags attacking state, records the time, schedules the next attack,
   * applies the jump impulse, and computes horizontal speed for the attack.
   *
   * @returns {void}
   */
  startAttack() {
    this.isAttacking = true;
    this.lastAttackTime = Date.now();
    this.setNextAttackTime();
    this.applyAttackJump();
    this.computeAttackSpeedX();
  } 

  /**
   * Finishes the current attack: clears attacking flags, resets horizontal attack speed,
   * and slightly increases base speed to ramp difficulty.
   *
   * @returns {void}
   */
  finishAttack() {
    this.isAttacking = false;
    this.attackSpeedX = 0;
  
    this.speed += 0.1 + Math.random() * 0.2;
  }
  
  /**
   * Enters a short preparation phase before attacking: stops walking sound,
   * zeroes horizontal attack speed, and after prepareDuration triggers startAttack
   * unless the boss has died in the meantime.
   *
   * @returns {void}
   */
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
  
  /**
   * Stops all boss activity by delegating to the base class and stopping walking sound.
   * Resets attack and preparation flags to cease ongoing behaviors.
   *
   * @returns {void}
   */
  stop() {
    super.stop();

    window.audioManager.stop('endbossWalking');
    this.isWalkingSoundPlaying = false;

    this.isAttacking = false;
    this.isPreparingAttack = false;
  }
  
}