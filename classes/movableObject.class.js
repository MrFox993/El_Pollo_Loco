class MovableObject {
    x;
    y;
    img;
    imageCache = {};

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

    moveLeft() {
        console.log('Moving left');
    }
}