(function () {
    const mobileControls = document.getElementById('mobileControls');
    const rotateOverlay  = document.getElementById('rotateOverlay');
    const canvasScreen   = document.querySelector('.canvas-screen');

    const isCoarseInput = () => window.matchMedia('(pointer: coarse)').matches;
    const isLandscape = () =>
        window.matchMedia('(orientation: landscape)').matches ||
        Math.abs(window.innerWidth) > Math.abs(window.innerHeight);
        
    function applyUIState() {
        const coarse = isCoarseInput();
        const landscape = isLandscape();
        const gameStarted = Boolean(window.gameStarted);

        const showMobile = coarse && landscape && gameStarted;
        const showRotate = coarse && !landscape;

        mobileControls.setAttribute('aria-hidden', String(!showMobile));
        rotateOverlay.setAttribute('aria-hidden', String(!showRotate));

        // mobileControls.style.display = showMobile ? 'flex' : 'none';
        rotateOverlay.style.display  = showRotate ? 'flex' : 'none';

        canvasScreen.classList.toggle('blocked', showRotate);
    }

    window.addEventListener('resize', applyUIState);
    if (window.screen && window.screen.orientation) {
        window.screen.orientation.addEventListener('change', applyUIState);
    }
    // document.addEventListener('DOMContentLoaded', applyUIState);
    applyUIState();

    ['contextmenu'].forEach(evt => {
        mobileControls.addEventListener(evt, e => e.preventDefault(), { passive: false });
    });

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