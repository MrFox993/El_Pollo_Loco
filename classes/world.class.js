class World {
    character = new Character();
    enemies = level_1.enemies;
    clouds = level_1.clouds;
    backgroundObjects = level_1.backgroundObjects;
    backgroundImages_1;
    backgroundImages_2;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
        this.character.animate();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.clouds);

        this.ctx.translate(-this.camera_x, 0);
        let self = this;
        requestAnimationFrame(function(){
            self.draw();
        });
    }

    addToMap(mObject) {
        if (mObject.otherDirection){
            this.ctx.save();
            this.ctx.translate(mObject.width, 0);
            this.ctx.scale(-1, 1);
            mObject.x = mObject.x * -1;
        }
        this.ctx.drawImage(
            mObject.img, 
            mObject.x, 
            mObject.y, 
            mObject.width, 
            mObject.height
        );
        if (mObject.otherDirection) {
            mObject.x = mObject.x * -1;
            this.ctx.restore();
        }
    }

    addObjectsToMap(objects) {
        objects.forEach(obj => {
            this.addToMap(obj);
        });
    }
}