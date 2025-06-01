class MovableObject {
    x;
    y;
    img;

    loadImage(imagePath) {
        this.img = new Image();
        this.img.src = imagePath;
    }

    moveRight() {
        console.log('Moving right');
    }

    moveLeft() {
        console.log('Moving left');
    }
}