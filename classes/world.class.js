class World {
    character = new Character();
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken()
    ];
    clouds = [
        new Cloud()
    ]
    backgroundObject = [
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png'),
        // new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png'),
    ];
    ctx;
    canvas;

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.clouds);
        this.addObjectsToMap(this.backgroundObject);

        let self = this;
        requestAnimationFrame(function(){
            self.draw();
        });
    }

    addToMap(mObject) {
        this.ctx.drawImage(
            mObject.img, 
            mObject.x, 
            mObject.y, 
            mObject.width, 
            mObject.height
        );
    }

    addObjectsToMap(objects) {
        objects.forEach(obj => {
            this.addToMap(obj);
        });
    }
}