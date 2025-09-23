class DrawableObject {
    imageCache = {};
    currentImageIndex = 0;
    img;
    x;
    y;

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

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
}