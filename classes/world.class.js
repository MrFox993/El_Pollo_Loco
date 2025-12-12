class World {
  character = new Character();
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
  }

  startWorld() {
    this.draw();
    this.setWorld();
    this.run();
    this.level.enemies.forEach(enemy => enemy.startAnimation());
    if (this.level.endboss) this.level.endboss.startAnimation();
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  run() {
    this.intervalId = setInterval(() => {
      if (!gameStarted) return;
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkEndbossStatusBar();
      this.checkGameOver();
    }, 200);
  }

  stop() {
    clearInterval(this.intervalId)
  }

checkGameOver() {
    if (this.character.isDead()) {
        window.audioManager.play('gameOver');
        this.endGame("lost");
    } else if (this.level.endboss && this.level.endboss.isDead()) {
        window.audioManager.play('youWin');
        this.endGame("won");
    }
}

endGame(result) {
  this.stop()
  gameOver = true
  setTimeout(() => {
      gameStarted = false;
      toggleScreen('canvas-screen', 'hide');
      if (result === "won") {
        toggleScreen('youWonScreen', 'show');
      } else {
        toggleScreen('youLostScreen', 'show');
      }
  }, 1000);
}

  checkCollisions() {
    this.collisionWithEnemy();
    this.collisionWithBottle();
    this.collisionWithCoin();
    this.collisionBottleWithEndboss();
    this.collisionBottleWithEnemies();
    this.bottleSpashAnimation();
  
    this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.markForRemoval);

  }

  collisionWithEnemy() {
    this.level.enemies.forEach((enemy, index) => {
      if (this.character.isCollidingFromTop(enemy)) {
        enemy.playDeadAnimation(enemy.imagesSmallChickenDead, () => {this.level.enemies.splice(index, 1)})
        window.audioManager.play('enemyHit');
        this.character.jump();
      }
      else if (this.character.isColliding(enemy) ) {
        this.character.hit();
        this.healthStatusBar.setHealthBarPercentage(this.character.hp);
      }
    });
    if (this.character.isColliding(this.level.endboss)) {
      this.character.hit();
      this.healthStatusBar.setHealthBarPercentage(this.character.hp);
    }
  }

  collisionWithBottle() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.character.bottles++;
        this.level.bottles.splice(index, 1);
        this.bottleStatusBar.setBottleBarPercentage(this.character.bottles);
        window.audioManager.play('bottleCollect');
      }
    });
  }

  collisionWithCoin() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.character.coins++;
        this.level.coins.splice(index, 1);
        this.coinStatusBar.setCoinBarPercentage(this.character.coins);
        window.audioManager.play('coin');
      }
    });
  }

  collisionBottleWithEndboss() {
      if (this.level.endboss && this.throwableObjects.length > 0) {
          this.throwableObjects.forEach((bottle, index) => {
              if (bottle.isColliding(this.level.endboss) && !bottle.markForRemoval) {
                this.level.endboss.hit();
                if (this.endbossStatusBar) {
                    this.endbossStatusBar.setEndbossHealthBarPercentage(this.level.endboss.hp);
                }
                bottle.stopThrow();
                bottle.stopGravity();
                if (!bottle.hasSfxPlayed) {
                        window.audioManager.play('bottleShatter');
                        bottle.hasSfxPlayed = true;
                      }
                window.audioManager.play('endbossHit');
                bottle.playSplashAnimation();
              }
          });
      }
  }

collisionBottleWithEnemies() {
  if (!this.throwableObjects.length || !Array.isArray(this.level.enemies)) return;

  for (let b = 0; b < this.throwableObjects.length; b++) {
    const bottle = this.throwableObjects[b];
    if (bottle.markForRemoval || bottle.hasSplashed) continue;

    for (let e = 0; e < this.level.enemies.length; e++) {
      const enemy = this.level.enemies[e];

      if (enemy.isDead && enemy.isDead()) continue;

      if (bottle.isColliding(enemy)) {
        if (typeof enemy.playDeadAnimation === 'function') {
          const deadImages =
            enemy.imagesSmallChickenDead || enemy.imagesDead || enemy.imagesDying;

          enemy.playDeadAnimation(deadImages, () => {
            const idx = this.level.enemies.indexOf(enemy);
            if (idx >= 0) this.level.enemies.splice(idx, 1);
          });
        } else {
          enemy.hp = 0;
          this.level.enemies.splice(e, 1);
        }
        if (!bottle.hasSfxPlayed) {
          window.audioManager.play('bottleShatter');
          bottle.hasSfxPlayed = true;
        }
        bottle.playSplashAnimation();
        break;
      }
    }
  }

  this.throwableObjects = this.throwableObjects.filter(b => !b.markForRemoval);
}


  checkThrowObjects() {
    if (this.keyboard.c && this.character.bottles > 0) {
      let direction = this.character.otherDirection ? 'left' : 'right';

      let bottle = new ThrowableObject(
        this.character.x + (this.character.width / 2),
        this.character.y + (this.character.height / 2),
        direction,
        Bottle.imagesBottleRotation,
        Bottle.imagesBottleSplash
      );

      if (direction === 'left') {
        bottle.otherDirection = true;
      }

      this.throwableObjects.push(bottle);
      this.character.bottles--;
      this.bottleStatusBar.setBottleBarPercentage(this.character.bottles);
    }
  }

  checkEndbossStatusBar() {
    if (!this.endbossStatusBar && this.character.x >= 2000) {
        this.endbossStatusBar = new StatusBar("endboss", this.canvas.width);
    }
  }

  bottleSpashAnimation() {
    this.throwableObjects.forEach((bottle) => {
        let splashTriggered = false;

        if (bottle.hasSplashed || bottle.markForRemoval) {
            return;
        }

        splashTriggered= bottle.y >= 350;

        if (splashTriggered && !bottle.markForRemoval) {
            bottle.stopThrow();
            bottle.stopGravity();
            if (!bottle.hasSfxPlayed) {
              window.audioManager.play('bottleShatter');
              bottle.hasSfxPlayed = true;
            }
            bottle.playSplashAnimation();
        }
            });

        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.markForRemoval);
  }

  draw() {
    if (!gameStarted) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.level.endboss);

    this.ctx.translate(-this.camera_x, 0);
    // ---- Space for fixed objects ---- 
    this.addToMap(this.healthStatusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusBar);
    if (this.endbossStatusBar) {
      this.addToMap(this.endbossStatusBar);
    }
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addToMap(mObject) {
    if (!mObject) return;
    if (mObject.otherDirection === true) {
      this.flipImage(mObject);
    }
    mObject.draw(this.ctx);
    // mObject.drawFrame(this.ctx);

    if (mObject.otherDirection) {
      this.flipImageBack(mObject);
    }
  }

  addObjectsToMap(objects) {
    if (!Array.isArray(objects)) return;
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

