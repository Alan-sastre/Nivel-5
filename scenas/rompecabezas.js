class Rompecabezas extends Phaser.Scene {
    constructor() {
        super({ key: 'Rompecabezas' });
        this.piezas = [];
        this.zonasDeCaida = [];
        this.lineas = [];
    }

    preload() {

        this.load.image('fondoJuego', 'assets/ScenaFallos/fondo.jpg');
        this.load.image('arduino', 'assets/CircuitosQuemados/arduino.png');
        this.load.image('condensador', 'assets/CircuitosQuemados/condensador.png');
        this.load.image('diodo', 'assets/CircuitosQuemados/diodo.png');
    }

    create() {
        // Añadir fondo
        this.add.image(400, 300, 'fondoJuego').setScale(0.8);

        // Crear zonas de caída (áreas donde se deben colocar las piezas)
        this.crearZonasDeCaida();

        // Crear piezas del rompecabezas
        this.crearPiezas();

        // Añadir interactividad para arrastrar y soltar
        this.input.on('dragstart', (pointer, gameObject) => {
            this.children.bringToTop(gameObject);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            this.verificarColocacion(gameObject);
        });

        // Texto de instrucciones
        this.add.text(20, 20, 'Resuelve el rompecabezas de circuitos.', { fontSize: '24px', fill: '#ffffff' });
    }

    crearZonasDeCaida() {
        // Ejemplo de zonas de caída
        const posiciones = [{ x: 200, y: 200 }, { x: 400, y: 200 }, { x: 600, y: 200 }];
        posiciones.forEach((pos, index) => {
            let zona = this.add.zone(pos.x, pos.y, 100, 100).setRectangleDropZone(100, 100);
            zona.setName(`zona${index}`);
            // Visualizar la zona para depuración
            let graphics = this.add.graphics();
            graphics.lineStyle(2, 0xffff00);
            graphics.strokeRect(zona.x - zona.input.hitArea.width / 2, zona.y - zona.input.hitArea.height / 2, zona.input.hitArea.width, zona.input.hitArea.height);
            this.zonasDeCaida.push(zona);
        });
    }

    crearPiezas() {
        // Ejemplo de piezas
        const piezasData = [
            { key: 'arduino', x: 100, y: 450 },
            { key: 'condensador', x: 300, y: 450 },
            { key: 'diodo', x: 500, y: 450 }
        ];

        piezasData.forEach(data => {
            let pieza = this.add.image(data.x, data.y, data.key).setInteractive();
            this.input.setDraggable(pieza);
            this.piezas.push(pieza);
        });
    }

    verificarColocacion(pieza) {
        let enZonaCorrecta = false;
        this.zonasDeCaida.forEach(zona => {
            const distancia = Phaser.Math.Distance.Between(pieza.x, pieza.y, zona.x, zona.y);
            if (distancia < 50) {
                // Ajustar la pieza a la zona
                pieza.x = zona.x;
                pieza.y = zona.y;
                pieza.input.enabled = false; // Deshabilitar arrastre
                enZonaCorrecta = true;
            }
        });

        if (enZonaCorrecta) {
            this.verificarVictoria();
        }
    }

    verificarVictoria() {
        const todasColocadas = this.piezas.every(pieza => !pieza.input.enabled);
        if (todasColocadas) {
            this.add.text(400, 300, '¡Nivel Completado!', { fontSize: '48px', fill: '#00ff00' }).setOrigin(0.5);
            // Aquí podrías pasar a la siguiente escena
            // this.scene.start('SiguienteEscena');
        }
    }
}