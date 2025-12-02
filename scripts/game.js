let canvas;
let world;
let keyboard = new Keyboard();
let gameStarted = false;
let gameOver = false;

function startNewGame() {
    gameStarted = true;
    gameOver = false;
    toggleScreen('menuScreen', 'hide');
    toggleScreen('controlScreen', 'hide');
    toggleScreen('.canvas-screen', 'show');
    newLevel = createLevel1();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    world.level = newLevel;
    world.startWorld();
}

function toggleScreen(screenIdOrClass, action) {
    let element = screenIdOrClass.startsWith('.') 
        ? document.querySelector(screenIdOrClass) 
        : document.getElementById(screenIdOrClass);

    if (!element) return;

    if (action === 'show') {
        element.classList.add('show-screen');
        element.classList.remove('hide-screen');
    } else if (action === 'hide') {
        element.classList.add('hide-screen');
        element.classList.remove('show-screen');
    }
}

function goToMainMenu() { 
    if (world) {
        world.stop();
        world = null;
    }
    gameStarted = false;
    gameOver = false;
    toggleScreen('youWonScreen', 'hide');
    toggleScreen('youLostScreen', 'hide');
    toggleScreen('.canvas-screen', 'hide');
    toggleScreen('menuScreen', 'show');
}


window.addEventListener('keydown', (event) => {
    if (event.keyCode === 65 || event.keyCode === 37) {
        keyboard.left = true;
    }
    if (event.keyCode === 87 || event.keyCode === 38) {
        keyboard.up = true;
    }
    if (event.keyCode === 68 || event.keyCode === 39) {
        keyboard.right = true;
    }
    if (event.keyCode === 83 || event.keyCode === 40) {
        keyboard.down = true;
    }
    if (event.keyCode === 32) {
        keyboard.space = true;
    }
    if (event.keyCode === 67) {
        keyboard.c = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.keyCode === 65 || event.keyCode === 37) {
        keyboard.left = false;
    }
    if (event.keyCode === 87 || event.keyCode === 38) {
        keyboard.up = false;
    }
    if (event.keyCode === 68 || event.keyCode === 39) {
        keyboard.right = false;
    }
    if (event.keyCode === 83 || event.keyCode === 40) {
        keyboard.down = false;
    }
    if (event.keyCode === 32) {
        keyboard.space = false;
    }
    if (event.keyCode === 67) {
        keyboard.c = false;
    }
});
