class MovableObject {
  x;
  y;
  img;
  imageCache = {};
  currentImageIndex = 0;
  speed = 0.15;
  otherDirection = false;

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
    setInterval(() => {
      this.x += this.speed;
    }, 1000 / 60);
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }

  playAnimation(images) {
    let index = this.currentImageIndex % images.length;
    let imagePath = images[index];
    this.img = this.imageCache[imagePath];
    this.currentImageIndex++;
  }
}
