/**
 * Handles all available collisions in world
 */
class CollisionManager {
    constructor(world) {
        this.world = world;
    }

    /**
     * Frequently running the task in world
     */
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
     * Handles enemy collision checks for all enemies.
     */
    collisionWithEnemy() {
        const { world } = this;
        world.level.enemies.forEach(enemy => {
            if (!enemy.isDeadFlag) {
                if (this.isTopCollision(enemy)) return;
                if (this.isSideCollision(enemy)) return;
            }
        });
    }

    /**
     * Handles collision when the character jumps on top of an enemy.
     * @param {MovableObject} enemy
     * @returns {boolean} True if collision handled, else false.
     */
    isTopCollision(enemy) {
        const { world } = this;
        if (world.character.isCollidingFromTop(enemy)) {
            this.handleEnemyStomp(enemy);
            return true;
        }
        return false;
    }

    /**
     * Handles collision when the character hits an enemy from the side.
     * @param {MovableObject} enemy
     * @returns {boolean} True if collision handled, else false.
     */
    isSideCollision(enemy) {
        const { world } = this;
        if (world.character.isColliding(enemy)) {
            this.handleCharacterHit();
            return true;
        }
        return false;
    }

    /**
     * Handles the logic when the character jumps on top of an enemy.
     * @param {MovableObject} enemy
     */
    handleEnemyStomp(enemy) {
        const { world } = this;
        enemy.isDeadFlag = true;
        enemy.hp = 0;
        enemy.playDeadAnimation(enemy.imagesDead, () => {
            const idx = world.level.enemies.indexOf(enemy);
            if (idx >= 0) world.level.enemies.splice(idx, 1);
        });
        window.audioManager.play('enemyHit');
        world.character.jump();
    }

    /**
     * Handles the logic when the character is hit by an enemy from the side.
     */
    handleCharacterHit() {
        const { world } = this;
        world.character.hit();
        world.healthStatusBar.setHealthBarPercentage(world.character.hp);
    }
    
    /**
     * Checks and collects all bottle collisions for the character.
     */
    collisionWithBottle() {
        const { world } = this;
        world.level.bottles.forEach((bottle, index) => {
            if (this.checkBottleCollision(bottle)) {
                this.collectBottle(index);
            }
        });
    }

    /**
     * Returns true if character collides with bottle.
     * @param {MovableObject} bottle
     * @returns {boolean}
     */
    checkBottleCollision(bottle) {
        const { world } = this;
        return world.character.isColliding(bottle);
    }

    /**
     * Handles collecting bottle at specified index.
     * @param {number} index
     */
    collectBottle(index) {
        const { world } = this;
        world.character.bottles++;
        world.level.bottles.splice(index, 1);
        world.bottleStatusBar.setBottleBarPercentage(world.character.bottles);
        window.audioManager.play('bottleCollect');
    }

    /**
     * Checks and collects all coin collisions for the character.
     */
    collisionWithCoin() {
        const { world } = this;
        world.level.coins.forEach((coin, index) => {
            if (this.checkCoinCollision(coin)) {
                this.collectCoin(index);
            }
        });
    }

    /**
     * Returns true if character collides with coin.
     * @param {MovableObject} coin
     * @returns {boolean}
     */
    checkCoinCollision(coin) {
        const { world } = this;
        return world.character.isColliding(coin);
    }

    /**
     * Handles collecting coin at specified index.
     * @param {number} index
     */
    collectCoin(index) {
        const { world } = this;
        world.character.coins++;
        world.level.coins.splice(index, 1);
        world.coinStatusBar.setCoinBarPercentage(world.character.coins);
        window.audioManager.play('coin');
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
