/**
 * Renders all visual elements of the World to the canvas.
 * This class is purely responsible for drawing; it contains no game logic,
 * no collision handling, and no camera calculations beyond applying the
 * camera transform provided by the World instance.
 *
 * Usage:
 * - Construct with a World instance.
 * - Call render() once per frame from the main loop.
 *
 * Invariants:
 * - Assumes world.ctx is a valid 2D rendering context.
 * - Assumes world.canvas is an HTMLCanvasElement.
 * - Respects world.camera_x for horizontal translation (parallax/camera).
 * - Uses drawWithOrientation(ctx) when available on objects, otherwise draw(ctx).
 *
 * @class WorldRenderer
 * @see World
 */

/**
 * A drawable game object that can render itself on a 2D canvas context.
 * Optional drawWithOrientation(ctx) is used when horizontal flipping is needed.
 *
 * @typedef {Object} Renderable
 * @property {function(CanvasRenderingContext2D):void} draw - Draws the object.
 * @property {function(CanvasRenderingContext2D):void} [drawWithOrientation] - Draws with horizontal flip if needed.
 */

class WorldRenderer {
    /**
     * Creates a WorldRenderer bound to a given World instance.
     *
     * @param {World} world - The world instance to render.
     */
    constructor(world) {
        /**
         * The world whose objects will be rendered.
         * @type {World}
         */
        this.world = world;
    }

    /**
     * Main render entry point for a single frame.
     * - Clears the canvas.
     * - Applies the camera transform.
     * - Draws background layers and game objects.
     * - Restores the context.
     * - Draws HUD and (if active) the pause overlay.
     *
     * @returns {void}
     */
    render() {
        const { world } = this;

        world.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);

        world.ctx.save();
        world.ctx.translate(Math.round(world.camera_x), 0);

        this.drawBackground();
        this.drawGameObjects();

        world.ctx.restore();

        this.drawHUD();
        if (window.gamePaused) this.drawPauseOverlay();
    }

    /**
     * Draws the world background layers such as scenery and clouds.
     *
     * @returns {void}
     */
    drawBackground() {
        const { world } = this;
        this.drawObjects(world.level.backgroundObjects);
        this.drawObjects(world.level.clouds);
    }

    /**
     * Draws all in-world entities that are affected by the camera transform:
     * throwable objects, collectibles, enemies, the player character, and the endboss.
     *
     * @returns {void}
     */
    drawGameObjects() {
        const { world } = this;
        this.drawObjects(world.throwableObjects);
        this.drawObjects(world.level.bottles);
        this.drawObjects(world.level.coins);
        this.drawObjects(world.level.enemies);
        this.drawObject(world.character);
        this.drawObject(world.level.endboss);
    }

    /**
     * Draws heads-up display elements that are not camera-transformed:
     * health, coin, and bottle status bars, and the endboss health bar (when present).
     *
     * @returns {void}
     */
    drawHUD() {
        const { world } = this;
        this.drawObject(world.healthStatusBar);
        this.drawObject(world.coinStatusBar);
        this.drawObject(world.bottleStatusBar);
        if (world.endbossStatusBar) {
            this.drawObject(world.endbossStatusBar);
        }
    }

        /**
     * Draws a semi-transparent overlay and a pause icon centered on the canvas.
     * Intended to be shown only when the game is paused.
     *
     * @returns {void}
     */
    drawPauseOverlay() {
        const { world } = this;
        const ctx = world.ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(0, 0, world.canvas.width, world.canvas.height);
        this.drawPauseIcon(ctx, world.canvas.width / 2, world.canvas.height / 2);
    }

    /**
     * Draws the pause icon at the given center.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} cx - center x
     * @param {number} cy - center y
     */
    drawPauseIcon(ctx, cx, cy) {
        const w = 12;
        const h = 60;
        const gap = 12;
        ctx.fillStyle = 'white';
        ctx.fillRect(cx - gap - w, cy - h / 2, w, h);
        ctx.fillRect(cx + gap, cy - h / 2, w, h);
    }

    /**
     * Draws a single object by calling its drawWithOrientation(ctx) if present,
     * otherwise falling back to draw(ctx). Safely ignores null/undefined objects.
     *
     * @param {Renderable|null|undefined} obj - The object to draw.
     * @returns {void}
     */
    drawObject(obj) {
        if (!obj) return;
        obj.drawWithOrientation
            ? obj.drawWithOrientation(this.world.ctx)
            : obj.draw(this.world.ctx);
    }

    /**
     * Draws an array of objects by delegating to drawObject for each element.
     * Safely returns when provided value is not an array.
     *
     * @param {Renderable[]|null|undefined} objects - A list of drawable objects.
     * @returns {void}
     */
    drawObjects(objects) {
        if (!Array.isArray(objects)) return;
        objects.forEach(obj => this.drawObject(obj));
    }
}