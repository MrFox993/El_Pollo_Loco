class World {
  character = new Character();
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
  throwableObjects = [];

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
    this.collisionWithEneny();
    this.collisionWithBottle();
    this.collisionWithCoin();
  }

  collisionWithEneny() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isCollidingFromTop(enemy)) {
        this.level.enemies.splice(this.level.enemies.indexOf(enemy), 1);
        this.character.jump();
      }
      else if (this.character.isColliding(enemy) ) {
        this.character.hit();
        this.healthStatusBar.setHealthBarPercentage(this.character.hp);
      }
    });
  }

  collisionWithBottle() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.character.bottles++;
        this.level.bottles.splice(index, 1);
        this.bottleStatusBar.setBottleBarPercentage(this.character.bottles);
      }
    });
  }

  collisionWithCoin() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.character.coins++;
        this.level.coins.splice(index, 1);
        this.coinStatusBar.setCoinBarPercentage(this.character.coins);
      }
    });
  }

  checkThrowObjects() {
    if (this.keyboard.c && this.character.bottles > 0) {
      let bottle = new ThrowableObject(this.character.x + (this.character.width / 2), this.character.y + (this.character.height / 2));
      this.throwableObjects.push(bottle);
      this.character.bottles--;
      this.bottleStatusBar.setBottleBarPercentage(this.character.bottles);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
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

