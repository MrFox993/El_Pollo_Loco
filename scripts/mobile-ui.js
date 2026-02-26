(function () {
    const mobileControls = document.getElementById('mobileControls');
    const rotateOverlay  = document.getElementById('rotateOverlay');
    const canvasScreen   = document.querySelector('.canvas-screen');

    const isLandscape = () =>
        window.matchMedia('(orientation: landscape)').matches ||
        Math.abs(window.innerWidth) > Math.abs(window.innerHeight);

    const isTouchLike = () =>
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;
        
    const isMobileViewport = () =>
    Math.min(window.innerWidth, window.innerHeight) <= 900;
    
    const isMobileOrEmulated = () => isTouchLike() && isMobileViewport();

    let keyboardUsed = false;
    window.addEventListener('keydown', () => keyboardUsed = true);
    
    function computeUIFlags() {
        const mobile = isMobileOrEmulated();
        const landscape = isLandscape();
        return {
            showMobile: mobile && !keyboardUsed && landscape && window.gameStarted,
            showRotate: mobile && !landscape,
            hideMobile: mobile && landscape && window.gameOver
        };
    }

    function updateMobileVisibility(flags) {
        mobileControls.style.display = flags.showMobile ? 'flex' : 'none';
        if (flags.hideMobile) mobileControls.style.display = 'none';
        mobileControls.setAttribute('aria-hidden', String(!flags.showMobile));
    }

    function updateRotateOverlay(flags) {
        rotateOverlay.style.display = flags.showRotate ? 'flex' : 'none';
        rotateOverlay.setAttribute('aria-hidden', String(!flags.showRotate));
        canvasScreen.classList.toggle('blocked', flags.showRotate);
    }

    function updatePauseState(flags) {
        if (!window.gameStarted) return;
        if (flags.showRotate) window.pauseGame?.();
        else window.resumeGame?.();
    }


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

    ['contextmenu'].forEach(evt => {
        mobileControls.addEventListener(evt, e => e.preventDefault(), { passive: false });
    });
    
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

    function attachControlEvents(el, handlers) {
        el.addEventListener('pointerdown', handlers.press, { passive: false });
        el.addEventListener('pointerup', handlers.release, { passive: false });
        el.addEventListener('pointercancel', handlers.release, { passive: false });
        el.addEventListener('pointerleave', handlers.release, { passive: false });
    }
    
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

    window.MobileUI = {
        applyUIState,
        bindMobileControls
    };
    setupPauseButton();
})();