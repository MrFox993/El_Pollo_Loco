class CollisionManager {
    constructor(world) {
        this.world = world;
    }

    checkAll() {
        this.collisionWithEnemy();
        this.collisionWithBottle();
        this.collisionWithCoin();
        this.collisionBottleWithEndboss();
        this.collisionBottleWithEnemies();
        this.collisionCharacterWithEndboss();
        this.bottleSplashAnimation();

    }

    /**
   * Checks collisions between character and enemies (jump kill or damage).
   */
    collisionWithEnemy() {
        const { world } = this;
        for (let i = 0; i < world.level.enemies.length; i++) {
        const enemy = world.level.enemies[i];
    
        if (enemy.isDeadFlag) continue;
    
        if (world.character.isCollidingFromTop(enemy)) {
            enemy.isDeadFlag = true;
            enemy.hp = 0;
    
            enemy.playDeadAnimation(enemy.imagesDead, () => {
            const idx = world.level.enemies.indexOf(enemy);
            if (idx >= 0) world.level.enemies.splice(idx, 1);
            });
    
            window.audioManager.play('enemyHit');
            world.character.jump();
            return;
        }
    
        if (world.character.isColliding(enemy)) {
            world.character.hit();
            world.healthStatusBar.setHealthBarPercentage(world.character.hp);
            return;
        }
        }
    }

    /**
   * Checks collisions between character and collectible bottles.
   */
    collisionWithBottle() {
        const { world } = this;
        world.level.bottles.forEach((bottle, index) => {
        if (world.character.isColliding(bottle)) {
            world.character.bottles++;
            world.level.bottles.splice(index, 1);
            world.bottleStatusBar.setBottleBarPercentage(world.character.bottles);
            window.audioManager.play('bottleCollect');
        }
        });
    }

    /**
   * Checks collisions between character and collectible coins.
   */
    collisionWithCoin() {
        const { world } = this;
        world.level.coins.forEach((coin, index) => {
        if (world.character.isColliding(coin)) {
            world.character.coins++;
            world.level.coins.splice(index, 1);
            world.coinStatusBar.setCoinBarPercentage(world.character.coins);
            window.audioManager.play('coin');
        }
        });
    }

    /**
     * Handles the collision between character and endboss
     * Reduces the characters health bar
     */
    collisionCharacterWithEndboss() {
        const { world } = this;
        const endboss = world.level?.endboss;
        if (!endboss) return
        if (world.character.isColliding(endboss)) {
        const dmg = endboss.defaultHitDamage || 34;
        world.character.hit(dmg);
        world.healthStatusBar.setHealthBarPercentage(world.character.hp);
        }
    }

    /**
     * Handles collision between thrown bottles and endboss.
     */
    collisionBottleWithEndboss() {
        const { world } = this;
        if (world.level.endboss && world.throwableObjects.length > 0) {
            world.throwableObjects.forEach((bottle, index) => {
                if (bottle.isColliding(world.level.endboss) && !bottle.markForRemoval) {
                    world.level.endboss.hit();
                    world.level.endboss.hitCount ++;
                    if (world.endbossStatusBar) {
                        world.endbossStatusBar.setEndbossHealthBarPercentage(world.level.endboss.hp);
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

    /**
     * Handles bottle collisions with normal enemies.
     */
    collisionBottleWithEnemies() {
        const { world } = this;
    if (!world.throwableObjects.length) return;
        world.throwableObjects.forEach(bottle=>{
            if (bottle.markForRemoval || bottle.hasSplashed) return;
            world.level.enemies.forEach(enemy=>{
                if (!world.isEnemyValid(enemy)) return;
                if (bottle.isColliding(enemy)) world.handleBottleHit(bottle, enemy);
            });
        });
        world.throwableObjects = world.throwableObjects.filter(b=>!b.markForRemoval);
    }

    /**
   * Plays bottle splash animation when it hits the ground.
   */
    bottleSplashAnimation() {
        const { world } = this;
        world.throwableObjects.forEach((bottle) => {
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

            world.throwableObjects = world.throwableObjects.filter(bottle => !bottle.markForRemoval);
    }
}
