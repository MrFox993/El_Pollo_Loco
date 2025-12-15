class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2;
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }
  hp = 100;
  lastHit = 0;
  damageCooldownMs = 500;
  defaultHitDamage = 20;


  playAnimation(images) {
    let index = this.currentImageIndex % images.length;
    let imagePath = images[index];
    this.img = this.imageCache[imagePath];
    this.currentImageIndex++;
  }

  
  playDeadAnimation(imagesDeadArray, removeCallback) {
      this.speed = 0; 
      this.currentImageIndex = 0;
      let interval = setInterval(() => {
          this.playAnimation(imagesDeadArray);
      }, 1000 / 10);

      setTimeout(() => {
          clearInterval(interval);
          if (removeCallback) removeCallback();
      }, 500);
  }


  isColliding(mObject) {
    return (
      this.x + this.width - this.offset.right > mObject.x - mObject.offset.left &&
      this.x + this.offset.left < mObject.x + mObject.width - mObject.offset.right &&
      this.y + this.height - this.offset.bottom > mObject.y + mObject.offset.top &&
      this.y + this.offset.top < mObject.y + mObject.height - mObject.offset.bottom
    );
  }


  isCollidingFromTop(mObject) {
    const charBottom = this.y + this.height - this.offset.bottom;
    const charTop = this.y + this.offset.top;
    const enemyTop = mObject.y + mObject.offset.top;
    const enemyBottom = mObject.y + mObject.height - mObject.offset.bottom;

    const isHorizontalOverlap =
        this.x + this.width - this.offset.right > mObject.x - mObject.offset.left &&
        this.x + this.offset.left < mObject.x + mObject.width - mObject.offset.right;

    const isFromTop =
        charBottom >= enemyTop && charTop < enemyTop && this.speedY < 0;

    return isHorizontalOverlap && isFromTop;
  }



  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  walkBetweenBoundaries() {
    if (!this.otherDirection && this.x <= this.leftBoundary) {
      this.otherDirection = true;
    }
  
    if (this.otherDirection && this.x >= this.rightBoundary) {
      this.otherDirection = false;
    }
  
    if (this.otherDirection) {
      this.moveRight();
    } else {
      this.moveLeft();
    }
  }

  applyGravity() {
    this.gravityInterval = setInterval(() => {
        if (this.checkAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }
    }, 1000 / 25);
  }

  stopGravity() {
    clearInterval(this.gravityInterval)
  }

  checkAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
    return this.y < 130;
    }
  }

  jump() {
    this.speedY = 30;
    window.audioManager.play('jump');
  }

  hit(damage = this.defaultHitDamage) {
    if (this.isHurt()) return;

    this.hp -= damage;
    if (this.hp < 0) {
      this.hp = 0;
    }

    this.lastHit = new Date().getTime();
  }

  isDead() {
    return this.hp == 0;
  }

  isHurt() {
    let timePassedMs = new Date().getTime() - this.lastHit; 
    return timePassedMs < this.damageCooldownMs;
  }

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
