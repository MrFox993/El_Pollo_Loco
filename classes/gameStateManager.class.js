/**
 * Handles global game state transitions like start, pause, game over and end screens.
 */
class GameStateManager {
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks if the game has ended (win / loss).
     */
    checkGameOver() {
        const { world } = this;

        if (world.character.isDead()) {
        this.endGame('lost');
        } else if (world.level.endboss && world.level.endboss.isDead()) {
        this.endGame('won');
        }
    }

    /**
     * Ends the game by playing sounds and triggering the end screen after a delay.
     *
     * @param {'won'|'lost'} result
     */
    endGame(result) {
        const { world } = this;

        window.gameEnding = true;
        this.playEndSound(result);

        const delay = this.computeEndDelay(result);
        setTimeout(() => this.showEndScreen(result), delay);
    }

    /**
     * Plays win or loss sound.
     *
     * @param {'won'|'lost'} result
     */
    playEndSound(result) {
        window.audioManager.stopAll();
        window.audioManager.play(result === 'won' ? 'youWin' : 'gameOver');
    }

    /**
     * Calculates delay based on death animations.
     *
     * @param {'won'|'lost'} result
     * @returns {number}
     */
    computeEndDelay(result) {
        const { world } = this;

        const charAnim =
        (world.character?.imagesDead?.length || 0) * 100;
        const bossAnim =
        (world.level.endboss?.imagesDead?.length || 0) * 200;

        const buffer = 400;
        return result === 'lost'
        ? charAnim + buffer
        : bossAnim + buffer;
    }

    /**
     * Shows end screen and updates UI.
     *
     * @param {'won'|'lost'} result
     */
    showEndScreen(result) {
        window.gameStarted = false;
        window.gameEnding = false;
        window.gameOver = true;

        window.MobileUI.applyUIState();
        toggleScreen('.canvas-screen', 'hide');
        toggleScreen('.in-game-controls', 'hide');
        toggleScreen(
        result === 'won' ? 'youWonScreen' : 'youLostScreen',
        'show'
        );

        if (result === 'won') {
        window.updateNextLevelButtonState?.();
        }
    }
}