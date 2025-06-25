class ScenaPregunta1 extends Phaser.Scene {
    constructor() {
        super({ key: 'ScenaPregunta1' });
    }

    preload() {
    this.load.image("fondoPregunta1", "assets/ScenaFallos/fondo.jpg");
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;


        if (this.textures.exists('fondoPregunta1')) {
            this.add.image(centerX, centerY, 'fondoPregunta1').setDisplaySize(this.cameras.main.width, this.cameras.main.height);
         }

        // Estilo de texto
        const estiloTexto = { font: 'bold 32px Arial', fill: '#ffffff', align: 'center', wordWrap: { width: this.cameras.main.width * 0.8 }, stroke: '#000000', strokeThickness: 4 };
        const estiloOpcion = { font: '26px Arial', fill: '#e0e0e0', align: 'left', backgroundColor: 'rgba(0,0,0,0.5)', padding: { x: 10, y: 5 },fixedWidth: 300 };
        const estiloFeedback = { font: 'bold 28px Arial', fill: '#ffffff', align: 'center', wordWrap: { width: this.cameras.main.width * 0.8 }, stroke: '#000000', strokeThickness: 3 };

        // Pregunta
        const preguntaTexto = this.add.text(centerX, centerY - 200, '¿Cuál de estos componentes es clave para almacenar energía en un circuito eléctrico?', estiloTexto).setOrigin(0.5);
        preguntaTexto.setAlpha(0);
        this.tweens.add({
            targets: preguntaTexto,
            alpha: 1,
            duration: 1000,
            ease: 'Power2'
        });

        // Opciones
        const opciones = [
            { texto: '(A) Resistencia', esCorrecta: false },
            { texto: '(B) Condensador', esCorrecta: true },
            { texto: '(C) Diodo', esCorrecta: false },
            { texto: '(D) Transistor', esCorrecta: false }
        ];

        let startY = centerY - 80;
        this.opcionesGrupo = this.add.group(); // Grupo para manejar las opciones fácilmente

        opciones.forEach((opcion, index) => {
            const opcionTexto = this.add.text(centerX, startY + (index * 60), opcion.texto, estiloOpcion)
                .setOrigin(0.5, 0.5) // Centrar el texto dentro de su caja
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.seleccionarOpcion(opcion.esCorrecta, opcionTexto))
                .on('pointerover', () => {
                    opcionTexto.setStyle({ fill: '#ffff00' }); // Cambia color al pasar el mouse
                    this.tweens.add({
                        targets: opcionTexto,
                        scaleX: 1.05,
                        scaleY: 1.05,
                        duration: 200,
                        ease: 'Power1'
                    });
                })
                .on('pointerout', () => {
                    opcionTexto.setStyle({ fill: '#e0e0e0' }); // Restaura color
                    this.tweens.add({
                        targets: opcionTexto,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 200,
                        ease: 'Power1'
                    });
                });

            opcionTexto.setAlpha(0).setScale(0.8);
            this.opcionesGrupo.add(opcionTexto);

            this.tweens.add({
                targets: opcionTexto,
                alpha: 1,
                scale: 1,
                duration: 500,
                delay: 500 + (index * 150), // Efecto escalonado
                ease: 'Back.easeOut' // Un efecto de "rebote" suave
            });
        });

        // Placeholder para el feedback
        this.feedbackTexto = this.add.text(centerX, centerY + 180, '', estiloFeedback).setOrigin(0.5);
        this.feedbackTexto.setAlpha(0);
    }

    seleccionarOpcion(esCorrecta, opcionSeleccionada) {
        // Deshabilitar interacciones para evitar múltiples selecciones rápidas
        this.opcionesGrupo.getChildren().forEach(op => op.disableInteractive());

        this.feedbackTexto.setAlpha(0);
        this.tweens.killTweensOf(this.feedbackTexto); // Detener animaciones previas del feedback

        if (esCorrecta) {
            this.feedbackTexto.setText('¡Correcto! Los condensadores almacenan energía temporalmente y ayudan a estabilizar los circuitos.'); // Retroalimentación corregida
            this.feedbackTexto.setColor('#32CD32'); // Verde lima
            opcionSeleccionada.setStyle({ backgroundColor: 'rgba(0,255,0,0.7)'});

            // Cambiar a la siguiente escena después de 4 segundos
            this.time.delayedCall(4000, () => {
                this.scene.start('ScenaPregunta2'); // Asegúrate de que 'ScenaPregunta2' exista y esté configurada
            });
        } else {
            this.feedbackTexto.setText('Inténtalo de nuevo. Piensa en qué componente puede acumular carga eléctrica.');
            this.feedbackTexto.setColor('#FF6347'); // Tomate
            opcionSeleccionada.setStyle({ backgroundColor: 'rgba(255,0,0,0.7)'});
            // Permitir volver a intentar o mostrar la respuesta correcta después de un tiempo
            this.time.delayedCall(2500, () => {
                 this.opcionesGrupo.getChildren().forEach(op => op.setInteractive({ useHandCursor: true })); // Reactivar opciones
                 this.feedbackTexto.setAlpha(0); // Ocultar feedback para nuevo intento
                 opcionSeleccionada.setStyle({ backgroundColor: 'rgba(0,0,0,0.5)'}); // Restaurar fondo de opción
            });
        }

        this.tweens.add({
            targets: this.feedbackTexto,
            alpha: 1,
            y: this.feedbackTexto.y + 10, // Pequeño movimiento hacia abajo
            duration: 500,
            ease: 'Power1'
        });
    }
}

// Asegúrate de añadir esta escena a la configuración de tu juego Phaser en game.js
// Ejemplo en game.js:
// scene: [MenuPrincipal, ScenaPregunta1, OtraEscena, ...]

