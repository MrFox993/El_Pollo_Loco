/**
 * Manages background music, sound effects, mute state, keyboard shortcuts,
 * and optional UI integration for mute toggling.
 */
class AudioManager {
    /**
    *  Creates a new AudioManager instance.
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
        this.mode = 'menu';

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
    this._autoplayForCurrentMode();

    // // BGM after first User-Interaction 
    
    //     if (this.audios.has('bgmMenu')) {
    //     const startMenuIfNeeded = () => {
    //         if (this.mode !== 'menu') return;
    //         this.play('bgmMenu');
    //     };
    //     document.addEventListener('click',   startMenuIfNeeded, { once: true });
    //     document.addEventListener('keydown', startMenuIfNeeded, { once: true });
    //     }


        // DOM-Wiring, if DOM is ready
        this._initDomWhenReady();
}

    /**
     * Loads persisted mute state from LocalStorage.
     *
     * @returns {boolean} True if muted, otherwise false.
     * @private
     */
    _loadMuted() {
        try {
        const val = localStorage.getItem(this.storageKey);
        return val === 'true';
        } catch {
        return false;
        }
    }
    
    /**
     * Saves current mute state to LocalStorage.
     *
     * @private
     */
    _saveMuted() {
        try {
        localStorage.setItem(this.storageKey, String(this.isMuted));
        } catch {
        /* ignore */
        }
    }

    /**
     * Applies current mute state to all audio objects.
     *
     * @private
     */
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

    _autoplayForCurrentMode() {
        const track = this.mode === 'game' ? 'bgmGame' : 'bgmMenu';
        if (!this.audios.has(track)) return; 
        this._playAutoplaySafe(track); 
    }

    _playAutoplaySafe(name) { 
        const audio = this.audios.get(name); 
        if (!audio) return;

        try {
            const p = audio.play(); 
            if (p && typeof p.catch === 'function') {
                p.catch(() => this._setupAutoplayFallback(name)); 
            } 
        } catch { 
            this._setupAutoplayFallback(name); 
        } 
    }

    _setupAutoplayFallback(name) { 
        const handler = () => { 
            const a = this.audios.get(name); 
            if (a) a.play().catch(() => {}); 
            document.removeEventListener('click', handler); 
            document.removeEventListener('keydown', handler); 
        }; 
        document.addEventListener('click', handler, { once: true }); 
        document.addEventListener('keydown', handler, { once: true }); 
    }
    
    /**
     * Toggles between muted and unmuted.
     *
     * @returns {void}
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        this._applyMute();
        this._saveMuted();
        this._syncMuteButtonUI();
    }

    /**
     * Sets the global mute state.
     *
     * @param {boolean} muted
     *   If true: mute all sounds. If false: unmute.
     */
    setMuted(muted) {
        this.isMuted = !!muted;
        this._applyMute();
        this._saveMuted();
        this._syncMuteButtonUI();
    }

    /**
     * Plays an audio track by name.
     *
     * @param {string} name
     *   The key from the definitions object.
     *
     * @returns {void}
     */
    play(name) {
        const audio = this.audios.get(name);
        if (!audio) return;
        if (!audio.loop) audio.currentTime = 0;
        audio.play().catch(() => {});
    }
    
    /**
     * Stops an audio track by name and resets its position.
     *
     * @param {string} name
     *   The track to stop.
     */
    stop(name) {
        const audio = this.audios.get(name);
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
    }

    /**
     * Stops all audio tracks and resets their positions.
     */
    stopAll() {
        this.audios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        });
    }      

    /**
     * Sets current mode used to determine menu/game background music logic.
     *
     * @param {'menu'|'game'} mode
     */
    setMode(mode) {
        this.mode = mode === 'game' ? 'game' : 'menu';
    }

    /** Plays menu background music. */
    playMenuBgm() { this.play('bgmMenu'); }
    /** Stops menu background music. */
    stopMenuBgm() { this.stop('bgmMenu'); }
    /** Plays game background music. */
    playGameBgm() { this.play('bgmGame'); }
    /** Stops game background music. */
    stopGameBgm() { this.stop('bgmGame'); }
    /** Plays footstep sound effect. */
    playFootsteps() { this.play('footsteps'); }
    /** Stops footstep sound effect. */
    stopFootsteps() { this.stop('footsteps'); }
    /** Plays HP lost sound effect. */
    playHpLost()    { this.play('hpLost'); }
    /** Plays enemy hit sound effect. */
    playEnemyHit()  { this.play('enemyHit'); }

    /**
     * Delays DOM wiring until the document is ready.
     *
     * @private
     */
    _initDomWhenReady() {
        const ready = document.readyState === 'interactive' || document.readyState === 'complete';
        if (ready) {
            this._wireDom();
        } else {
            document.addEventListener('DOMContentLoaded', () => this._wireDom(), { once: true });
        }
    }
    
    /**
     * Attaches DOM event handlers:
     * - click on mute button
     * - keyboard shortcut for mute
     *
     * @private
     */
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

    /**
     * Updates button UI to reflect mute state:
     * - aria attributes
     * - tooltip text
     * - mute/unmute icon
     *
     * @private
     */
    _syncMuteButtonUI() {
        if (!this.muteBtn) return;

    // ARIA / Title
    this.muteBtn.setAttribute('aria-pressed', String(this.isMuted));
    this.muteBtn.title = this.isMuted ? 'Sound on (Key M)' : 'Sound off (Key M)';

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
