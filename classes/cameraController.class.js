/**
 * Controls camera movement and smoothing logic for the world.
 */
class CameraController {
    constructor(world) {
        this.world = world;
    }

    /**
     * Calculates the desired camera X position based on character position.
     * @returns {number}
     */
    calculateDesiredCameraX() {
        const { world } = this;
        const center = world.canvas.width / 2;
        const dir = world.character.otherDirection ? -1 : 1;

        return (
        -world.character.x +
        center -
        world.character.width / 2 -
        dir * 240
        );
    }

    /**
     * Restricts the camera movement within level boundaries.
     * @param {number} x
     * @returns {number}
     */
    clampCamera(x) {
        const { world } = this;
        const minX = -(world.level.level_end_x - world.canvas.width);
        return Math.max(minX, Math.min(0, x));
    }

    /**
     * Smoothly updates the camera position.
     */
    update() {
        const { world } = this;

        const desired = this.calculateDesiredCameraX();
        const lerp =
        world.keyboard.left || world.keyboard.right ? 0.08 : 0.05;

        world.camera_x += (desired - world.camera_x) * lerp;
        world.camera_x = this.clampCamera(world.camera_x);
    }
}