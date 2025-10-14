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


  playAnimation(images) {
    let index = this.currentImageIndex % images.length;
    let imagePath = images[index];
    this.img = this.imageCache[imagePath];
    this.currentImageIndex++;
  }

  isColliding(mObject) {
    return (
      this.x + this.width - this.offset.right > mObject.x - mObject.offset.left &&
      this.x + this.offset.left < mObject.x + mObject.width - mObject.offset.right &&
      this.y + this.height - this.offset.bottom > mObject.y + mObject.offset.top &&
      this.y + this.offset.top < mObject.y + mObject.height - mObject.offset.bottom
    );
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  applyGravity() {
    setInterval(() => {
        if (this.checkAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }
    }, 1000 / 25);
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
  }

  hit() {
    this.hp -= 5;
    if (this.hp < 0) {
      this.hp = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isDead() {
    return this.hp == 0;
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // difference in ms
    timepassed = timepassed / 1000; // difference in s
    return timepassed < 0.5;
  }
}
