/**
 * Responsible for rendering everything related to the world.
 * No game logic, no collisions, no camera calculations.
 */
class WorldRenderer {
    constructor(world) {
        this.world = world;
    }

    /**
     * Main render entry point.
     */
    render() {
        const { world } = this;

        world.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);

        world.ctx.save();
        world.ctx.translate(world.camera_x, 0);

        this.drawBackground();
        this.drawGameObjects();

        world.ctx.restore();

        this.drawHUD();
        if (window.gamePaused) this.drawPauseOverlay();
    }

    drawBackground() {
        const { world } = this;
        this.drawObjects(world.level.backgroundObjects);
        this.drawObjects(world.level.clouds);
    }

    drawGameObjects() {
        const { world } = this;
        this.drawObjects(world.throwableObjects);
        this.drawObjects(world.level.bottles);
        this.drawObjects(world.level.coins);
        this.drawObjects(world.level.enemies);
        this.drawObject(world.character);
        this.drawObject(world.level.endboss);
    }

    drawHUD() {
        const { world } = this;
        this.drawObject(world.healthStatusBar);
        this.drawObject(world.coinStatusBar);
        this.drawObject(world.bottleStatusBar);
        if (world.endbossStatusBar) {
        this.drawObject(world.endbossStatusBar);
        }
    }

    drawPauseOverlay() {
        const { world } = this;
        const ctx = world.ctx;

        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(0, 0, world.canvas.width, world.canvas.height);

        const cx = world.canvas.width / 2;
        const cy = world.canvas.height / 2;
        const w = 12;
        const h = 60;
        const gap = 12;

        ctx.fillStyle = 'white';
        ctx.fillRect(cx - gap - w, cy - h / 2, w, h);
        ctx.fillRect(cx + gap, cy - h / 2, w, h);
    }

    drawObject(obj) {
        if (!obj) return;
        obj.drawWithOrientation
        ? obj.drawWithOrientation(this.world.ctx)
        : obj.draw(this.world.ctx);
    }

    drawObjects(objects) {
        if (!Array.isArray(objects)) return;
        objects.forEach(obj => this.drawObject(obj));
    }
}