class ArduinoGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ArduinoGameScene' });

        this.arduinoCodeStringArray = [
            "int motor = 9;",
            "int sensorLuz = A0;",
            "",
            "void setup() {",
            "  pinMode(motor, OUTPUT);",
            "}",
            "",
            "void loop() {",
            "  int luz = analogRead(sensorLuz);",
            "  digitalWrite(motor, HIGH);",
            "}"
        ];

        this.questionTextString = "¿Por qué el motor nunca se detiene en este código?";

        this.optionsData = [
          {
            text: "(A) Falta definir sensorLuz como entrada",
            correct: false,
          },
          {
            text: "(B) El motor está encendido permanentemente, gastando energía innecesaria",
            correct: true,
          },
          {
            text: "(C) No hay delay() en el código, lo que genera ineficiencia",
            correct: false,
          },
          {
            text: "(D) Se debe usar digitalRead() en lugar de analogRead() para el sensor de luz",
            correct: false,
          },
        ];

        this.feedbackText = null;
        this.optionObjects = [];
        this.optionBackgrounds = []; // Para los fondos de las opciones
    }

    preload() {
        // Aquí puedes cargar assets si los necesitas
        // Por ejemplo: this.load.image('background', 'assets/background.png');
    }

    create() {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        // --- Fondo de la Escena ---
        this.cameras.main.setBackgroundColor('#2c3e50'); // Un azul oscuro/grisáceo

        // --- Estilos de Texto Mejorados ---
        const titleStyle = { fontSize: '28px', fill: '#ecf0f1', fontFamily: 'Arial, sans-serif', align: 'center', wordWrap: { width: screenWidth * 0.9 }, stroke: '#000000', strokeThickness: 2 };
        const panelTitleStyle = { fontSize: '20px', fill: '#e0e0e0', fontFamily: 'Arial, sans-serif', align: 'left' };
        // Estilo para el bloque de código, manteniendo la fuente monoespaciada
        const codeStyle = { fontSize: '15px', fill: '#f0f0f0', fontFamily: 'Consolas, "Courier New", monospace', lineSpacing: 5, align: 'left', wordWrap: { width: (screenWidth / 2) - 70 } }; // Ajustar ancho para el nuevo panel
        const questionStyle = { fontSize: '20px', fill: '#f1c40f', fontFamily: 'Arial, sans-serif', align: 'left', wordWrap: { width: (screenWidth / 2) - 80 } }; // Amarillo para la pregunta
        // Estilo base para el texto de las opciones - Cambiado a color blanco
        const optionTextStyle = { fontSize: '16px', fill: '#ffffff', fontFamily: 'Arial, sans-serif', align: 'center', wordWrap: { width: (screenWidth / 2) - 120 } };
        const feedbackStyle = { fontSize: '18px', fill: '#ffffff', fontFamily: 'Arial, sans-serif', align: 'center', wordWrap: { width: (screenWidth / 2) - 70 }, padding: { y: 5 } };

        // --- Título General ---
        this.add.text(screenWidth / 2, 50, 'Desafío de Código Arduino', titleStyle).setOrigin(0.5);

        // --- Panel Izquierdo: Código Arduino ---
        const leftPanelX = 20; // Reducir un poco el margen izquierdo para dar más espacio
        const leftPanelY = 100;
        const leftPanelWidth = (screenWidth / 2) - 30; // Aumentar ligeramente el ancho del panel
        const leftPanelHeight = screenHeight - 115; // Aumentar significativamente la altura del panel
        const leftPanelBg = this.add.graphics();
        leftPanelBg.fillStyle(0x34495e, 0.8); // Color de fondo del panel (azul grisáceo más oscuro)
        leftPanelBg.fillRoundedRect(leftPanelX, leftPanelY, leftPanelWidth, leftPanelHeight, 15); // Rectángulo redondeado
        leftPanelBg.lineStyle(2, 0xecf0f1, 0.5); // Borde sutil
        leftPanelBg.strokeRoundedRect(leftPanelX, leftPanelY, leftPanelWidth, leftPanelHeight, 15);

        this.add.text(leftPanelX + 20, leftPanelY + 15, "Código a Analizar:", panelTitleStyle);
        this.add.text(leftPanelX + 20, leftPanelY + 50, this.arduinoCodeStringArray.join('\n'), codeStyle);

        // --- Panel Derecho: Pregunta y Opciones ---
        const rightPanelX = screenWidth / 2 + 10; // Ajustar la posición X del panel derecho
        const rightPanelY = 100;
        const rightPanelWidth = (screenWidth / 2) - 30; // Ajustar el ancho del panel derecho
        const rightPanelHeight = screenHeight - 120; // Igualar altura con el panel izquierdo
        const rightPanelBg = this.add.graphics();
        rightPanelBg.fillStyle(0x34495e, 0.8);
        rightPanelBg.fillRoundedRect(rightPanelX, rightPanelY, rightPanelWidth, rightPanelHeight, 15);
        rightPanelBg.lineStyle(2, 0xecf0f1, 0.5);
        rightPanelBg.strokeRoundedRect(rightPanelX, rightPanelY, rightPanelWidth, rightPanelHeight, 15);

        this.add.text(rightPanelX + 20, rightPanelY + 15, this.questionTextString, questionStyle);

        let optionStartY = rightPanelY + 75; // Espacio después de la pregunta
        const optionHeight = 45; // Alto de cada botón de opción
        const optionSpacingY = 15; // Espacio vertical entre opciones
        const optionButtonWidth = rightPanelWidth - 40; // Ancho del botón de opción

        this.optionObjects = [];
        this.optionBackgrounds = [];

        this.optionsData.forEach((option, index) => {
            const optX = rightPanelX + 20;
            const optY = optionStartY + index * (optionHeight + optionSpacingY);

            // Fondo del botón de opción
            const optionBg = this.add.graphics();
            optionBg.fillStyle(0xecf0f1, 1); // Color de fondo inicial del botón (blanco/gris claro)
            optionBg.fillRoundedRect(optX, optY, optionButtonWidth, optionHeight, 10);

            // Guardar las coordenadas y dimensiones en el objeto gráfico para usarlas después
            optionBg.x = optX;
            optionBg.y = optY;
            optionBg.width = optionButtonWidth;
            optionBg.height = optionHeight;

            this.optionBackgrounds.push(optionBg);

            // Texto de la opción
            const optionLabel = this.add.text(optX + optionButtonWidth / 2, optY + optionHeight / 2, option.text, optionTextStyle).setOrigin(0.5);

            // Crear una zona interactiva explícita que cubra exactamente el área del botón
            const zone = this.add.zone(optX, optY, optionButtonWidth, optionHeight)
                .setOrigin(0)
                .setInteractive()
                .on('pointerdown', () => {
                    this.handleAnswer(option.correct, optionLabel, optionBg, zone);
                })
                .on('pointerover', () => {
                    // Efecto de animación al pasar el ratón
                    this.tweens.add({
                        targets: optionLabel,
                        scaleX: 1.05,
                        scaleY: 1.05,
                        duration: 100,
                        ease: 'Power1'
                    });

                    // Efecto de brillo en el fondo
                    optionBg.clear();
                    optionBg.fillStyle(0x3498db, 1); // Color azul brillante al pasar el mouse
                    optionBg.fillRoundedRect(optX, optY, optionButtonWidth, optionHeight, 10);

                    // Añadir un borde brillante
                    optionBg.lineStyle(2, 0xf1c40f, 1); // Borde amarillo
                    optionBg.strokeRoundedRect(optX, optY, optionButtonWidth, optionHeight, 10);
                })
                .on('pointerout', () => {
                    // Revertir la animación al quitar el ratón
                    this.tweens.add({
                        targets: optionLabel,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 100,
                        ease: 'Power1'
                    });

                    // Volver al color original
                    optionBg.clear();
                    optionBg.fillStyle(0xecf0f1, 1); // Color original
                    optionBg.fillRoundedRect(optX, optY, optionButtonWidth, optionHeight, 10);
                });

            optionLabel.setData('optionBg', optionBg);
            optionLabel.setData('zone', zone);
            this.optionObjects.push(optionLabel);
        });

        // --- Espacio para Feedback (debajo de las opciones) ---
        const feedbackY = optionStartY + (this.optionsData.length * (optionHeight + optionSpacingY)) + 15;
        this.feedbackText = this.add.text(rightPanelX + rightPanelWidth / 2, feedbackY, '', feedbackStyle).setOrigin(0.5, 0);
    }

    handleAnswer(isCorrect, selectedOptionLabel, selectedOptionBg, selectedZone) {
        // Si la zona ya está deshabilitada, no hacer nada
        if (selectedZone.input && !selectedZone.input.enabled) {
            return;
        }

        const correctColor = 0x2ecc71; // Verde para correcto
        const incorrectColor = 0xe74c3c; // Rojo para incorrecto
        const disabledColor = 0x95a5a6; // Gris para deshabilitado
        const disabledTextColor = '#ffffff'; // Cambiado a blanco para mejor visibilidad
        const correctTextColor = '#ffffff'; // Texto blanco para mejor contraste sobre verde/rojo

        if (isCorrect) {
            // Respuesta correcta
            selectedOptionBg.clear();
            selectedOptionBg.fillStyle(correctColor, 1);
            selectedOptionBg.fillRoundedRect(selectedOptionBg.x, selectedOptionBg.y, selectedOptionBg.width, selectedOptionBg.height, 10);
            selectedOptionLabel.setStyle({ fill: correctTextColor });

            // Deshabilitar todas las zonas
            this.optionObjects.forEach((optLabel, idx) => {
                const optBg = this.optionBackgrounds[idx];
                const zone = optLabel.getData('zone');

                if (zone && zone.input) {
                    zone.disableInteractive();
                }

                if (optLabel !== selectedOptionLabel) {
                    optBg.clear();
                    optBg.fillStyle(disabledColor, 1);
                    optBg.fillRoundedRect(optBg.x, optBg.y, optBg.width, optBg.height, 10);
                    optLabel.setStyle({ fill: disabledTextColor });
                }
            });

            if (this.feedbackText) {
                this.feedbackText.setText("¡Correcto! ✅\nEsa es la falla principal.");
                this.feedbackText.setStyle({ fill: '#2ecc71' });
            }

            // Esperar 2 segundos y luego mostrar el código correcto
            this.time.delayedCall(2000, () => {
                // Limpiar toda la pantalla
                this.children.removeAll(true);

                // Configurar el fondo
                this.cameras.main.setBackgroundColor('#2c3e50');

                // Estilos para el código correcto
                const titleStyle = { fontSize: '22px', fill: '#ecf0f1', fontFamily: 'Arial, sans-serif', align: 'center', stroke: '#000000', strokeThickness: 1 };
                const codeStyle = { fontSize: '12px', fill: '#f0f0f0', fontFamily: 'Consolas, "Courier New", monospace', lineSpacing: 4, align: 'left' };

                // Mostrar el título
                this.add.text(this.cameras.main.width / 2, 20, 'Desafío de Código Arduino - Solución Correcta', titleStyle).setOrigin(0.5);

                // Panel para el código
                const codePanelX = this.cameras.main.width / 2 - 280;
                const codePanelY = 50;
                const codePanelWidth = 560;
                const codePanelHeight = 400;

                const codePanelBg = this.add.graphics();
                codePanelBg.fillStyle(0x34495e, 0.9);
                codePanelBg.fillRoundedRect(codePanelX, codePanelY, codePanelWidth, codePanelHeight, 15);
                codePanelBg.lineStyle(3, 0x3498db, 0.8);
                codePanelBg.strokeRoundedRect(codePanelX, codePanelY, codePanelWidth, codePanelHeight, 15);

                // Barra superior para el lenguaje
                const headerHeight = 25;
                const headerBg = this.add.graphics();
                headerBg.fillStyle(0x2c3e50, 1);
                headerBg.fillRoundedRect(codePanelX, codePanelY, codePanelWidth, headerHeight, { tl: 15, tr: 15, bl: 0, br: 0 });

                // Etiqueta de lenguaje
                this.add.text(codePanelX + 20, codePanelY + headerHeight/2, "cpp", {
                    fontSize: '14px',
                    fill: '#f39c12',
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 'bold'
                }).setOrigin(0, 0.5);

                // Código correcto
                const correctCode = [
"int motor = 9;",
"int sensorLuz = A0;",
"void setup() {",
" pinMode(motor, OUTPUT);",
" pinMode(sensorLuz, INPUT);",
"}",
"void loop() {",
" int luz = analogRead(sensorLuz);",
" if (luz > 500) {",
" digitalWrite(motor, HIGH);",
" } else {",
" digitalWrite(motor, LOW);",
    "}",

                ];

                // Mostrar el código con números de línea
                this.add.text(
                    codePanelX + 40,
                    codePanelY + headerHeight + 10,
                    correctCode.join('\n'),
                    codeStyle
                );

                let lineNumbers = '';
                for (let i = 1; i <= correctCode.length; i++) {
                    lineNumbers += i + '\n';
                }
                const lineNumberStyle = {
                    fontSize: '12px',
                    fill: '#95a5a6',
                    fontFamily: 'Consolas, "Courier New", monospace',
                    lineSpacing: 4,
                    align: 'right'
                };
                this.add.text(
                    codePanelX + 25,
                    codePanelY + headerHeight + 10,
                    lineNumbers,
                    lineNumberStyle
                ).setOrigin(1, 0);

                // Resaltar la parte corregida
                const highlightBg = this.add.graphics();
                highlightBg.fillStyle(0x27ae60, 0.2);
                const lineHeight = 16;
                const startLine = 14;
                const endLine = 17;
                highlightBg.fillRect(
                    codePanelX + 10,
                    codePanelY + headerHeight + 10 + (startLine - 1) * lineHeight,
                    codePanelWidth - 20,
                    (endLine - startLine + 1) * lineHeight
                );

                // Explicación
                const explanationStyle = {
                    fontSize: '14px',
                    fill: '#ecf0f1',
                    fontFamily: 'Arial, sans-serif',
                    align: 'center',
                    wordWrap: { width: 540 },
                    backgroundColor: '#34495e',
                    padding: { x: 15, y: 6 },
                    borderRadius: 10
                };
                this.add
                  .text(
                    this.cameras.main.width / 2,
                    codePanelY + codePanelHeight + 10,
                    "¡¡Bien hecho! Ahora el robot solo usará energía cuando sea necesario, evitando desperdicios.",
                    explanationStyle
                  )
                  .setOrigin(0.5, 0);

                // Mensaje flotante "Click para continuar"
                const continueMessage = this.add.text(
                    this.cameras.main.width / 2,
                    this.cameras.main.height - 40,
                    "Click para continuar",
                    {
                        fontSize: '22px',
                        fill: '#f1c40f',
                        fontFamily: 'Arial, sans-serif',
                        fontStyle: 'italic',
                        stroke: '#000000',
                        strokeThickness: 2,
                        align: 'center',
                        padding: { x: 10, y: 5 }
                    }
                ).setOrigin(0.5).setDepth(1000);

                this.tweens.add({
                    targets: continueMessage,
                    y: continueMessage.y - 10,
                    duration: 700,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });

                // Click en cualquier parte para continuar
                this.input.once('pointerdown', () => {
                    this.scene.start('scenaVideo4'); 
                }, this);

            });
        } else {
            // Respuesta incorrecta - Mantener el color rojo para las opciones incorrectas
            selectedOptionBg.clear();
            selectedOptionBg.fillStyle(incorrectColor, 1);
            selectedOptionBg.fillRoundedRect(selectedOptionBg.x, selectedOptionBg.y, selectedOptionBg.width, selectedOptionBg.height, 10);
            selectedOptionLabel.setStyle({ fill: correctTextColor });

            // Deshabilitar solo esta zona
            if (selectedZone && selectedZone.input) {
                selectedZone.disableInteractive();
            }

            if (this.feedbackText) {
                this.feedbackText.setText("Incorrecto. ❌\nIntenta con otra opción.");
                this.feedbackText.setStyle({ fill: '#e74c3c' });
            }
        }
    }

    update() {

    }
}
