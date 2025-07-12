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
}
