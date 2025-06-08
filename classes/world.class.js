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
    backgroundObjects = [];
    backgroundImages_1 = [
        './assets/img/5_background/layers/air.png',
        './assets/img/5_background/layers/3_third_layer/1.png',
        './assets/img/5_background/layers/2_second_layer/1.png',
        './assets/img/5_background/layers/1_first_layer/1.png'
    ];
    backgroundImages_2 = [
        './assets/img/5_background/layers/air.png',
        './assets/img/5_background/layers/3_third_layer/2.png',
        './assets/img/5_background/layers/2_second_layer/2.png',
        './assets/img/5_background/layers/1_first_layer/2.png'
    ];
    bgImgStartingX = -3595;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.generateBackgroundObjects();
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
    
    generateBackgroundObjects() {
        const repetitions = 10;
        const segmentWidth = 719;
        let currentX = this.bgImgStartingX;

        this.backgroundObjects = []; 

        for (let i = 0; i < repetitions; i++) {
            const imageSet = i % 2 === 0 ? this.backgroundImages_1 : this.backgroundImages_2;

            for (let j = 0; j < imageSet.length; j++) {
                this.backgroundObjects.push(new BackgroundObject(imageSet[j], currentX));
            }

            currentX += segmentWidth;
        }
    }
}