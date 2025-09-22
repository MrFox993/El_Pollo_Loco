class MovableObject {
  x;
  y;
  img;
  imageCache = {};
  currentImageIndex = 0;
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

  loadImage(imagePath) {
    this.img = new Image();
    this.img.src = imagePath;
  }

  loadImages(array) {
    array.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
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

  playAnimation(images) {
    let index = this.currentImageIndex % images.length;
    let imagePath = images[index];
    this.img = this.imageCache[imagePath];
    this.currentImageIndex++;
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
    return this.y < 130;
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
