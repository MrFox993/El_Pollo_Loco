/**
 * Represents a small chicken enemy that patrols horizontally between boundaries
 * and plays a walking animation. The small chicken has randomized starting
 * position and speed, and stops/pauses its animation and movement according to
 * global game state flags.
 *
 * Extends MovableObject, which provides movement helpers and animation playback.
 *
 * @class ChickenSmall
 * @extends MovableObject
 */
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

  /**
   * Creates a new small chicken enemy, initializes position, size, boundaries,
   * randomizes speed and x-position, and preloads walking and dead animations.
   *
   * @constructor
   */
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

  /**
   * Starts the walking animation and movement loops for the small chicken.
   * Does nothing if the loops are already running or if the game hasn't started
   * or is over. Respects pause and game-ending flags during each tick.
   *
   * Behavior:
   * - Animation loop: plays walking frames at ~2 FPS.
   * - Movement loop: calls walkBetweenBoundaries at ~60 FPS.
   *
   * @returns {void}
   */
  startAnimation() {
    if (this.animationInterval || this.moveInterval) return;
    if (!window.gameStarted || window.gameOver) return;

    this.animationInterval = setInterval(() => {
      if (window.gamePaused || (!window.gameStarted && !window.gameEnding)) return;
      this.playAnimation(this.imagesSmallChickenWalking);
    }, 1000 / 2);
    this.moveInterval = setInterval(() => {
      if (window.gamePaused || (!window.gameStarted && !window.gameEnding)) return;
      this.walkBetweenBoundaries();
    }, 1000 / 60);
  }
}

/**
 * Represents a large chicken enemy that patrols horizontally between boundaries
 * and plays a walking animation. The big chicken has randomized starting
 * position and speed (generally faster than small chicken), and stops/pauses
 * its animation and movement according to global game state flags.
 *
 * Extends MovableObject, which provides movement helpers and animation playback.
 *
 * @class ChickenBig
 * @extends MovableObject
 */
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

  /**
   * Creates a new big chicken enemy, initializes position, size, boundaries,
   * randomizes speed and x-position, and preloads walking and dead animations.
   *
   * @constructor
   */
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

  /**
   * Starts the walking animation and movement loops for the big chicken.
   * Does nothing if the loops are already running or if the game hasn't started
   * or is over. Respects pause and game-ending flags during each tick.
   *
   * Behavior:
   * - Animation loop: plays walking frames at ~2 FPS.
   * - Movement loop: calls walkBetweenBoundaries at ~60 FPS.
   *
   * @returns {void}
   */
  startAnimation() {
    if (this.animationInterval || this.moveInterval) return;
    if (!window.gameStarted || window.gameOver) return;

    this. animationInterval = setInterval(() => {
      if (window.gamePaused || (!window.gameStarted && !window.gameEnding)) return;
      this.playAnimation(this.imagesBigChickenWalking);
    }, 1000 / 2);
    this. moveInterval = setInterval(() => {
      if (window.gamePaused || (!window.gameStarted && !window.gameEnding)) return;
      this.walkBetweenBoundaries();
    }, 1000 / 60);
  }
}