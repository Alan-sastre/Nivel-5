class scenaFallos extends Phaser.Scene {
  constructor() {
    super({ key: "scenaFallos"});
    this.musicManager = MusicManager.getInstance();
    this.isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(
      navigator.userAgent
    );

    this.scanner = null;
    this.faultyComponents = [];
    this.foundFaults = 0;
    this.totalFaults = 5;
    this.scannerActive = false;
    this.gameCompleted = false;

    this.componentImages = [
      'bateria',
      'circuito integrado',
      'placa',
      'procesador',
      'resistor',
      'sensor'
    ];

    this.componentDescriptions = {
      'bateria': 'Batería: Proporciona energía al sistema.',
      'circuito integrado': 'Circuito Integrado: Contiene múltiples componentes electrónicos para funciones específicas.',
      'placa': 'Placa: Conecta y soporta los componentes electrónicos.',
      'procesador': 'Procesador: Ejecuta las instrucciones y procesa los datos del sistema.',
      'resistor': 'Resistor: Limita el flujo de corriente eléctrica.',
      'sensor': 'Sensor: Detecta cambios en el entorno y envía señales.'
    };

    // Definir el área principal para los componentes
    this.componentArea = {
      x: 100, // Margen izquierdo
      y: 150, // Margen superior para textos y botones
      width: 600, // Ancho del área de componentes (800 - 2*margen)
      height: 350 // Altura del área de componentes (600 - margen superior - margen inferior)
    };
  }

  preload() {
    this.load.image("key_nuevo_fondo", "assets/ScenaFallos/fondo.jpg"); // NUEVO: Carga tu nuevo fondo
    this.componentImages.forEach(imgName => {
      this.load.image(imgName, `assets/ScenaFallos/${imgName}.png`);
    });
  }

  create() {
    // this.add.image(400, 300, 'background'); // Fondo original, puedes comentarlo o eliminarlo
    this.add.image(400, 300, 'key_nuevo_fondo'); // NUEVO: Añade tu nuevo fondo a la escena

    // Título con mejor estilo
    this.add.text(400, 50, 'INSPECCIÓN DE ENERGÍA', {
      fontSize: '32px',
      fill: '#76ff03', // Verde lima brillante
      fontFamily: '"Arial Black", Gadget, sans-serif',
      stroke: '#000000',
      strokeThickness: 5
    }).setOrigin(0.5);

    // Instrucciones más sutiles
    this.add.text(400, 95, 'Activa el escáner y detecta los componentes defectuosos.', {
      fontSize: '16px',
      fill: '#bbdefb', // Azul claro
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5);

    // Contador de fallos con mejor estilo
    this.faultCounter = this.add.text(this.componentArea.x, this.componentArea.y - 30, `Detectados: ${this.foundFaults}/${this.totalFaults}`, {
      fontSize: '20px',
      fill: '#ffeb3b', // Amarillo
      fontFamily: '"Courier New", Courier, monospace',
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: { x: 10, y: 5 }
    });

    this.createComponentsInArea();
    this.createScanner();

    this.input.on('pointermove', this.moveScanner, this);
    this.input.on('pointerdown', this.activateScanner, this);

    // Botón de escáner mejorado
    const scannerButton = this.add.graphics();
    scannerButton.fillStyle(0x0288d1, 1); // Azul oscuro
    scannerButton.fillRoundedRect(this.game.config.width - 170, this.componentArea.y - 40, 150, 50, 15);
    scannerButton.setInteractive(new Phaser.Geom.Rectangle(this.game.config.width - 170, this.componentArea.y - 40, 150, 50), Phaser.Geom.Rectangle.Contains);

    this.scannerButtonText = this.add.text(this.game.config.width - 95, this.componentArea.y - 15, 'ESCÁNER OFF', {
      fontSize: '16px',
      fill: '#ffffff',
      fontFamily: '"Arial Black", Gadget, sans-serif'
    }).setOrigin(0.5);

    scannerButton.on('pointerdown', () => {
      this.scannerActive = !this.scannerActive;
      scannerButton.clear();
      if (this.scannerActive) {
        scannerButton.fillStyle(0xd32f2f, 1); // Rojo cuando está ON
        this.scannerButtonText.setText('ESCÁNER ON');
      } else {
        scannerButton.fillStyle(0x0288d1, 1); // Azul cuando está OFF
        this.scannerButtonText.setText('ESCÁNER OFF');
      }
      scannerButton.fillRoundedRect(this.game.config.width - 170, this.componentArea.y - 40, 150, 50, 15);
    });
  }

  // Renombrado de createCircuits a createComponentsInArea
  createComponentsInArea() {
    const componentCount = Phaser.Math.Between(10, 15);
    const allCreatedComponents = [];
    let placedComponentTypes = []; // Para rastrear los tipos ya colocados en la primera pasada

    // Copia y baraja los tipos de imágenes para la primera pasada
    let availableImageTypes = Phaser.Utils.Array.Shuffle([...this.componentImages]);

    for (let i = 0; i < componentCount; i++) {
      const x = this.componentArea.x + Phaser.Math.Between(30, this.componentArea.width - 30);
      const y = this.componentArea.y + Phaser.Math.Between(30, this.componentArea.height - 30);

      let tooClose = false;
      allCreatedComponents.forEach(existingComponent => {
        if (Phaser.Math.Distance.Between(x, y, existingComponent.x, existingComponent.y) < 60) {
          tooClose = true;
        }
      });

      if (tooClose) {
        i--; // Intenta de nuevo para este índice
        continue;
      }

      let imageName;
      // Primera pasada: intentar colocar cada tipo de imagen único
      if (availableImageTypes.length > 0) {
        imageName = availableImageTypes.pop(); // Toma un tipo de la lista barajada
        placedComponentTypes.push(imageName);
      } else {
        // Segunda pasada: si ya se colocaron todos los tipos únicos, elige al azar de todos los disponibles
        imageName = Phaser.Utils.Array.GetRandom(this.componentImages);
      }

      const component = this.createComponent(x, y, imageName); // Pasamos imageName a createComponent
      allCreatedComponents.push(component);
    }

    // La lógica para seleccionar componentes defectuosos permanece igual
    this.faultyComponents = [];
    const faultyComponentTypes = new Set();
    Phaser.Utils.Array.Shuffle(allCreatedComponents);

    for (const component of allCreatedComponents) {
      if (this.faultyComponents.length >= this.totalFaults) {
        break;
      }
      const componentType = component.getData('type');
      if (!faultyComponentTypes.has(componentType)) {
        component.setData('isFaulty', true);
        faultyComponentTypes.add(componentType);
        this.faultyComponents.push({
          component: component,
          found: false,
          scanned: false
        });
      }
    }

    if (this.faultyComponents.length < this.totalFaults) {
      console.warn("No se pudieron encontrar suficientes tipos únicos de componentes defectuosos. Completando con duplicados si es necesario.");
      for (const component of allCreatedComponents) {
        if (this.faultyComponents.length >= this.totalFaults) {
          break;
        }
        if (!this.faultyComponents.some(fc => fc.component === component)) {
          component.setData('isFaulty', true);
          this.faultyComponents.push({
            component: component,
            found: false,
            scanned: false
          });
        }
      }
    }

    if (this.faultyComponents.length < this.totalFaults) {
      console.error("No se pudieron crear suficientes componentes para alcanzar totalFaults, incluso con duplicados. Total de defectuosos será: " + this.faultyComponents.length);
      this.totalFaults = this.faultyComponents.length;
    }

    this.faultCounter.setText(`Detectados: ${this.foundFaults}/${this.totalFaults}`);
  }

  // Modificar createComponent para aceptar imageName directamente
  createComponent(x, y, imageName) { // Se elimina isFaulty, imageName se pasa directamente
    // const imageName = Phaser.Utils.Array.GetRandom(this.componentImages); // Ya no se selecciona aquí
    const component = this.add.image(x, y, imageName);
    component.setScale(1.2);

    component.setData('isFaulty', false);
    component.setData('type', imageName);
    component.setTint(0xccffcc);

    return component;
  }

  createScanner() {
    this.scanner = this.add.circle(0, 0, 35, 0x00ffff, 0.25) // Un poco más grande y sutil
      .setStrokeStyle(2, 0x00ffff)
      .setVisible(false);

    this.scanEffect = this.add.circle(0, 0, 55, 0x00ffff, 0.1)
      .setStrokeStyle(1, 0x00ffff)
      .setVisible(false);
  }

  moveScanner(pointer) {
    if (this.scannerActive && !this.gameCompleted) {
      this.scanner.setPosition(pointer.x, pointer.y);
      this.scanEffect.setPosition(pointer.x, pointer.y);
      this.scanner.setVisible(true);
      this.scanEffect.setVisible(true);
    } else {
      this.scanner.setVisible(false);
      this.scanEffect.setVisible(false);
    }
  }

  activateScanner(pointer) {
    if (!this.scannerActive || this.gameCompleted) return;

    this.tweens.add({
      targets: this.scanEffect,
      scale: { from: 1, to: 1.5 },
      alpha: { from: 0.2, to: 0 },
      duration: 300,
      onComplete: () => {
        this.scanEffect.setScale(1);
        this.scanEffect.setAlpha(0.1);
      }
    });

    this.checkForFaults(pointer.x, pointer.y);
  }

  checkForFaults(x, y) {
    if (this.gameCompleted) return;

    let componentScannedThisClick = null;

    this.faultyComponents.forEach(fault => {
      if (!componentScannedThisClick && this.scanner.getBounds().contains(fault.component.x, fault.component.y)) {
        componentScannedThisClick = fault;

        const componentType = fault.component.getData('type');
        const description = this.componentDescriptions[componentType] || 'Componente desconocido.';

        if (fault.component.getData('isFaulty')) {
          if (!fault.found) {
            fault.found = true;
            this.foundFaults++;
            this.faultCounter.setText(`Detectados: ${this.foundFaults}/${this.totalFaults}`);

            fault.component.setTint(0xff6666); // Tinte rojo para defectuosos encontrados
            this.tweens.add({
              targets: fault.component,
              scale: fault.component.scale * 1.3,
              duration: 150,
              yoyo: true,
              ease: 'Cubic.easeInOut'
            });

            const combinedMessage = `${description}\n¡COMPONENTE DEFECTUOSO ENCONTRADO!`;
            this.showTemporaryMessage(combinedMessage, 0xffcc00, y - 50, 3500);

            if (this.foundFaults === this.totalFaults) {
              this.completeGame();
            }
          } else {
            this.showTemporaryMessage(description, 0xbbdefb, y - 30, 3000);
          }
        } else { // Componente no defectuoso
          // if (!fault.scanned) { // Ya no es necesario comprobar si fue escaneado para el tinte
          //    fault.component.setTint(0xaaaaff); // ELIMINADO: Esta línea aplicaba el tinte azul
          // }
          this.showTemporaryMessage(description, 0xbbdefb, y - 30, 3000);
        }
        fault.scanned = true; // Se marca como escaneado para la lógica de mensajes, etc.
      }
    });
  }

  // Modificamos showTemporaryMessage para manejar múltiples instancias de mensajes
  // en lugar de una sola this.currentMessage, para evitar que se pisen.
  showTemporaryMessage(text, color, yPosition, duration = 1500) {
    const message = this.add.text(this.game.config.width / 2, yPosition, text, {
      fontSize: '18px',
      fill: `#${color.toString(16)}`,
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'rgba(0,0,0,0.7)', // Fondo un poco más opaco
      padding: { x: 10, y: 5 },
      align: 'center',
      wordWrap: { width: this.game.config.width * 0.8 } // Para que el texto se ajuste si es largo
    }).setOrigin(0.5);

    // Hacer que el mensaje desaparezca después de la duración
    this.time.delayedCall(duration, () => {
      if (message && message.active) { // Comprobar si el mensaje todavía existe y está activo
        message.destroy();
      }
    });
  }

  completeGame() {
    this.gameCompleted = true;
    this.scannerActive = false;
    this.scanner.setVisible(false);
    this.scanEffect.setVisible(false);

    // NUEVO: Mensaje de felicitaciones
    const congratulationsText = this.add.text(this.game.config.width / 2, this.game.config.height / 2 - 50, '¡FELICITACIONES!', {
      fontSize: '48px',
      fill: '#76ff03', // Verde lima brillante
      fontFamily: '"Arial Black", Gadget, sans-serif',
      stroke: '#000000',
      strokeThickness: 6,
      align: 'center'
    }).setOrigin(0.5);

    const subText = this.add.text(this.game.config.width / 2, this.game.config.height / 2 + 20, '¡Has completado la inspección!', {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        align: 'center'
    }).setOrigin(0.5);

    // NUEVO: Transición a la siguiente escena después de 5 segundos
    this.time.delayedCall(5000, () => {
        // Asegúrate de que la música de esta escena se detenga si es necesario
        // if (this.musicManager && this.musicManager.getCurrentMusicKey() === 'fallosMusic') {
        //    this.musicManager.stopMusic('fallosMusic');
        // }
        this.scene.start("scenaVideo2"); // REEMPLAZA con la key de tu siguiente escena
    });

    console.log("Juego completado. Todos los fallos encontrados.");
  }

  resetGameState() {
    this.gameCompleted = false;
    this.scannerActive = false;
    this.scanner.setVisible(false);
    this.scanEffect.setVisible(false);


  }

  update() {
    // Lógica de actualización si es necesaria
  }
}
