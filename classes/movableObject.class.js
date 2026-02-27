/**
 * Base class for all movable, drawable game entities.
 * Provides horizontal and vertical movement, gravity simulation,
 * collision detection, animation playback helpers, damage/health handling,
 * and lifecycle controls for intervals/timeouts.
 *
 * Extends DrawableObject (which is expected to provide image loading, caching,
 * currentImageIndex, and drawing capabilities).
 *
 * @class MovableObject
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2;
  hp = 100;
  lastHit = 0;
  damageCooldownMs = 500;
  defaultHitDamage = 20;

  /**
   * Plays an animation by advancing to the next image in the provided array.
   * Uses currentImageIndex to cycle through frames and pulls images from the cache.
   *
   * @param {string[]} images - Array of image paths representing animation frames.
   * @returns {void}
   */
  playAnimation(images) {
    let index = this.currentImageIndex % images.length;
    let imagePath = images[index];
    this.img = this.imageCache[imagePath];
    this.currentImageIndex++;
  }
  
  /**
   * Starts a death animation loop: stops movement speed, resets frame index,
   * and repeatedly plays the given images until externally cleared.
   *
   * Skips frame updates when the game is paused or not in the active/ending state.
   *
   * @param {string[]} images - Array of image paths for the death animation.
   * @returns {number} The interval ID for the death animation loop.
   */
  startDeathAnimation(images) {
      this.speed = 0;
      this.currentImageIndex = 0;
      return setInterval(() => {
          if (window.gamePaused || (!window.gameStarted && !window.gameEnding)) return;
          this.playAnimation(images);
      }, 100);
  }

  /**
   * Finishes a death animation by clearing its interval and optionally invoking
   * a removal callback (e.g., to remove the object from the world).
   *
   * @param {number} interval - The interval ID returned by startDeathAnimation.
   * @param {Function} [removeCallback] - Optional callback to run after clearing the interval.
   * @returns {void}
   */
  finishDeathAnimation(interval, removeCallback) {
      clearInterval(interval);
      if (removeCallback) removeCallback();
  }

  /**
   * Convenience method to play a short death animation then finalize it.
   * Starts the animation, waits a fixed duration, then clears the interval
   * and runs the optional removal callback.
   *
   * @param {string[]} imagesDeadArray - Frames to use for the death animation.
   * @param {Function} [removeCallback] - Optional callback to run after animation completes.
   * @returns {void}
   */
  playDeadAnimation(imagesDeadArray, removeCallback) {
    const interval = this.startDeathAnimation(imagesDeadArray);
    setTimeout(() => this.finishDeathAnimation(interval, removeCallback), 500);
  }

  /**
   * Checks axis-aligned bounding box collision with another movable object,
   * taking object-specific collision offsets into account.
   *
   * @param {MovableObject} mObject - The other object to test against.
   * @returns {boolean} True if bounding boxes overlap, else false.
   */
  isColliding(mObject) { 
    if (!mObject || typeof mObject.getBounds !== 'function') return false;
    const a = this.getBounds();
    const b = mObject.getBounds();
    return a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom;
  }

  /**
   * Checks whether a collision with another object occurred from above.
   * Requires horizontal overlap and that this object's top is above the other object's top
   * while moving downward (speedY < 0).
   *
   * @param {MovableObject} mObject - The other object to test against.
   * @returns {boolean} True if colliding from above, else false.
   */
  isCollidingFromTop(mObject) {
    if (!mObject || typeof mObject.getBounds !== 'function') return false;
    const a = this.getBounds();
    const b = mObject.getBounds();

    const isHorizontalOverlap = a.right > b.left && a.left < b.right;
    const isFromTop = a.bottom >= b.top && a.top < b.top;
    const isFalling = this.speedY < 0;
    const isAirborne = this.checkAboveGround();

    return isHorizontalOverlap && isFromTop && isFalling && isAirborne;
  }

  /**
   * Moves the object to the right by its horizontal speed.
   *
   * @returns {void}
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left by its horizontal speed.
   *
   * @returns {void}
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Determines if the object should turn to the left based on its current direction
   * and left boundary.
   *
   * @returns {boolean} True if the object should turn left.
   */
  shouldTurnLeft() {
      return !this.otherDirection && this.x <= this.leftBoundary;
  }

  /**
   * Determines if the object should turn to the right based on its current direction
   * and right boundary.
   *
   * @returns {boolean} True if the object should turn right.
   */
  shouldTurnRight() {
      return this.otherDirection && this.x >= this.rightBoundary;
  }

  /**
   * Applies walking movement according to current facing direction:
   * moves right if otherDirection is true, otherwise left.
   *
   * @returns {void}
   */
  applyWalkingDirection() {
      this.otherDirection ? this.moveRight() : this.moveLeft();
  }

  /**
   * Walks back and forth between left and right boundaries, turning around
   * when reaching either boundary.
   *
   * @returns {void}
   */
  walkBetweenBoundaries() {
    if (this.shouldTurnLeft()) this.otherDirection = true;
    if (this.shouldTurnRight()) this.otherDirection = false;
    this.applyWalkingDirection();
  }

  /**
   * Applies vertical movement and acceleration (gravity effect).
   * Moves the object by its vertical speed and decreases speedY by acceleration.
   *
   * @returns {void}
   */
  applyVerticalMovement() {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
  }

  /**
   * Determines whether gravity should be applied. Gravity is applied when the
   * object is above ground or currently moving upward (speedY > 0).
   *
   * @returns {boolean} True if gravity should be applied.
   */
  shouldApplyGravity() {
      return this.checkAboveGround() || this.speedY > 0;
  }

  /**
   * Starts a gravity loop that periodically updates vertical movement if needed.
   * Skips updates while the game is paused or not in an active state.
   *
   * @returns {void}
   */
  applyGravity() {
    this.gravityInterval = setInterval(() => {
        if (window.gamePaused || (!window.gameStarted && !window.gameEnding)) return;
        if (this.shouldApplyGravity()) this.applyVerticalMovement();
    }, 40);
  }

  /**
   * Stops the gravity interval loop.
   *
   * @returns {void}
   */
  stopGravity() {
    clearInterval(this.gravityInterval)
  }

  /**
   * Checks if the object is considered above the ground.
   * Special case: ThrowableObject instances are always treated as above ground.
   * Otherwise, compares y-position to a ground threshold (130).
   *
   * @returns {boolean} True if above ground, else false.
   */
  checkAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
    return this.y < 130;
    }
  }

  /**
   * Initiates a jump by setting vertical speed and playing a jump sound via audio manager.
   *
   * @returns {void}
   */
  jump() {
    this.speedY = 30;
    window.audioManager.play('jump');
  }

  /**
   * Applies damage to the object if not currently hurt (damage cooldown active).
   * Reduces HP by the given amount (defaulting to defaultHitDamage) and updates lastHit timestamp.
   * HP will not drop below zero.
   *
   * Skips damage when the game is paused or if the object is currently in hurt state.
   *
   * @param {number} [damage=this.defaultHitDamage] - Amount of damage to apply.
   * @returns {void}
   */
  hit(damage = this.defaultHitDamage) {
    if (window.gamePaused) return;
    if (this.isHurt()) return;

    this.hp -= damage;
    if (this.hp < 0) {
      this.hp = 0;
    }

    this.lastHit = new Date().getTime();
  }

  /**
   * Indicates whether the object is dead (HP is zero).
   *
   * @returns {boolean} True if dead, else false.
   */
  isDead() {
    return this.hp == 0;
  }

  /**
   * Indicates whether the object is currently in a hurt state based on the time
   * elapsed since lastHit and the damageCooldownMs threshold.
   *
   * @returns {boolean} True if within hurt cooldown window, else false.
   */
  isHurt() {
    let timePassedMs = new Date().getTime() - this.lastHit; 
    return timePassedMs < this.damageCooldownMs;
  }

  /**
   * Stops all ongoing intervals/timeouts related to movement and animation:
   * - animationInterval, moveInterval, gravityInterval, prepareTimeout (if defined),
   * and resets their references. Also resets vertical speed.
   *
   * @returns {void}
   */
  stop() {
    clearInterval(this.animationInterval);
    clearInterval(this.moveInterval);
    clearInterval(this.gravityInterval);
    clearTimeout(this.prepareTimeout);

    this.animationInterval = null;
    this.moveInterval = null;
    this.gravityInterval = null;
    this.prepareTimeout = null;

    this.speedY = 0;
  }
}
