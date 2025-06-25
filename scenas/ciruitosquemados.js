class CircuitosQuemados extends Phaser.Scene {
    constructor() {
        super({ key: 'CircuitosQuemados' });
        this.componentPositions = {};
        this.outlines = {};
        this.infoBox = null;
        this.correctlyPlaced = 0;
        this.totalComponents = 3;
        this.gameOver = false;
        this.componentDescriptions = {
            bateria: 'BATERÍA:\nProporciona la energía para que todo el circuito funcione. Es la fuente de poder.',
            condensador: 'CONDENSADOR:\nAlmacena y libera energía rápidamente. Ayuda a estabilizar el voltaje en el circuito.',
            resistor: 'RESISTOR:\nLimita el flujo de corriente eléctrica. Protege otros componentes de recibir demasiada energía.'
        };

        this.zoneColors = {
            bateria: 0xff0000,
            condensador: 0x00ff00,
            resistor: 0x0000ff
        };

    }
    preload() {
        this.load.on('loaderror', function (file) {
            console.error('Error al cargar el archivo:', file.key, file.url);
        });
        this.load.image('fondoCircuitos', 'assets/rompecabezas/Taller.jpg');
        this.load.image('bateria', 'assets/ScenaFallos/bateria.png');
        this.load.image('condensador', 'assets/CircuitosQuemados/condensador.png');
        this.load.image('resistor', 'assets/ScenaFallos/resistor.png');

        this.load.image('placaCircuitos', 'assets/CircuitosQuemados/arduino.png');
    }
    create() {
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'fondoCircuitos').setOrigin(0.5);
        const placa = this.add.image(this.cameras.main.centerX + 100, this.cameras.main.centerY + 50, 'placaCircuitos').setScale(0.8);
        this.add.text(this.cameras.main.centerX, 30, 'Repara el Circuito', { fontSize: '32px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);

        const pinPositions = {
            bateria: { x: -100, y: 80 },
            condensador: { x: 120, y: -90 },
            resistor: { x: 50, y: 80 },
        };
        const dropZones = {};
        for (const componentName in pinPositions) {
            const pos = pinPositions[componentName];
            const zone = this.add.zone(placa.x + pos.x, placa.y + pos.y, 50, 50).setRectangleDropZone(50, 50);
            zone.setName(componentName);
            dropZones[componentName] = zone;
            const graphics = this.add.graphics();
            graphics.lineStyle(3, this.zoneColors[componentName], 0.8);
            graphics.strokeRect(zone.x - zone.width / 2, zone.y - zone.height / 2, zone.width, zone.height);
        }
        const componentNames = ['bateria', 'condensador', 'resistor'];
        // Espaciado mejorado para 4 componentes de forma vertical y centrada
        const startY = this.cameras.main.centerY - ((componentNames.length - 1) * 70);
        componentNames.forEach((name, index) => {
    // Posición vertical dinámica
    const posX = 120;
    // Ajuste de layout: sube el inicio y aumenta el espacio
    const startYFixed = 70;
    const verticalSpacing = 160;
    const posY = startYFixed + index * verticalSpacing;

    // Crear el sprite del componente
    const component = this.add.sprite(posX, posY, name).setInteractive();
    component.setName(name);
    this.input.setDraggable(component);
    this.componentPositions[name] = { x: component.x, y: component.y };

    // Borde difuminado (sombra)
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.25);
    shadow.fillRoundedRect(component.x - component.width/2 - 6, component.y - component.height/2 - 6, component.width + 12, component.height + 18, 16);
    shadow.setDepth(component.depth - 1); // Detrás del componente

    // Borde de color
    const outline = this.add.graphics();
    outline.lineStyle(4, this.zoneColors[name], 1);
    outline.strokeRoundedRect(0, 0, component.width, component.height, 12);
    outline.setPosition(component.x - component.width / 2, component.y - component.height / 2);
    outline.setVisible(false);
    this.outlines[name] = outline;

        // Offset especial para el diodo
    // Offset dinámico según el tamaño del sprite (mínimo 30px)
    const labelOffset = Math.max(component.displayHeight / 2 + 18, 30);
    const label = this.add.text(component.x, component.y + labelOffset, name.toUpperCase(), {
        fontSize: '18px',
        fill: '#fff',
        fontStyle: 'bold',
        align: 'center',
        stroke: '#222',
        strokeThickness: 3,
        resolution: 2
    }).setOrigin(0.5, 0);
    label.setDepth(4000); // Siempre encima de todo
    label.isLabelComponent = true;

    component.label = label;
    component.shadow = shadow;

    // Al arrastrar, mover sombra y label
    component.on('drag', function(pointer, dragX, dragY) {
        shadow.setPosition(dragX - component.width / 2 - 6, dragY - component.height / 2 - 6);
        label.setPosition(dragX, dragY + labelOffset);
    });
    // Al soltar, restaurar posiciones si no se colocó correctamente
    component.on('dragend', function(pointer) {
        if (component.input.enabled) {
            shadow.setPosition(component.x - component.width / 2 - 6, component.y - component.height / 2 - 6);
            label.setPosition(component.x, component.y + labelOffset);
        }
    });
});
        this.input.on('dragstart', (pointer, gameObject) => {
            if (this.gameOver) return;
            this.children.bringToTop(gameObject);
            const outline = this.outlines[gameObject.name];
            this.children.bringToTop(outline);
            outline.setVisible(true);
        });
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (this.gameOver) return;
            gameObject.x = dragX;
            gameObject.y = dragY;
            this.outlines[gameObject.name].setPosition(dragX - gameObject.width / 2, dragY - gameObject.height / 2);
        });
        this.input.on('dragend', (pointer, gameObject, dropped) => {
            if (this.gameOver) return;
            this.outlines[gameObject.name].setVisible(false);
            if (!dropped) {
                gameObject.x = this.componentPositions[gameObject.name].x;
                gameObject.y = this.componentPositions[gameObject.name].y;
            }
        });
        this.input.on('drop', (pointer, gameObject, dropZone) => {
            if (this.gameOver) return;
            if (gameObject.name === dropZone.name) {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.input.enabled = false;
                this.correctlyPlaced++;
                this.showComponentInfo(gameObject.name);
                if (this.correctlyPlaced === this.totalComponents) {
                    // Espera a que desaparezca el infoBox antes de mostrar felicitación y pasar de escena
                    const waitForInfoBox = () => {
                        if (this.infoBox) {
                            this.time.delayedCall(100, waitForInfoBox, [], this);
                        } else {
                            // Fondo negro semitransparente con borde blanco y esquinas redondeadas
                            const boxWidth = 600;
                            const boxHeight = 140;
                            const boxX = this.cameras.main.centerX - boxWidth / 2;
                            const boxY = this.cameras.main.centerY - boxHeight / 2;
                            const box = this.add.graphics();
                            box.fillStyle(0x000000, 0.88);
                            box.fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 28);
                            box.lineStyle(4, 0xffffff, 0.8);
                            box.strokeRoundedRect(boxX, boxY, boxWidth, boxHeight, 28);
                            box.setDepth(9999);
                            // Texto grande, blanco, centrado, con sombra
                            const congratsText = this.add.text(
                                this.cameras.main.centerX,
                                this.cameras.main.centerY,
                                '¡Felicitaciones!\nEl circuito funciona correctamente.',
                                {
                                    fontSize: '32px',
                                    fill: '#fff',
                                    align: 'center',
                                    fontFamily: 'Arial, sans-serif',
                                    fontStyle: 'bold',
                                    wordWrap: { width: 520 },
                                    stroke: '#222',
                                    strokeThickness: 2,
                                    shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 4, fill: true }
                                }
                            ).setOrigin(0.5).setDepth(10000);
                            this.time.delayedCall(4000, () => {
                                this.scene.start("ArduinoGameScene"); // Cambia 'SiguienteEscena' por el nombre real de tu siguiente escena
                            });
                        }
                    };
                    waitForInfoBox();
                }
            } else {
                gameObject.x = this.componentPositions[gameObject.name].x;
                gameObject.y = this.componentPositions[gameObject.name].y;
            }
        });
    }

    showComponentInfo(componentName) {
        if (this.infoBox) {
            this.infoBox.destroy();
            this.infoBox = null;
        }
        const description = this.componentDescriptions[componentName];
        if (!description) return;
        const infoContainer = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
        const box = this.add.graphics();
        box.fillStyle(0x000000, 0.88);
        box.fillRoundedRect(-250, -100, 500, 200, 32);
        box.lineStyle(4, 0xffffff, 0.7);
        box.strokeRoundedRect(-250, -100, 500, 200, 32);
        const infoText = this.add.text(0, 0, description, {
            fontSize: '22px',
            fill: '#fff',
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: 460 }
        }).setOrigin(0.5);
        infoContainer.add([box, infoText]);
        infoContainer.setDepth(5000); // Siempre encima de todo
        // Oculta los labels de los componentes para que el infoBox no se tape
        if (!this.hiddenLabels) this.hiddenLabels = [];
        this.hiddenLabels = [];
        this.children.list.forEach(child => {
            if (child.isLabelComponent) {
                child.setVisible(false);
                this.hiddenLabels.push(child);
            }
        });
        this.infoBox = infoContainer;
        this.time.delayedCall(3000, () => {
            if (this.infoBox && this.infoBox.scene) {
                this.infoBox.destroy();
                this.infoBox = null;
                // Vuelve a mostrar los labels
                if (this.hiddenLabels) {
                    this.hiddenLabels.forEach(lbl => lbl.setVisible(true));
                }
            }
        });
    }
    update() {}
}
