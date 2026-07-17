(function () {
    const mobileControls = document.getElementById('mobileControls');
    const mobileGameControls = document.getElementById('mobileGameControls');
    const rotateOverlay  = document.getElementById('rotateOverlay');
    const canvasScreen   = document.querySelector('.canvas-screen');
    const inGameControls = document.querySelector('.in-game-controls');


/**
 * Determines whether the current device orientation is landscape.
 *
 * @returns {boolean} True if landscape, false otherwise.
 */
    const isLandscape = () =>
        window.matchMedia('(orientation: landscape)').matches ||
        Math.abs(window.innerWidth) > Math.abs(window.innerHeight);

/**
 * Determines whether the device reports a coarse pointer (e.g., touch).
 * @returns {boolean}
 */
    const isCoarsePointer = () => 
        typeof window.matchMedia === 'function' && window.matchMedia('(any-pointer: coarse)').matches;

/**
 * Determines whether the device has touch capability.
 *
 * @returns {boolean} True for touch-capable devices, false otherwise.
 */
    const isTouchLike = () =>
        'ontouchstart' in window ||
        (navigator.maxTouchPoints || 0) > 0 ||
        isCoarsePointer();
        
/**
 * Checks whether the viewport size qualifies as mobile.
 *
 * @returns {boolean} True if the viewport is small enough to be considered mobile.
 */
    const isMobileViewport = () =>
    Math.min(window.innerWidth, window.innerHeight) <= 1024;
    
/**
 * Determines whether the device is mobile or emulating mobile behavior.
 *
 * @returns {boolean} True if touch-capable and mobile viewport.
 */
    const isMobileOrEmulated = () => isTouchLike() && isMobileViewport();

/**
 * Sets flag indicating use of physical keyboard.
 */
    let keyboardUsed = false;
    window.addEventListener('keydown', () => keyboardUsed = true);
    
/**
 * Computes a set of UI state flags controlling mobile controls and rotation overlay.
 *
 * @returns {{showMobile:boolean, showRotate:boolean, hideMobile:boolean}}
 *   UI visibility flags.
 */
    function computeUIFlags() {
        const mobile = isMobileOrEmulated();
        const landscape = isLandscape();
        return {
            showMobile: mobile && !keyboardUsed && landscape && window.gameStarted,
            showRotate: mobile && !landscape,
            hideMobile: mobile && landscape && window.gameOver
        };
    }

/**
 * Shows or hides the on-screen mobile controls.
 *
 * @param {Object} flags - State flags from computeUIFlags().
 */
    function updateMobileVisibility(flags) {
        mobileControls.style.display = flags.showMobile ? 'flex' : 'none';
        mobileGameControls.style.display = flags.showMobile ? 'flex' : 'none';
        if (flags.showMobile) {
                inGameControls.classList.add('hide-screen');
            } else {
                inGameControls.classList.remove('show-screen');
            }        
        if (flags.hideMobile) mobileControls.style.display = 'none';
        if (flags.hideMobile) mobileGameControls.style.display = 'none';
        mobileControls.setAttribute('aria-hidden', String(!flags.showMobile));
        mobileGameControls.setAttribute('aria-hidden', String(!flags.showMobile));
    }

/**
 * Shows or hides the rotation warning overlay.
 *
 * @param {Object} flags - State flags from computeUIFlags().
 */
    function updateRotateOverlay(flags) {
        rotateOverlay.style.display = flags.showRotate ? 'flex' : 'none';
        rotateOverlay.setAttribute('aria-hidden', String(!flags.showRotate));
        canvasScreen.classList.toggle('blocked', flags.showRotate);
    }

/**
 * Pauses or resumes the game automatically depending on orientation.
 *
 * @param {Object} flags - UI state flags.
 */
    function updatePauseState(flags) {
        if (!window.gameStarted) return;
        if (flags.showRotate) window.pauseGame?.();
        else window.resumeGame?.();
    }

/**
 * Applies all UI state logic: mobile controls, rotate overlay, pause behavior.
 */
    function applyUIState() {
        const flags = computeUIFlags();
        updateMobileVisibility(flags);
        updateRotateOverlay(flags);
        updatePauseState(flags);
    }

    window.addEventListener('resize', applyUIState);
    if (window.screen && window.screen.orientation) {
        window.screen.orientation.addEventListener('change', applyUIState);
    }
    applyUIState();

/**
 * Prevents default right-click context menu on mobile controls.
 * @param {Event} e
 */
    ['contextmenu'].forEach(evt => {
        mobileControls.addEventListener(evt, e => e.preventDefault(), { passive: false });
    });
    
/**
 * Attaches pause button behavior to mobile pause UI.
 */
    function setupPauseButton() {
        const pauseBtn = document.querySelector('#btnPause');
        if (!pauseBtn) return;
        pauseBtn.addEventListener('pointerdown', e => {
            e.preventDefault();
            window.gamePaused ? window.resumeGame() : window.pauseGame();
            pauseBtn.classList.add('pressed');
        });
        pauseBtn.addEventListener('pointerup', e => {
            e.preventDefault();
            pauseBtn.classList.remove('pressed');
        });
    }
    
/**
 * Creates pointer handlers for touch buttons (press/release).
 *
 * @param {HTMLElement} el - Target element.
 * @param {string} key - Keyboard key to simulate.
 * @param {Object} keyboard - Keyboard state object.
 * @returns {{press:Function, release:Function}} Pointer event handlers.
 */
    function createPointerHandlers(el, key, keyboard) {
        const press = e => {
            e.preventDefault();
            keyboard[key] = true;
            el.classList.add('pressed');
        };
        const release = e => {
            e.preventDefault();
            keyboard[key] = false;
            el.classList.remove('pressed');
        };
        return { press, release };
    }

/**
 * Attaches pointer events for on-screen controls.
 *
 * @param {HTMLElement} el - Target element.
 * @param {{press:Function, release:Function}} handlers - Event handlers.
 */
    function attachControlEvents(el, handlers) {
        el.addEventListener('pointerdown', handlers.press, { passive: false });
        el.addEventListener('pointerup', handlers.release, { passive: false });
        el.addEventListener('pointercancel', handlers.release, { passive: false });
        el.addEventListener('pointerleave', handlers.release, { passive: false });
    }
    
/**
 * Binds mobile control buttons to the virtual keyboard state.
 *
 * @param {Keyboard} keyboard - The game's keyboard state instance.
 */
    function bindMobileControls(keyboard) {
        const bindings = [
            { sel: '#btnLeft', key: 'left' },
            { sel: '#btnRight', key: 'right' },
            { sel: '#btnJump', key: 'up' },
            { sel: '#btnThrow', key: 'c' }
        ];
        bindings.forEach(b => {
            const el = document.querySelector(b.sel);
            if (!el) return;
            const handlers = createPointerHandlers(el, b.key, keyboard);
            attachControlEvents(el, handlers);
        });
    }

    if (window.keyboard) {
        bindMobileControls(window.keyboard);
    }

/**
 * Exposes Mobile UI API globally.
 *
 * @global
 * @namespace MobileUI
 * @property {Function} applyUIState - Updates full UI.
 * @property {Function} bindMobileControls - Binds touch UI to keyboard.
 */
    window.MobileUI = {
        applyUIState,
        bindMobileControls
    };
    setupPauseButton();
})();