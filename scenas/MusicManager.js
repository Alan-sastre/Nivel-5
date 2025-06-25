class MusicManager {
    constructor() {
        if (MusicManager.instance) {
            return MusicManager.instance;
        }

        MusicManager.instance = this;
        this.music = null;
        this.isPlaying = false;
    }

    static getInstance() {
        if (!MusicManager.instance) {
            MusicManager.instance = new MusicManager();
        }
        return MusicManager.instance;
    }

    setMusic(music) {
        this.music = music;
    }

    playMusic() {
        if (this.music && !this.isPlaying) {
            this.music.play({ volume: 0.1, loop: true });
            this.isPlaying = true;
        }
    }

    stopMusic() {
        if (this.music && this.isPlaying) {
            this.music.stop();
            this.isPlaying = false;
        }
    }

    pauseMusic() {
        if (this.music && this.isPlaying) {
            this.music.pause();
            this.isPlaying = false;
        }
    }

    resumeMusic() {
        if (this.music && !this.isPlaying) {
            this.music.resume();
            this.isPlaying = true;
        }
    }
}