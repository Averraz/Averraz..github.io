class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isPaused = false;
        this.isMenuOpen = false;
        
        this.setupCanvas();
        this.initializeGame();
        this.addEventListeners();
        this.gameLoop();
    }

    setupCanvas() {
        // Адаптивный размер канваса
        if (window.innerWidth <= 768) { // Мобильное устройство
            this.canvas.width = window.innerWidth * 0.95;
            this.canvas.height = window.innerHeight * 0.7;
        } else { // Десктоп
            this.canvas.width = 800;
            this.canvas.height = 600;
        }

        // Параметры игры
        this.paddleWidth = this.canvas.width * 0.15;
        this.paddleHeight = 10;
        this.ballRadius = 8;
    }

    initializeGame() {
        // Платформа
        this.paddle = {
            x: this.canvas.width / 2 - this.paddleWidth / 2,
            y: this.canvas.height - this.paddleHeight - 10,
            width: this.paddleWidth,
            height: this.paddleHeight,
            speed: 8
        };

        // Мяч
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 30,
            dx: 4,
            dy: -4,
            radius: this.ballRadius
        };

        // Отслеживание позиции мыши
        this.mouseX = 0;
        this.isMouseInCanvas = false;
    }

    addEventListeners() {
        // Обработка движения мыши
        document.addEventListener('mousemove', (e) => {
            // Если игра на паузе или открыто меню, не обрабатываем движение
            if (this.isPaused || this.isMenuOpen) return;

            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            
            // Обновляем позицию платформы даже если мышь за пределами канваса
            let newX = this.mouseX - this.paddle.width / 2;
            newX = Math.max(0, Math.min(newX, this.canvas.width - this.paddle.width));
            this.paddle.x = newX;
        });

        // Обработка сенсорного ввода
        this.canvas.addEventListener('touchmove', (e) => {
            // Если игра на паузе или открыто меню, не обрабатываем движение
            if (this.isPaused || this.isMenuOpen) return;

            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouseX = touch.clientX - rect.left;
            
            let newX = this.mouseX - this.paddle.width / 2;
            newX = Math.max(0, Math.min(newX, this.canvas.width - this.paddle.width));
            this.paddle.x = newX;
        });

        // Кнопки управления
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.isPaused = !this.isPaused;
        });

        document.getElementById('menuBtn').addEventListener('click', () => {
            this.isMenuOpen = !this.isMenuOpen;
            this.isPaused = this.isMenuOpen;
        });
    }

    update() {
        if (this.isPaused || this.isMenuOpen) return;

        // Обновление позиции мяча
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Отскок от стен
        if (this.ball.x + this.ball.radius > this.canvas.width || 
            this.ball.x - this.ball.radius < 0) {
            this.ball.dx = -this.ball.dx;
        }
        if (this.ball.y - this.ball.radius < 0) {
            this.ball.dy = -this.ball.dy;
        }

        // Отскок от платформы
        if (this.ball.y + this.ball.radius > this.paddle.y &&
            this.ball.x > this.paddle.x &&
            this.ball.x < this.paddle.x + this.paddle.width) {
            this.ball.dy = -this.ball.dy;
        }

        // Проверка проигрыша
        if (this.ball.y + this.ball.radius > this.canvas.height) {
            this.initializeGame();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Отрисовка платформы
        this.ctx.fillStyle = '#0095DD';
        this.ctx.fillRect(this.paddle.x, this.paddle.y, 
                         this.paddle.width, this.paddle.height);

        // Отрисовка мяча
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, 
                    this.ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#0095DD';
        this.ctx.fill();
        this.ctx.closePath();

        // Отрисовка меню
        if (this.isMenuOpen) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Меню', this.canvas.width/2, this.canvas.height/2);
        }

        // Отрисовка паузы
        if (this.isPaused && !this.isMenuOpen) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Пауза', this.canvas.width/2, this.canvas.height/2);
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Запуск игры
window.onload = () => {
    new Game();
}; 