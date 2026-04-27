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

    this.pauseIcon = new Image();
    this.pauseIcon.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect x="15" y="0" width="20" height="80" fill="white"/><rect x="45" y="0" width="20" height="80" fill="white"/></svg>';
  }

/**
   * Starts the world by applying world reference to the character,
   * starting render loops, and initializing enemy animations.
   */
  startWorld() {
    window.gameEnding = false
    this.setWorld();
    this.draw();
    // this.run();
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
   * Checks if either the player or endboss died and triggers the game end.
   */
  checkGameOver() {
    if (this.character.isDead()) {
      this.endGame("lost");
    } else if (this.level.endboss && this.level.endboss.isDead()) {
      this.endGame("won");
    }
  }

/**
   * Plays the appropriate victory or defeat sound.
   *
   * @param {'won'|'lost'} result - The outcome of the game.
   */
  playEndSound(result) {
    window.audioManager.stopAll();
    window.audioManager.play(result === 'won' ? 'youWin':'gameOver');
  }

/**
   * Computes the delay before showing an end screen, based on animation length.
   *
   * @param {'won'|'lost'} result - The game outcome.
   * @returns {number} Delay in milliseconds.
   */
  computeEndDelay(result) {
    const charAnim = (this.character?.imagesDead?.length||0)*100;
    const bossAnim = (this.level.endboss?.imagesDead?.length||0)*200;
    const buffer = 400;
    return result==='lost' ? charAnim+buffer : bossAnim+buffer;
  }

/**
   * Displays the appropriate end screen and updates UI visibility.
   *
   * @param {'won'|'lost'} result - The game outcome.
   */
  showEndScreen(result) {
    window.gameStarted = false;
    window.gameEnding = false;
    window.gameOver = true;
    window.MobileUI.applyUIState();
    toggleScreen('.canvas-screen','hide');
    toggleScreen(result==='won'?'youWonScreen':'youLostScreen','show');
    if (result==='won') window.updateNextLevelButtonState?.();
  }

/**
   * Ends the game by triggering sounds, delaying animations,
   * and finally showing the end screen.
   *
   * @param {'won'|'lost'} result - The game outcome.
   */
  endGame(result) {
    window.gameEnding = true;
    this.playEndSound(result);
    const delay = this.computeEndDelay(result);
    setTimeout(() => this.showEndScreen(result), delay);
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
   * Draws the background layers (clouds, mountains, scenery).
   */
  drawBackground() {
      this.addObjectsToMap(this.level.backgroundObjects);
      this.addObjectsToMap(this.level.clouds);
  }

/**
   * Draws all gameplay objects such as enemies, coins, bottles, etc.
   */
  drawGameObjects() {
      this.addObjectsToMap(this.throwableObjects);
      this.addObjectsToMap(this.level.bottles);
      this.addObjectsToMap(this.level.coins);
      this.addObjectsToMap(this.level.enemies);
      this.addToMap(this.character);
      this.addToMap(this.level.endboss);
  }

/**
   * Draws all HUD elements (health, bottle, coin, endboss bars).
   */
  drawHUD() {
      this.addToMap(this.healthStatusBar);
      this.addToMap(this.coinStatusBar);
      this.addToMap(this.bottleStatusBar);
      if (this.endbossStatusBar) this.addToMap(this.endbossStatusBar);
  }

/**
   * Draws the semi-transparent pause overlay with pause icon.
   */
  drawPauseOverlay() {
      this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      const iconSize = 80;
      this.ctx.drawImage(this.pauseIcon,
          this.canvas.width/2 - iconSize/2,
          this.canvas.height/2 - iconSize/2,
          iconSize, iconSize);
  }

/**
   * The main rendering loop. Draws everything and updates world state.
   */
  draw() {
    if (!gameStarted) return;
    if (!window.gameStarted && !window.gameEnding) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);

    this.drawBackground();
    this.drawGameObjects();
    this.ctx.restore();

    this.drawHUD();
    if (gamePaused) this.drawPauseOverlay();

    if (!gamePaused && !window.gameEnding) {
        this.character.update();
        this.updateCamera();
        this.checkCollisions();
        this.checkThrowObjects();
        this.checkEndbossStatusBar();
        this.checkGameOver();
    }

    requestAnimationFrame(() => this.draw());
}

/**
   * Draws a single object onto the canvas, including horizontal flipping.
   *
   * @param {DrawableObject} mObject - The object to draw.
   */
  addToMap(mObject) {
    if (!mObject) return;
    if (mObject.otherDirection === true) {
      this.flipImage(mObject);
    }
    mObject.draw(this.ctx);
    // mObject.drawFrame(this.ctx);

    if (mObject.otherDirection) {
      this.flipImageBack(mObject);
    }
  }

/**
   * Draws an array of objects onto the canvas.
   *
   * @param {DrawableObject[]} objects - Objects to render.
   */
  addObjectsToMap(objects) {
    if (!Array.isArray(objects)) return;
    objects.forEach((obj) => {
      this.addToMap(obj);
    });
  }

/**
   * Flips a drawable object horizontally before drawing it.
   *
   * @param {DrawableObject} mObject - The object to flip.
   */
  flipImage(mObject) {
    this.ctx.save();
    this.ctx.translate(mObject.x + mObject.width, mObject.y);
    this.ctx.scale(-1, 1);
    this.ctx.translate(-mObject.x, -mObject.y);
  }
  

/**
   * Restores canvas state after horizontally flipping an image.
   */
  flipImageBack() {
    this.ctx.restore();
  }

/**
   * Computes the desired X position of the camera to follow the character.
   *
   * @returns {number} Desired camera X coordinate.
   */
  calculateDesiredCameraX() {
      const center = this.canvas.width/2;
      const dir = this.character.otherDirection ? -1 : 1;
      return -this.character.x + center - this.character.width/2 - dir*240;
  }

/**
   * Restricts camera movement to within world boundaries.
   *
   * @param {number} x - The desired camera position.
   * @returns {number} Clamped camera position.
   */
  clampCamera(x) {
      const minX = -(this.level.level_end_x - this.canvas.width);
      return Math.max(minX, Math.min(0, x));
  }

/**
   * Smoothly updates the camera position to follow the character.
   */
  updateCamera() {
    const desired = this.calculateDesiredCameraX();
    const lerp = (this.keyboard.left||this.keyboard.right) ? 0.08 : 0.05;
    this.camera_x += (desired - this.camera_x)*lerp;
    this.camera_x = this.clampCamera(this.camera_x);
  }
}