/**
 * Represents the main game world, managing rendering, physics, collisions,
 * camera movement, game progress, and interactions between all game objects.
 */
class World {
  character = new Character();
  backgroundImages_1;
  backgroundImages_2;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  cameraTargetX = 0;
  healthStatusBar = new StatusBar("health");
  bottleStatusBar = new StatusBar("bottle");
  coinStatusBar = new StatusBar("coins");
  throwableObjects = [];
  canThrow = true;

/**
   * Creates a new World instance.
   *
   * @param {HTMLCanvasElement} canvas - The game's main rendering canvas.
   * @param {Keyboard} keyboard - The global keyboard input handler.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.collisionManager = new CollisionManager(this);
    this.cameraController = new CameraController(this);
    this.renderer = new WorldRenderer(this);
    this.gameStateManager = new GameStateManager(this);

    this.pauseIcon = new Image();
    this.pauseIcon.src = getSvgPauseIcon();
  }

/**
   * Starts the world by applying world reference to the character,
   * starting render loops, and initializing enemy animations.
   */
  startWorld() {
    window.gameEnding = false
    this.setWorld();
    this.draw();
    this.level.enemies.forEach(enemy => enemy.startAnimation());
    if (this.level.endboss) this.level.endboss.startAnimation();
  }

/**
   * Injects world reference into the character and starts its animation logic.
   */
  setWorld() {
    this.character.world = this;
    if (this.level?.endboss) {
      this.level.endboss.world = this;
    }
    this.character.animate();
  }

/**
 * Calls the collision check of the collisionManager class.
 */
  checkCollisions() {
    this.collisionManager.checkAll();
  }

/**
   * Starts the main game logic loop (collision checks, throws, status updates).
   */
  run() {
    this.intervalId = setInterval(() => {
      if (!gameStarted || gamePaused) return;
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkEndbossStatusBar();
      this.checkGameOver();
    }, 200);
  }

/**
   * Stops all world update intervals.
   */
  stop() {
    clearInterval(this.intervalId)
  }

/**
   * Determines whether an enemy is still valid (not dead or already removed).
   *
   * @param {MovableObject} enemy - The enemy to check.
   * @returns {boolean} True if enemy can still be interacted with.
   */
  isEnemyValid(enemy) {
      return !(enemy.isDead && enemy.isDead());
  }

/**
   * Handles the visual and logical removal of an enemy after being killed.
   *
   * @param {MovableObject} enemy - The enemy to kill.
   */
  killEnemy(enemy, index) {
      const deadImages = enemy.imagesSmallChickenDead || enemy.imagesDead || enemy.imagesDying;
      enemy.playDeadAnimation(deadImages, ()=> {
          const idx = this.level.enemies.indexOf(enemy);
          if (idx >= 0) this.level.enemies.splice(idx,1);
      });
  }

/**
   * Handles bottle hitting an enemy: kill enemy, play SFX, trigger splash.
   *
   * @param {ThrowableObject} bottle - The thrown bottle.
   * @param {MovableObject} enemy - The impacted enemy.
   */
  handleBottleHit(bottle, enemy) {
      this.killEnemy(enemy);
      if (!bottle.hasSfxPlayed) {
          window.audioManager.play('bottleShatter');
          bottle.hasSfxPlayed = true;
      }
      bottle.playSplashAnimation();
  }

/**
   * Handles bottle throwing logic, cooldown, and bottle spawning.
   */
  checkThrowObjects() {
    if (this.keyboard.c && this.character.bottles > 0 && this.canThrow) {
      this.canThrow = false;
      let direction = this.character.otherDirection ? 'left' : 'right';

      let bottle = new ThrowableObject(
        this.character.x + (this.character.width / 2),
        this.character.y + (this.character.height / 2),
        direction,
        Bottle.imagesBottleRotation,
        Bottle.imagesBottleSplash
      );

      if (direction === 'left') {
        bottle.otherDirection = true;
      }

      this.throwableObjects.push(bottle);
      this.character.bottles--;
      this.bottleStatusBar.setBottleBarPercentage(this.character.bottles);
    }
    if (!this.keyboard.c) {
      this.canThrow = true;
    }
  }

/**
   * Initializes the endboss health bar once the character reaches its zone.
   */
  checkEndbossStatusBar() {
    if (!this.endbossStatusBar && this.character.x >= 1800) {
        this.endbossStatusBar = new StatusBar("endboss", this.canvas.width);
    }
  }

  /**
   * The main rendering loop. Draws everything and updates world state.
   */
  draw() {
    if (!this.shouldDrawFrame()) return;
    this.renderer.render();
    if (this.shouldUpdateGameLogic()) this.updateGameLogic();
    requestAnimationFrame(() => this.draw());
  }

  /**
   * Returns true if the scene should be drawn (game in playable state).
   * @returns {boolean}
   */
  shouldDrawFrame() {
    return window.gameStarted || window.gameEnding;
  }

  /**
   * Returns true if the game logic should be updated this frame.
   * @returns {boolean}
   */
  shouldUpdateGameLogic() {
    return !window.gamePaused && !window.gameEnding;
  }

  /**
   * Calls all per-frame game logic updates.
   */
  updateGameLogic() {
    this.character.update();
    this.cameraController.update();
    this.checkCollisions();
    this.checkThrowObjects();
    this.checkEndbossStatusBar();
    this.gameStateManager.checkGameOver();
  }

}