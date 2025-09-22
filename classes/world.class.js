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

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.checkCollisions();
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy) ) {
          this.character.hp -= 5;
          console.log('Collision with character, health points:', this.character.hp);
          // if (this.character.isAboveGround() && this.character.y < enemy.y) {
          //   enemy.hit();
          //   this.character.jump();
          // } else {
          //   this.character.hit();
          // }
        }
      });
    }, 200);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);

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

