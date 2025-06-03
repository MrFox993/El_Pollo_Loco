let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

window.addEventListener('keydown', (event) => {
    if (event.keyCode === 100) {
        keyboard.right = true;
    }
    if (event.keyCode === 97) {
        keyboard.left = true;
    }
    if (event.keyCode === 119) {
        keyboard.up = true;
    }
    if (event.keyCode === 115) {
        keyboard.down = true;
    }
    if (event.keyCode === 32) {
        keyboard.space = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.keyCode === 100) {
        keyboard.right = false;
    }
    if (event.keyCode === 97) {
        keyboard.left = false;
    }
    if (event.keyCode === 119) {
        keyboard.up = false;
    }
    if (event.keyCode === 115) {
        keyboard.down = false;
    }
    if (event.keyCode === 32) {
        keyboard.space = false;
    }
});
