class World {
  character = new Character();
  //   enemies = level_1.enemies;
  //   clouds = level_1.clouds;
  //   backgroundObjects = level_1.backgroundObjects;
  level = level_1;
  backgroundImages_1;
  backgroundImages_2;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  healthStatusBar = new StatusBar("health");
  bottleStatusBar = new StatusBar("bottle");
  coinStatusBar = new StatusBar("coins");
  throwableObjects = [new ThrowableObject()];

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy) ) {
        this.character.hit();
        this.healthStatusBar.setHealthBarPercentage(this.character.hp);
      }
    });
  }

  checkThrowObjects() {
    if (this.keyboard.c){
      let bottle = new ThrowableObject(this.character.x + (this.character.width / 2), this.character.y + (this.character.height / 2));
      this.throwableObjects.push(bottle);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.throwableObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);

    this.ctx.translate(-this.camera_x, 0);
    // ---- Space for fixed objects ---- 
    this.addToMap(this.healthStatusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusBar);
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addToMap(mObject) {
    if (mObject.otherDirection) {
      this.flipImage(mObject);
    }
    mObject.draw(this.ctx);
    mObject.drawFrame(this.ctx);

    if (mObject.otherDirection) {
      this.flipImageBack(mObject);
    }
  }

  addObjectsToMap(objects) {
    objects.forEach((obj) => {
      this.addToMap(obj);
    });
  }

  flipImage(mObject) {
    this.ctx.save();
      this.ctx.translate(mObject.width, 0);
      this.ctx.scale(-1, 1);
      mObject.x = mObject.x * -1;
  }

  flipImageBack(mObject) {
    mObject.x = mObject.x * -1;
    this.ctx.restore();
  }

}

