let canvas;
let world;
let keyboard = new Keyboard();
window.gameStarted = false;
window.gameOver = false;
window.gamePaused = false;
window.LEVELS = [
    typeof createLevel1 === 'function' ? createLevel1 : null,
    typeof createLevel2 === 'function' ? createLevel2 : null
]. filter(Boolean)


function hasNextLevel() {
    return window.currentLevelIndex + 1 < window.LEVELS.length;
}

function stopWorld() {
    if (!world) return;
    world.stop();
    world = null
}

function resetGameState() {
    window.gameStarted = true;
    window.gameOver = false;
    window.gamePaused = false;
}

function hideAllScreens() {
    ['menuScreen','controlScreen','youWonScreen','youLostScreen'].forEach(id => hideScreen(id));
}

function initializeWorld(level) {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    world.level = level;
    world.startWorld();
}

function initializeAudioGameMode() {
    if (!window.audioManager) return;
    audioManager.setMode('game');
    audioManager.stopMenuBgm();
    audioManager.playGameBgm();
}

function startLevel(index) {
    stopWorld();
    resetGameState();
    hideAllScreens();
    showScreen('.canvas-screen');

    const levelFactory = window.LEVELS[index];
    if (!levelFactory) return

    initializeWorld(levelFactory());
    initializeAudioGameMode();
    window.MobileUI?.applyUIState?.();
    updateNextLevelButtonState(); 
}

function startNewGame() {
    window.currentLevelIndex = 0;
    startLevel(window.currentLevelIndex);
}

function startNextLevel() {
    if (!hasNextLevel()) return;
    window.currentLevelIndex++;
    startLevel(window.currentLevelIndex);
}

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

function toggleScreen(selector, action) {
    action === 'show' ? showScreen(selector) : hideScreen(selector);
}

function getScreen(selector) {
    return selector.startsWith('.') ? document.querySelector(selector) : document.getElementById(selector);
}

function showScreen(selector) {
    const element = getScreen(selector);
    element?.classList.add('show-screen');
    element?.classList.remove('hide-screen')
}

function hideScreen(selector) {
    const element = getScreen(selector);
    element?.classList.add('hide-screen');
    element?.classList.remove('show-screen')
}

function goToMainMenu() { 
    stopWorld();
    initMenuAudio();
    resetMenuState();
    showScreen('menuScreen')
    window.MobileUI?.applyUIState();
}

function initMenuAudio() {
    if (!window.audioManager) return;
    audioManager.setMode('menu');
    audioManager.stopGameBgm();
    audioManager.playMenuBgm();
}

function resetMenuState() {
    window.gameStarted = false;
    window.gameOver = false;
    ['youWonScreen','youLostScreen','.canvas-screen'].forEach(hideScreen);
    document.getElementById('nextLevelBtn')?.setAttribute('disabled','disabled');
}

function pauseGame() {
    if (!gameStarted || gamePaused) return;
    window.gamePaused = true;
    window.audioManager?.pauseAll?.();
}

function resumeGame() {
    if (!gamePaused) return;
    window.gamePaused = false;
    window.audioManager?.resumeAll?.();
}

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

window.addEventListener('keydown', e => {
    const key = keyMapDown[e.keyCode];
    if (key) keyboard[key] = true;
    if (e.keyCode === 80) window.gamePaused ? resumeGame() : pauseGame();
})

window.addEventListener('keyup', e => {
    const key = keyMapDown[e.keyCode];
    if (key) keyboard[key] = false;
});

window.pauseGame = pauseGame;
window.resumeGame = resumeGame;
window.startNextLevel = startNextLevel;
window.updateNextLevelButtonState = updateNextLevelButtonState;