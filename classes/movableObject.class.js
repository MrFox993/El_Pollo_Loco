class MovableObject {
    x;
    y;
    img;
    imageCache = {};
    currentImageIndex = 0;

    loadImage(imagePath) {
        this.img = new Image();
        this.img.src = imagePath;
    }

    loadImages(array) {
        array.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    moveRight() {
        console.log('Moving right');
    }

    moveLeft(speed) {
        setInterval(() => {
            this.x -= speed;
        }, 1000 / 60);
        console.log('Moving left');
    }
}