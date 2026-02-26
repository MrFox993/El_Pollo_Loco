class World {
  character = new Character();
  backgroundImages_1;
  backgroundImages_2;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  cameraTargetX = 0;
  healthStatusBar = new StatusBar("health");
  bottleStatusBar = new StatusBar("bottle");
  coinStatusBar = new StatusBar("coins");
  throwableObjects = [];
  canThrow = true;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.pauseIcon = new Image();
    this.pauseIcon.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect x="15" y="0" width="20" height="80" fill="white"/><rect x="45" y="0" width="20" height="80" fill="white"/></svg>';
  }

  startWorld() {
    window.gameEnding = false
    this.setWorld();
    this.draw();
    // this.run();
    this.level.enemies.forEach(enemy => enemy.startAnimation());
    if (this.level.endboss) this.level.endboss.startAnimation();
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  run() {
    this.intervalId = setInterval(() => {
      if (!gameStarted || gamePaused) return;
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
      this.endGame("lost");
    } else if (this.level.endboss && this.level.endboss.isDead()) {
      this.endGame("won");
    }
  }

  playEndSound(result) {
    window.audioManager.stopAll();
    window.audioManager.play(result === 'won' ? 'youWin':'gameOver');
  }

  computeEndDelay(result) {
    const charAnim = (this.character?.imagesDead?.length||0)*100;
    const bossAnim = (this.level.endboss?.imagesDead?.length||0)*200;
    const buffer = 400;
    return result==='lost' ? charAnim+buffer : bossAnim+buffer;
  }

  showEndScreen(result) {
    window.gameStarted = false;
    window.gameEnding = false;
    window.gameOver = true;
    window.MobileUI.applyUIState();
    toggleScreen('.canvas-screen','hide');
    toggleScreen(result==='won'?'youWonScreen':'youLostScreen','show');
    if (result==='won') window.updateNextLevelButtonState?.();
  }

  endGame(result) {
    window.gameEnding = true;
    this.playEndSound(result);
    const delay = this.computeEndDelay(result);
    setTimeout(() => this.showEndScreen(result), delay);
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

  isEnemyValid(enemy) {
      return !(enemy.isDead && enemy.isDead());
  }

  killEnemy(enemy, index) {
      const deadImages = enemy.imagesSmallChickenDead || enemy.imagesDead || enemy.imagesDying;
      enemy.playDeadAnimation(deadImages, ()=> {
          const idx = this.level.enemies.indexOf(enemy);
          if (idx >= 0) this.level.enemies.splice(idx,1);
      });
  }

  handleBottleHit(bottle, enemy) {
      this.killEnemy(enemy);
      if (!bottle.hasSfxPlayed) {
          window.audioManager.play('bottleShatter');
          bottle.hasSfxPlayed = true;
      }
      bottle.playSplashAnimation();
  }

  collisionWithEnemy() {
    for (let i = 0; i < this.level.enemies.length; i++) {
      const enemy = this.level.enemies[i];
  
      if (enemy.isDeadFlag) continue;
  
      if (this.character.isCollidingFromTop(enemy)) {
        enemy.isDeadFlag = true;
        enemy.hp = 0;
  
        enemy.playDeadAnimation(enemy.imagesDead, () => {
          const idx = this.level.enemies.indexOf(enemy);
          if (idx >= 0) this.level.enemies.splice(idx, 1);
        });
  
        window.audioManager.play('enemyHit');
        this.character.jump();
        return;
      }
  
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.healthStatusBar.setHealthBarPercentage(this.character.hp);
        return;
      }
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
                this.level.endboss.hitCount ++;
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
  if (!this.throwableObjects.length) return;
    this.throwableObjects.forEach(bottle=>{
        if (bottle.markForRemoval || bottle.hasSplashed) return;
        this.level.enemies.forEach(enemy=>{
            if (!this.isEnemyValid(enemy)) return;
            if (bottle.isColliding(enemy)) this.handleBottleHit(bottle, enemy);
        });
    });
    this.throwableObjects = this.throwableObjects.filter(b=>!b.markForRemoval);
}


  checkThrowObjects() {
    if (this.keyboard.c && this.character.bottles > 0 && this.canThrow) {
      this.canThrow = false;
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
    if (!this.keyboard.c) {
      this.canThrow = true;
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
  
  drawBackground() {
      this.addObjectsToMap(this.level.backgroundObjects);
      this.addObjectsToMap(this.level.clouds);
  }

  drawGameObjects() {
      this.addObjectsToMap(this.throwableObjects);
      this.addObjectsToMap(this.level.bottles);
      this.addObjectsToMap(this.level.coins);
      this.addObjectsToMap(this.level.enemies);
      this.addToMap(this.character);
      this.addToMap(this.level.endboss);
  }

  drawHUD() {
      this.addToMap(this.healthStatusBar);
      this.addToMap(this.coinStatusBar);
      this.addToMap(this.bottleStatusBar);
      if (this.endbossStatusBar) this.addToMap(this.endbossStatusBar);
  }

  drawPauseOverlay() {
      this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      const iconSize = 80;
      this.ctx.drawImage(this.pauseIcon,
          this.canvas.width/2 - iconSize/2,
          this.canvas.height/2 - iconSize/2,
          iconSize, iconSize);
  }

  draw() {
    if (!gameStarted) return;
    if (!window.gameStarted && !window.gameEnding) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);

    this.drawBackground();
    this.drawGameObjects();
    this.ctx.restore();

    this.drawHUD();
    if (gamePaused) this.drawPauseOverlay();

    if (!gamePaused && !window.gameEnding) {
        this.character.update();
        this.updateCamera();
        this.checkCollisions();
        this.checkThrowObjects();
        this.checkEndbossStatusBar();
        this.checkGameOver();
    }

    requestAnimationFrame(() => this.draw());
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
    this.ctx.translate(mObject.x + mObject.width, mObject.y);
    this.ctx.scale(-1, 1);
    this.ctx.translate(-mObject.x, -mObject.y);
  }
  

  flipImageBack() {
    this.ctx.restore();
  }
  
  calculateDesiredCameraX() {
      const center = this.canvas.width/2;
      const dir = this.character.otherDirection ? -1 : 1;
      return -this.character.x + center - this.character.width/2 - dir*240;
  }

  clampCamera(x) {
      const minX = -(this.level.level_end_x - this.canvas.width);
      return Math.max(minX, Math.min(0, x));
  }

  updateCamera() {
    const desired = this.calculateDesiredCameraX();
    const lerp = (this.keyboard.left||this.keyboard.right) ? 0.08 : 0.05;
    this.camera_x += (desired - this.camera_x)*lerp;
    this.camera_x = this.clampCamera(this.camera_x);
  }
}

