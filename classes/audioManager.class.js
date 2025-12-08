class AudioManager {
    /**
    * @param {Object} definitions
    * @param {Object} [options]
    * @param {string|HTMLElement} [options.muteButton]   
    * @param {'img'|'inline'}      [options.iconMode]    
    * @param {string}              [options.iconOn]     
    * @param {string}              [options.iconOff]     
    * @param {string}              [options.shortcutKey]
    * @param {string}              [options.storageKey] 
    */
    constructor(definitions = {}, options = {}) {
        // ---- Options ----
        this.storageKey    = options.storageKey  || 'audioMuted';
        this.shortcutKey   = (options.shortcutKey || 'm').toLowerCase();
        this.iconMode      = options.iconMode    || 'img';
        this.iconOn        = options.iconOn      || 'assets/icons/volume_on.svg';
        this.iconOff       = options.iconOff     || 'assets/icons/volume_off.svg';
        this.muteButtonRef = options.muteButton  || null;

        // ---- Condition & Audio-Objects ----
        this.isMuted = this._loadMuted();
        this.audios  = new Map();

    Object.entries(definitions).forEach(([name, cfg]) => {
        const audio = new Audio(cfg.src);
        audio.loop = !!cfg.loop;
        audio.volume = typeof cfg.volume === 'number' ? cfg.volume : 1.0;
        audio.preload = 'auto';
        this.audios.set(name, audio);
    });

    this._applyMute();

        if (this.audios.has('bgm')) {
        const startBgm = () => this.play('bgm');
        document.addEventListener('click', startBgm, { once: true });
        document.addEventListener('keydown', startBgm, { once: true });
        }

        // DOM-Wiring, if DOM is ready
        this._initDomWhenReady();
    }

  // ---------- Persistence ----------
    _loadMuted() {
        try {
        const val = localStorage.getItem(this.storageKey);
        return val === 'true';
        } catch {
        return false;
        }
    }
    _saveMuted() {
        try {
        localStorage.setItem(this.storageKey, String(this.isMuted));
        } catch {
        /* ignore */
        }
    }

  // ---------- Mute ----------
    _applyMute() {
        const muted = this.isMuted;
        this.audios.forEach(audio => {
        audio.muted = muted;
        if (muted && !audio.loop && !audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
        });
    }
    toggleMute() {
        this.isMuted = !this.isMuted;
        this._applyMute();
        this._saveMuted();
        this._syncMuteButtonUI();
    }
    setMuted(muted) {
        this.isMuted = !!muted;
        this._applyMute();
        this._saveMuted();
        this._syncMuteButtonUI();
    }

  // ---------- Playback ----------
    play(name) {
        const audio = this.audios.get(name);
        if (!audio) return;
        if (!audio.loop) audio.currentTime = 0;
        audio.play().catch(() => {});
    }
    stop(name) {
        const audio = this.audios.get(name);
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
    }

  // ---------- Convenience ----------
    playFootsteps() { this.play('footsteps'); }
    stopFootsteps() { this.stop('footsteps'); }
    playHpLost()    { this.play('hpLost'); }
    playEnemyHit()  { this.play('enemyHit'); }

  // ---------- DOM-Ready & Wiring ----------
    _initDomWhenReady() {
        const ready = document.readyState === 'interactive' || document.readyState === 'complete';
        if (ready) {
            this._wireDom();
        } else {
            document.addEventListener('DOMContentLoaded', () => this._wireDom(), { once: true });
        }
    }

    _wireDom() {
    const btn = typeof this.muteButtonRef === 'string'
        ? document.querySelector(this.muteButtonRef)
        : this.muteButtonRef;

    this.muteBtn = btn || null;

    // UI-Sync (Icon/ARIA/Title) 
    this._syncMuteButtonUI();

    if (this.muteBtn) {
        this.muteBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        this.toggleMute();
        }, false);
    }

    // Shortcut (Taste 'm'),ignore auto-repeat
    window.addEventListener('keydown', (ev) => {
        const key = (ev.key || '').toLowerCase();
        if (key === this.shortcutKey) {
        if (ev.repeat) return;
        ev.preventDefault();
        this.toggleMute();
        }
    }, false);
    }

    _syncMuteButtonUI() {
        if (!this.muteBtn) return;

    // ARIA / Title
    this.muteBtn.setAttribute('aria-pressed', String(this.isMuted));
    this.muteBtn.title = this.isMuted ? 'Sound off (Key M)' : 'Sound on (Key M)';

    if (this.iconMode === 'img') {
        let img = this.muteBtn.querySelector('#muteIcon');
        if (!img) {
        img = document.createElement('img');
        img.id = 'muteIcon';
        img.width = 24; img.height = 24;
        img.alt = '';
        this.muteBtn.prepend(img);
        }
        img.src = this.isMuted ? this.iconOff : this.iconOn;

    } else {
        const svgMuted = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3E2723" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 9v6h4l5 4V5L7 9H3z"></path>
                <path d="M18.7 8.3a1 1 0 0 1 1.4 1.4L18.4 11.4l1.7 1.7a1 1 0 0 1-1.4 1.4L17 12.8l-1.7 1.7a1 1 0 1 1-1.4-1.4l1.7-1.7-1.7-1.7a1 1 0 0 1 1.4-1.4l1.7 1.7 1.7-1.7z"></path>
            </svg>`;
        const svgUnmuted = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3E2723" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 9v6h4l5 4V5L7 9H3z"></path>
                <path d="M14.5 6.5a1 1 0 0 1 1.4.2 7 7 0 0 1 0 10.6 1 1 0 1 1-1.6-1.2 5 5 0 0 0 0-8.2 1 1 0 0 1 .2-1.4z"></path>
                <path d="M16.5 4.5a1 1 0 0 1 1.4.1 10 10 0 0 1 0 14.8 1 1 0 1 1-1.5-1.3 8 8 0 0 0 0-12.2 1  1 0 0 1 .1-1.4z"></path>
            </svg>`;
        let iconSpan = this.muteBtn.querySelector('#muteIcon');
        if (!iconSpan) {
        iconSpan = document.createElement('span');
        iconSpan.id = 'muteIcon';
        iconSpan.setAttribute('aria-hidden', 'true');
        this.muteBtn.prepend(iconSpan);
        }
        iconSpan.innerHTML = this.isMuted ? svgMuted : svgUnmuted;
    }
    }
}

window.AudioManager = AudioManager;
