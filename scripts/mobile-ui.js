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

    const pauseBtn = document.querySelector('#btnPause');
    if (pauseBtn) {
        pauseBtn.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            window.gamePaused ? window.resumeGame() : window.pauseGame();
            pauseBtn.classList.add('pressed');
        });
        pauseBtn.addEventListener('pointerup', (e) => {
            e.preventDefault();
            pauseBtn.classList.remove('pressed');
        });
    }

    function bindMobileControls(keyboard) {
        const bindings = [
        { sel: '#btnLeft',  key: 'left'  },
        { sel: '#btnRight', key: 'right' },
        { sel: '#btnJump',  key: 'up'    },
        { sel: '#btnThrow', key: 'c' },
        ];

    bindings.forEach(({ sel, key }) => {
        const el = document.querySelector(sel);
        if (!el) return;

        const down = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (keyboard[key] !== undefined) keyboard[key] = true;
            el.classList.add('pressed');
        };
        const up = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (keyboard[key] !== undefined) keyboard[key] = false;
            el.classList.remove('pressed');
        };

        el.addEventListener('pointerdown', down, { passive: false });
        el.addEventListener('pointerup', up, { passive: false });
        el.addEventListener('pointercancel', up, { passive: false });
        el.addEventListener('pointerleave', up, { passive: false });
        });
    }

    if (window.keyboard) {
        bindMobileControls(window.keyboard);
    }

    window.MobileUI = {
        applyUIState,
        bindMobileControls
    };
})();