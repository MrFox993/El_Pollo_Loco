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

    function applyUIState() {
        const mobile = isMobileOrEmulated();
        const landscape = isLandscape();
        const gameStarted = Boolean(window.gameStarted);
      
        const showMobile = mobile && !keyboardUsed && landscape && gameStarted;
        const showRotate = mobile && !landscape;
      
        mobileControls.style.display = showMobile ? 'flex' : 'none';
        rotateOverlay.style.display  = showRotate ? 'flex' : 'none';
      
        mobileControls.setAttribute('aria-hidden', String(!showMobile));
        rotateOverlay.setAttribute('aria-hidden', String(!showRotate));
      
        canvasScreen.classList.toggle('blocked', showRotate);
      
        if (showRotate && gameStarted) {
          window.pauseGame?.();
        } else if (!showRotate && gameStarted) {
          window.resumeGame?.();
        }
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
        { sel: '#btnJump',  key: 'up'    }, // oder 'JUMP' – abhängig von deiner Keyboard-Implementierung
        { sel: '#btnThrow', key: 'c' }, // z.B. 'C' -> Werfen
        ];

    bindings.forEach(({ sel, key }) => {
        const el = document.querySelector(sel);
        if (!el) return;

        const down = (e) => {
            e.preventDefault();
            e.stopPropagation();
            // keyboard.setMobile?.(key, true);   
            if (keyboard[key] !== undefined) keyboard[key] = true;
            el.classList.add('pressed');
        };
        const up = (e) => {
            e.preventDefault();
            e.stopPropagation();
            // keyboard.setMobile?.(key, false);
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