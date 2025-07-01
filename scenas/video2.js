class scenaVideo2 extends Phaser.Scene {
  constructor() {
    super({ key: "scenaVideo2" });
  }

  preload() {
    this.load.video("video2", "assets/video2/video2.mp4", "loadeddata");
  }

  create() {
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    // Pausar la música usando el AudioManager
    const audioManager = this.scene.get("AudioManager");
    if (audioManager) {
      audioManager.pauseMusic();
    }

    this.add.rectangle(
      screenWidth / 2,
      screenHeight / 2,
      screenWidth,
      screenHeight,
      0x000000
    );

    const video = this.add.video(screenWidth / 2, screenHeight / 2, "video2");

    const videoElement = video.video;
    videoElement.muted = false;

    video.on("play", () => {
      const videoWidth = videoElement.videoWidth;
      const videoHeight = videoElement.videoHeight;

      if (videoWidth && videoHeight) {
        const videoAspectRatio = videoWidth / videoHeight;
        const screenAspectRatio = screenWidth / screenHeight;

        if (videoAspectRatio > screenAspectRatio) {
          video.setDisplaySize(screenWidth, screenWidth / videoAspectRatio);
        } else {
          video.setDisplaySize(screenHeight * videoAspectRatio, screenHeight);
        }
      }
    });

    video.play();

    // --- Barra de volumen interactiva ---
    const sliderContainer = document.createElement('div');
    sliderContainer.style.position = 'absolute';
    sliderContainer.style.left = '50%';
    sliderContainer.style.bottom = '60px';
    sliderContainer.style.transform = 'translateX(-50%)';
    sliderContainer.style.zIndex = 1000;
    sliderContainer.style.background = 'rgba(30,30,30,0.85)';
    sliderContainer.style.borderRadius = '16px';
    sliderContainer.style.padding = '16px 28px 12px 28px';
    sliderContainer.style.display = 'flex';
    sliderContainer.style.alignItems = 'center';
    sliderContainer.style.boxShadow = '0 4px 16px rgba(0,0,0,0.35)';

    const icon = document.createElement('span');
    icon.innerHTML = '🔊';
    icon.style.fontSize = '1.6em';
    icon.style.marginRight = '12px';
    sliderContainer.appendChild(icon);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 100;
    slider.value = 100;
    slider.style.width = '220px';
    slider.style.margin = '0 12px';
    slider.style.accentColor = '#1abc9c';
    slider.style.height = '6px';
    slider.style.borderRadius = '8px';
    slider.title = 'Volumen general';
    sliderContainer.appendChild(slider);

    const valueLabel = document.createElement('span');
    valueLabel.innerText = '100';
    valueLabel.style.fontSize = '1.2em';
    valueLabel.style.marginLeft = '12px';
    valueLabel.style.color = '#1abc9c';
    valueLabel.style.fontWeight = 'bold';
    sliderContainer.appendChild(valueLabel);

    document.body.appendChild(sliderContainer);

    // Acceso al MusicManager
    let musicManager = null;
    if (window.MusicManager && typeof window.MusicManager.getInstance === 'function') {
      musicManager = window.MusicManager.getInstance();
    } else if (typeof MusicManager !== 'undefined' && typeof MusicManager.getInstance === 'function') {
      musicManager = MusicManager.getInstance();
    }

    // Inicializar volumen
    videoElement.volume = 1;
    if (musicManager && musicManager.music) {
      musicManager.music.setVolume(0.15); // Ambiente bajo desde el inicio
    }

    slider.addEventListener('input', function() {
      const vol = slider.value / 100;
      videoElement.volume = vol;
      valueLabel.innerText = slider.value;
      if (musicManager && musicManager.music) {
        musicManager.music.setVolume(vol * 0.15); // Ambiente aún más bajo
      }
      // Feedback visual
      if (vol === 0) icon.innerHTML = '';
      else if (vol < 0.3) icon.innerHTML = '';
      else if (vol < 0.7) icon.innerHTML = '';
      else icon.innerHTML = '';
    });

    video.on("complete", () => {
      // Reanudar la música antes de cambiar de escena
      if (audioManager) {
        audioManager.resumeMusic();
      }
      if (sliderContainer && sliderContainer.parentNode) {
        sliderContainer.parentNode.removeChild(sliderContainer);
      }
      this.scene.start("CircuitosQuemados");
    });

    const buttonStyle = {
      fontSize: "20px",
      fontFamily: "Arial",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: "10px",
      borderRadius: "5px",
    };

    // Botón para activar sonido
    const soundOnButton = this.add
      .text(screenWidth - 150, 50, "🔊 Sonido", buttonStyle)
      .setInteractive()
      .setOrigin(0.5)
      .on("pointerdown", () => {
        videoElement.muted = false;
        // Restaurar ambos volúmenes al valor del slider
        const vol = slider ? slider.value / 100 : 1;
        videoElement.volume = vol;
        if (musicManager && musicManager.music) {
          musicManager.music.setVolume(vol * 0.15);
        }
      });

    // Botón para silenciar
    const soundOffButton = this.add
      .text(screenWidth - 150, 100, "🔇 Silencio", buttonStyle)
      .setInteractive()
      .setOrigin(0.5)
      .on("pointerdown", () => {
        videoElement.muted = true;
        videoElement.volume = 0;
        if (musicManager && musicManager.music) {
          musicManager.music.setVolume(0);
        }
      });

    // Mejorar la interactividad visual de los botones
    [soundOnButton, soundOffButton].forEach((button) => {
      button.setPadding(10);
      button.setStyle({ backgroundColor: "#222", borderRadius: "8px" });
      button.on("pointerover", () =>
        button.setStyle({ backgroundColor: "#444" })
      );
      button.on("pointerout", () =>
        button.setStyle({ backgroundColor: "#222" })
      );
    });
  }
}

window.scenaVideo = scenaVideo;
