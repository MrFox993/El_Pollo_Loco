class BackgroundObject extends MovableObject{
    height = 480;
    width = 720;

    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.x = x || 0;
        this.y = 480 - this.height;
    }
}