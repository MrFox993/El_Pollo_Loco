let canvas;
let world;
let keyboard = new Keyboard();

function startNewGame() {
    hideMenuScreen();
    hideControlScreen();
    showCanvasScreen();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

function hideMenuScreen() {
    let menuScreen = document.getElementById('menuScreen');
    menuScreen.classList.remove('show-screen');
    menuScreen.classList.add('hide-screen');
}

function showMenuScreen() {
    let menuScreen = document.getElementById('menuScreen');
    menuScreen.classList.add('show-screen');
    menuScreen.classList.remove('hide-screen');
}

function showCanvasScreen() {
    let canvasScreen = document.querySelector('.canvas-screen');
    canvasScreen.classList.remove('hide-screen');
    canvasScreen.classList.add('show-screen');
}

function hideCanvasScreen() {
    let canvasScreen = document.querySelector('.canvas-screen');
    canvasScreen.classList.add('hide-screen');
    canvasScreen.classList.remove('show-screen');
}

function showControlScreen() {
    let controlScreen = document.getElementById('controlScreen');
    controlScreen.classList.remove('hide-screen');
    controlScreen.classList.add('show-screen');
}

function hideControlScreen() {
    let controlScreen = document.getElementById('controlScreen');
    controlScreen.classList.add('hide-screen');
    controlScreen.classList.remove('show-screen');
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
