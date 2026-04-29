let canvas;
let world;
let keyboard = new Keyboard();
window.keyboard = keyboard;
window.gameStarted = false;
window.gameOver = false;
window.gamePaused = false;
window.LEVELS = [
    typeof createLevel1 === 'function' ? createLevel1 : null,
    typeof createLevel2 === 'function' ? createLevel2 : null
]. filter(Boolean)
const keyMapDown = {
    65:'left',
    37:'left',
    87:'up',
    38:'up',
    68:'right',
    39:'right',
    83:'down',
    40:'down',
    32:'space',
    67:'c'
}


/**
 * Checks if another level exists after the current one.
 *
 * @returns {boolean} True if more levels are available.
 */
function hasNextLevel() {
    return window.currentLevelIndex + 1 < window.LEVELS.length;
}

/**
 * Stops the current world simulation safely.
 */
function stopWorld() {
    if (!world) return;
    world.stop();
    world = null
}

/**
 * Resets global game state flags to start a new session.
 */
function resetGameState() {
    window.gameStarted = true;
    window.gameOver = false;
    window.gamePaused = false;
}

/**
 * Hides all menu or game UI screens.
 */
function hideAllScreens() {
    ['menuScreen','controlScreen','youWonScreen','youLostScreen','legalNotice'].forEach(id => hideScreen(id));
}

/**
 * Initializes the game world with the provided level instance.
 *
 * @param {Level} level - Level object used to start the world.
 */
function initializeWorld(level) {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    world.level = level;
    world.startWorld();
}

/**
 * Switches audio playback into game mode.
 */
function initializeAudioGameMode() {
    if (!window.audioManager) return;
    audioManager.setMode('game');
    audioManager.stopMenuBgm();
    audioManager.playGameBgm();
}

/**
 * Starts a specific level by index.
 *
 * @param {number} index - Index of the level to start.
 */
function startLevel(index) {
    stopWorld();
    resetGameState();
    hideAllScreens();
    showScreen('.canvas-screen');

    const levelFactory = window.LEVELS[index];
    if (!levelFactory) return

    initializeWorld(levelFactory());
    initializeAudioGameMode();
    window.MobileUI?.bindMobileControls?.(keyboard);
    window.MobileUI?.applyUIState?.();
    updateNextLevelButtonState(); 
}

/**
 * Starts a new game beginning with level 1.
 */
function startNewGame() {
    window.currentLevelIndex = 0;
    startLevel(window.currentLevelIndex);
}

/**
 * Advances to the next level if available.
 */
function startNextLevel() {
    if (!hasNextLevel()) return;
    window.currentLevelIndex++;
    startLevel(window.currentLevelIndex);
}

/**
 * Updates the UI state of the "Next level" button.
 */
function updateNextLevelButtonState() {
    const btn = document.getElementById('nextLevelBtn');
    if (!btn) return;

    if (hasNextLevel()) {
        btn.removeAttribute('disabled');
        btn.title = '';
    } else {
        btn.setAttribute('disabled', 'disabled');
        btn.title = 'no further level available';
    }
}

/**
 * Shows or hides a screen based on the given action.
 *
 * @param {string} selector - CSS selector or ID.
 * @param {'show'|'hide'} action - Operation to perform.
 */
function toggleScreen(selector, action) {
    action === 'show' ? showScreen(selector) : hideScreen(selector);
}

/**
 * Gets the DOM element associated with the given selector or ID.
 *
 * @param {string} selector - CSS selector or element ID.
 * @returns {HTMLElement|null} The resolved screen element.
 */
function getScreen(selector) {
    return selector.startsWith('.') ? document.querySelector(selector) : document.getElementById(selector);
}

/**
 * Shows a UI screen.
 *
 * @param {string} selector - CSS selector or ID.
 */
function showScreen(selector) {
    const element = getScreen(selector);
    element?.classList.add('show-screen');
    element?.classList.remove('hide-screen')
}

/**
 * Hides a UI screen.
 *
 * @param {string} selector - CSS selector or ID.
 */
function hideScreen(selector) {
    const element = getScreen(selector);
    element?.classList.add('hide-screen');
    element?.classList.remove('show-screen')
}

/**
 * Returns to the main menu screen and resets necessary states.
 */
function goToMainMenu() { 
    stopWorld();
    initMenuAudio();
    resetMenuState();
    showScreen('menuScreen')
    window.MobileUI?.applyUIState();
}

/**
 * Enables menu-specific audio.
 */
function initMenuAudio() {
    if (!window.audioManager) return;
    audioManager.setMode('menu');
    audioManager.stopGameBgm();
    audioManager.playMenuBgm();
}

/**
 * Resets all menu-related flags and hides game screens.
 */
function resetMenuState() {
    window.gameStarted = false;
    window.gameOver = false;
    ['youWonScreen','youLostScreen','.canvas-screen'].forEach(hideScreen);
    document.getElementById('nextLevelBtn')?.setAttribute('disabled','disabled');
}

/**
 * Pauses the game and audio.
 */
function pauseGame() {
    if (!gameStarted || gamePaused) return;
    window.gamePaused = true;
    window.audioManager?.pauseAll?.();
}

/**
 * Resumes a paused game.
 */
function resumeGame() {
    if (!gamePaused) return;
    window.gamePaused = false;
    window.audioManager?.resumeAll?.();
}

/**
 * Global key event listeners for game controls and pausing.
 */
window.addEventListener('keydown', e => {
    const key = keyMapDown[e.keyCode];
    if (key) keyboard[key] = true;
    if (e.keyCode === 80) window.gamePaused ? resumeGame() : pauseGame();
})

/**
 * Global key event listener for key releases to update keyboard state.
 */
window.addEventListener('keyup', e => {
    const key = keyMapDown[e.keyCode];
    if (key) keyboard[key] = false;
});

/**
 * Makes the functions globally accessible for UI buttons and other scripts.
 */
window.pauseGame = pauseGame;
window.resumeGame = resumeGame;
window.startNextLevel = startNextLevel;
window.updateNextLevelButtonState = updateNextLevelButtonState;