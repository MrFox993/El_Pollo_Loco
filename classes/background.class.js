class BackgroundObject extends MovableObject{
    height = 300;
    width = 720;

    constructor(imagePath, x , y ) {
        super();
        this.loadImage(imagePath);
        this.x = x || 0;
        this.y = y || 0;
    }
}