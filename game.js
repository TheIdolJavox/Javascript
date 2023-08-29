const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

let car;
let obstacles;
let score = 0;
let scoreText;
let isGameOver = false;
let timeEvent; // Variable para almacenar la referencia al evento de aumento de puntuación

function preload() {
    this.load.image('car', 'assets/car.png');
    this.load.image('obstacle', 'assets/obstacle.png');
}

function create() {
    // Establecer el color de fondo
    this.cameras.main.setBackgroundColor('#999999');

    // Crear el sprite del coche
    car = this.physics.add.sprite(400, 500, 'car');
    car.setCollideWorldBounds(true);

    // Crear el grupo de obstáculos
    obstacles = this.physics.add.group();
    createObstacles.call(this);

    // Crear el texto de puntuación
    scoreText = this.add.text(16, 16, 'Puntuación: 0', { fontSize: '32px', fill: '#fff' });

    // Agregar detección de colisiones
    this.physics.add.collider(car, obstacles, dodgeObstacle, null, this);

    // Iniciar la actualización de la puntuación
    timeEvent = this.time.addEvent({ delay: 1000, callback: increaseScore, callbackScope: this, loop: true });
}

function update() {
    if (!isGameOver) {
        // Mover el coche hacia adelante
        car.setVelocityY(-200);

        // Verificar si la tecla de flecha izquierda está presionada
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT).isDown) {
            car.setVelocityX(-200);
        }
        // Verificar si la tecla de flecha derecha está presionada
        else if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT).isDown) {
            car.setVelocityX(200);
        }
        // Si no se presiona ninguna tecla, detener el movimiento horizontal
        else {
            car.setVelocityX(0);
        }

        // Verificar la colisión con los obstáculos
        this.physics.add.overlap(car, obstacles, dodgeObstacle, null, this);

        // Verificar si el coche chocó con los bordes de la pantalla
        if (car.y < 50) {
            // Generar más pantalla arriba
            car.y = 550; // Colocar el coche en la parte inferior
            createObstacles.call(this); // Generar nuevos obstáculos en la parte superior
        }
    } else {
        // Verificar si se presiona la tecla SPACE para reiniciar el juego
        if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).isDown) {
            this.scene.restart(); // Reiniciar la escena
            isGameOver = false; // Restablecer el estado de Game Over
            timeEvent = this.time.addEvent({ delay: 1000, callback: increaseScore, callbackScope: this, loop: true }); // Reiniciar el evento de aumento de puntuación
            scoreText.setText('Puntuación: 0'); // Restablecer la puntuación a cero
        }
    }
}

function createObstacles() {
    for (let i = 0; i < 5; i++) {
        const obstacle = obstacles.create(Phaser.Math.Between(100, 700), Phaser.Math.Between(600, -100), 'obstacle');
        obstacle.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    }
}

function increaseScore() {
    score += 10;
    scoreText.setText('Puntuación: ' + score);
}

function dodgeObstacle(car, obstacle) {
    // Detener el movimiento del coche
    car.setVelocity(0);

    // Mostrar el texto de "Game Over"
    scoreText.setText('Game Over - Presiona ESPACIO para reiniciar');
    isGameOver = true;

    // Detener el aumento de la puntuación
    this.time.removeEvent(timeEvent); // Detener el evento de aumento de puntuación
}

function gameOver() {
    // Lógica de fin del juego aquí
}
