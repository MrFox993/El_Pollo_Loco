/**
 * @typedef {'idle'|'long_idle'|'walk'|'jump'|'hurt'|'dead'} CharacterState
 */

/**
 * Represents the player character "Pepe" with movement, animation, and idle behavior.
 * Handles keyboard-driven movement, state transitions, and corresponding animations and sounds.
 * 
 * Responsibilities:
 * - Manage character state (idle, long idle, walk, jump, hurt, dead).
 * - Play appropriate animations based on current state and inputs.
 * - Handle idle timing to trigger long idle behavior (snoring).
 * - Integrate with a global audio manager for sound effects.
 * - Apply gravity and movement within world boundaries.
 * 
 * Extends MovableObject, which provides core movement and animation utilities.
 * 
 * @class Character
 * @extends MovableObject
 */
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
  
  STATES = {
    IDLE: 'idle',
    LONG_IDLE: 'long_idle',
    WALK: 'walk',
    JUMP: 'jump',
    HURT: 'hurt',
    DEAD: 'dead'
  };

  currentState = 'idle';

  world;
  speed = 5;
  offset = {
    top: 160,
    bottom: 20,
    left: 50,
    right: 50,
  }
  lastActiveAt = Date.now();
  isLongIdling = false;
  longIdleThresholdMs = 15000; 

  /**
   * Creates a new Character instance, initializes position, size, inventory counters,
   * preloads animations, and enables gravity.
   */
  constructor() {
    super();
    this.x = 100;
    this.y = 130;
    this.width = 150;
    this.height = 300;
    this.bottles = 0;
    this.coins = 0;
    this.loadImage(this.imagesIdle[0]);
    this.loadImages(this.imagesIdle);
    this.loadImages(this.imagesLongIdle);
    this.loadImages(this.imagesWalking);
    this.loadImages(this.imagesJumping);
    this.loadImages(this.imagesDead);
    this.loadImages(this.imagesHurt);
    this.applyGravity();
  }

  /**
   * Sets the current character state.
   * 
   * @param {CharacterState} state - The new state to set.
   * @returns {void}
   */
  setState(state) {
    this.currentState = state;
  }
  
  /**
   * Updates the character's state flags based on current conditions.
   * Priority order: dead > hurt > jumping > long idle > walking > idle.
   * 
   * @returns {void}
   */
  updateStateFlags() {
    if (this.isDead()) return this.setState(this.STATES.DEAD);
    if (this.isHurt()) return this.setState(this.STATES.HURT);
    if (this.checkAboveGround()) return this.setState(this.STATES.JUMP);
    if (this.isLongIdling) return this.setState(this.STATES.LONG_IDLE);
    if (this.world.keyboard.right || this.world.keyboard.left)
      return this.setState(this.STATES.WALK);
    this.setState(this.STATES.IDLE);
  }
  
  /**
   * Determines the animation frame set appropriate for the current state and inputs.
   * 
   * @returns {string[]} The array of image paths for the animation to play.
   */
  getAnimationForState() {
    if (this.isDead()) return this.imagesDead;
    if (this.isHurt()) return this.imagesHurt;
    if (this.checkAboveGround()) return this.imagesJumping;
    if (this.world.keyboard.right || this.world.keyboard.left) return this.imagesWalking;
    if (this.isLongIdling) return this.imagesLongIdle;
    return this.imagesIdle;
  }

  /**
   * Resets the idle timer, marking the character as recently active.
   * Also clears long idle state if it was active.
   * 
   * @returns {void}
   */
  resetIdleTimer() {
    this.lastActiveAt = Date.now();
    if (this.isLongIdling) {
      this.isLongIdling = false;
    }
  }

  /**
   * Starts the character's animation loop if not already running and the game is active.
   * Plays the appropriate animation frames and manages snoring sound during long idle.
   * 
   * Preconditions:
   * - Will not start if game is not started or is over.
   * - Skips updates while the game is paused.
   * 
   * @returns {void}
   */
  animate() {    
    if (this.animationInterval) return; 
    if (!window.gameStarted || window.gameOver) return;

    this.animationInterval = setInterval(() => {
      if (window.gamePaused || (!window.gameStarted && !window.gameEnding)) return;

      const animation = this.getAnimationForState();
      this.playAnimation(animation);

      if (this.isSnoringPlaying && !this.isLongIdling) {
        window.audioManager.stop('snoring');
        this.isSnoringPlaying = false;
      }

      if (this.isLongIdling && !this.isSnoringPlaying) {
        window.audioManager.play('snoring');
        this.isSnoringPlaying = true;
      }
    }, 100);
  }

  /**
   * Stops the character, including base class timers and related sounds.
   * Specifically stops walking and snoring audio, and resets sound flags.
   * 
   * @returns {void}
   */
  stop() {
    super.stop();
  
    window.audioManager.stop('walking');
    window.audioManager.stop('snoring');
  
    this.isWalkingSoundPlaying = false;
    this.isSnoringPlaying = false;
  }  

  /**
   * Updates the idle timing and determines whether the long idle state should be active.
   * If an action occurred, resets the timer and disables long idle.
   * Otherwise, compares elapsed idle time against the long idle threshold.
   * 
   * @param {boolean} didAction - Whether the character performed an action this frame.
   * @returns {void}
   */
  updateIdleTimer(didAction) {
    if (didAction) {
      this.isLongIdling = false;
      this.lastActiveAt = Date.now();
      return;
    }
    const idleMs = Date.now() - this.lastActiveAt;
    this.isLongIdling = idleMs >= this.longIdleThresholdMs;
  }

  /**
   * Per-frame update handler. Processes input for movement and jumping,
   * respects world boundaries, and updates idle timing based on activity.
   * 
   * Actions:
   * - Move right/left if corresponding keys are pressed and within bounds.
   * - Jump if up or space is pressed and character is on the ground.
   * - Update idle timer indicating whether any action occurred.
   * 
   * @returns {void}
   */
  update() {
    let didAction = false;

    if (this.world.keyboard.right && this.x <= (this.world.level.level_end_x - this.width)) {
      this.otherDirection = false;
      this.moveRight();
      didAction = true;
    }

    if (this.world.keyboard.left && this.x >= 0) {
      this.otherDirection = true;
      this.moveLeft();
      didAction = true;
    }

    if ((this.world.keyboard.up || this.world.keyboard.space) && !this.checkAboveGround()) {
      this.jump();
      didAction = true;
    }

    this.updateIdleTimer(didAction);
  }  
}