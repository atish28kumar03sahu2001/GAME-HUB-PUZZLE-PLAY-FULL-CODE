//GLOBAL VARIABLES
var DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4,
}
//GET THE PARENT CONTAINER DIMENSIONS WIDTH = 600 HEIGHT = 400
const boardDiv = document.querySelector('.BOARD_DIV');
boardDiv.offsetHeight;
const {width, height} = boardDiv.getBoundingClientRect();
// GAME TOTAL ROUNDS
var rounds = [7,5,7,5,10];
// BACKGROUND COLOR FOR EACH ROUND
var colors = ['#35004f', '#004731', '#540031', '#004b4f', '#003159'];
// PONG BALL OBJECT
var Ball = {
    new: function (incrementedSpeed) {
        return {
            width: 6,
            height: 6,
            radius: 6,
            x: (this.canvas.width / 2),
            y: (this.canvas.height / 2),
            moveX: DIRECTION.IDLE,
            moveY: DIRECTION.IDLE,
            speed: incrementedSpeed || 7
        };
    }
};
// THE COMPUTER OBJECT (AUTOMATIC MOVE UP AND DOWN)
var Ai = {
    new: function (side) {
        return {
            width: 8,
            height: 80,
            x: side === 'left' ? 30 : this.canvas.width - 30,
            y: (this.canvas.height / 2) - 30,
            score: 0,
            move: DIRECTION.IDLE,
            speed: 5,
        };
    }
};
// GAME LOGIC PART
var Game = {
    initialize: function () {
        this.canvas = document.querySelector('.BOARD_CANVAS');
        this.context = this.canvas.getContext('2d');

        if(width <= 600 && height <= 400) {
            Ai.new = function (side) {
                return {
                    width: 8,
                    height: 80,
                    x: side === 'left' ? 30 : this.canvas.width - 30,
                    y: (this.canvas.height / 2) - 30,
                    score: 0,
                    move: DIRECTION.IDLE,
                    speed: 5,
                };
            },
            Ball.new = function (incrementedSpeed) {
                return {
                    width: 6,
                    height: 6,
                    radius: 6,
                    x: (this.canvas.width / 2),
                    y: (this.canvas.height / 2),
                    moveX: DIRECTION.IDLE,
                    moveY: DIRECTION.IDLE,
                    speed: incrementedSpeed || 7,
                };
            };
        }
        if(width <= 400 && height <= 300) {
            Ai.new = function (side) {
                return {
                    width: 5,
                    height: 50,
                    x: side === 'left' ? 30 : this.canvas.width - 30,
                    y: (this.canvas.height / 2) - 20,
                    score: 0,
                    move: DIRECTION.IDLE,
                    speed: 5,
                };
            },
            Ball.new = function (incrementedSpeed) {
                return {
                    width: 5,
                    height: 5,
                    radius: 5,
                    x: (this.canvas.width / 2),
                    y: (this.canvas.height / 2),
                    moveX: DIRECTION.IDLE,
                    moveY: DIRECTION.IDLE,
                    speed: incrementedSpeed || 7,
                };
            };
        }
        if(width <= 300 && height <= 250) {
            Ai.new = function (side) {
                return {
                    width: 5,
                    height: 50,
                    x: side === 'left' ? 20 : this.canvas.width - 20,
                    y: (this.canvas.height / 2) - 20,
                    score: 0,
                    move: DIRECTION.IDLE,
                    speed: 5,
                };
            },
            Ball.new = function (incrementedSpeed) {
                return {
                    width: 5,
                    height: 5,
                    radius: 5,
                    x: (this.canvas.width / 2),
                    y: (this.canvas.height / 2),
                    moveX: DIRECTION.IDLE,
                    moveY: DIRECTION.IDLE,
                    speed: incrementedSpeed || 7,
                };
            };
        }

        // SET THE CANVAS DIMENSIONS BASED ON THE PARENT CONTAINER
        this.canvas.width = width;
        this.canvas.height = height;

        this.player = Ai.new.call(this, 'left');
        this.ai = Ai.new.call(this, 'right');
        this.ball = Ball.new.call(this);

        this.ai.speed = 5,
        this.running = this.over = false;
        this.turn = this.ai;
        this.timer = this.round = 0;
        this.color = this._generateRoundColor();

        Pong.menu();
        Pong.listen();
    },

    endGameMenu: function (text) {
        // CHANGE THE CANVAS FONT SIZE AND COLOR
        Pong.context.font = "14px sans-serif";
        Pong.context.fillStyle = this.color;

        if(width <= 600 && height <= 400) {
            Pong.context.font = "14px sans-serif";
        }
        if(width <= 400 && height <= 300) {
            Pong.context.font = "12px Times New Roman";
        }
        if(width <= 300 && height <= 250) {
            Pong.context.font = "11px Times New Roman";
        }
        // GET THE WIDTH OF THE TEXT
        const textWidth = Pong.context.measureText(text).width;
        // ADD PADDING TO THE TEXT
        const rectWidth = textWidth + 20;
        //FIXED HEIGHT OF THE BOX
        const rectHeight = 30;
        // CENTER THE BOX
        const rectX = (Pong.canvas.width / 2) - (rectWidth / 2);
        // GAP FROM BOTTOM
        const rectY = Pong.canvas.height - rectHeight - 10;
        // DRAW THE BOX
        Pong.context.fillRect(rectX, rectY, rectWidth, rectHeight);
        // CHANGE THE CANVAS COLOR FOR TEXT
        Pong.context.fillStyle = "#ffffff";
        // END GAME TEXT
        Pong.context.fillText(
            text, 
            Pong.canvas.width / 2,
            Pong.canvas.height - 10,
        );
        setTimeout(function(){
            Pong = Object.assign({}, Game);
            Pong.initialize();
        }, 3000);
    },

    menu: function () {
        // DRAW ALL THE PONG OBJECTS
        Pong.draw();
        // CHANGE THE CANVAS FONT SIZE AND COLOR
        this.context.font = "14px sans-serif";
        this.context.fillStyle = this.color;

        if(width <= 600 && height <= 400) {
            this.context.font = "14px sans-serif";
        }
        if(width <= 400 && height <= 300) {
            this.context.font = "12px Times New Roman";
        }
        if(width <= 300 && height <= 250) {
            this.context.font = "11px Times New Roman";
        }

        // GET THE WIDTH OF THE TEXT
        var textWidth = this.context.measureText('Begin The Game!').width;
        // ADD GAP FROM ALL THE SIDE
        var rectWidth = textWidth + 20;
        var rectHeight = 30;

        this.context.fillRect(
            this.canvas.width / 2 - rectWidth / 2,
            40,
            rectWidth,
            rectHeight,
        );

        this.context.fillStyle = '#ffffff';
        this.context.fillText(
            "Begin The Game!", 
            this.canvas.width / 2, 
            60
        );
    },

    update: function () {
        if(!this.over) {
            // IF THE BALL COLLIDES WITH THE BOUND LIMITS
            if(this.ball.x <= 0) Pong._resetTurn.call(this, this.ai, this.player);
            if(this.ball.x >= this.canvas.width - this.ball.width) Pong._resetTurn.call(this, this.player, this.ai);
            if(this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
            if(this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;

            // MOVE THE PLAYER SIDE
            if(this.player.move === DIRECTION.UP) this.player.y -= this.player.speed;
            else if(this.player.move === DIRECTION.DOWN) this.player.y += this.player.speed;

            // ADD RANDOM DIRECT TO THE NEW CHALLENGE
            if(Pong._turnDelayIsOver.call(this) && this.turn) {
                this.ball.moveX = this.turn === this.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
                this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
                this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
                this.turn = null;
            }

            // IF THE PLAYER COLLIDES WITH THE BOUND LIMITS
            if(this.player.y <= 0) this.player.y = 0;
            else if(this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);

            //MOVE THE BALL IN PROPER DIRECTION BASED ON X AND Y VALUES
            if(this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
            else if(this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);

            if(this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
            else if(this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

            // COMPUTER UP AND DOWN MOVE
            if(this.ai.y > this.ball.y - (this.ai.height / 2)) {
                if(this.ball.moveX === DIRECTION.RIGHT) this.ai.y -= this.ai.speed / 1.5;
                else this.ai.y -= this.ai.speed / 4;
            }
            if(this.ai.y < this.ball.y - (this.ai.height / 2)) {
                if(this.ball.moveX === DIRECTION.RIGHT) this.ai.y += this.ai.speed / 1.5;
                else this.ai.y += this.ai.speed / 4;
            }
            
            // BALL COLLISION WITH COMPUTER PLAYER
            if(this.ai.y >= this.canvas.height - this.ai.height) this.ai.y = this.canvas.height - this.ai.height;
            else if (this.ai.y <= 0) this.ai.y = 0;

            // HANDLE PLAYER WITH BALL COLLISION
            if(
                this.ball.x - this.ball.radius <= this.player.x &&
                this.ball.x + this.ball.radius >= this.player.x
            ) {
                if(
                    this.ball.y + this.ball.radius >= this.player.y &&
                    this.ball.y - this.ball.radius <= this.player.y + this.player.height
                ) {
                    this.ball.x = this.player.x + this.ball.radius;
                    this.ball.moveX = DIRECTION.RIGHT
                }
            }

            // HANDLE COMPUTER WITH BALL COLLISION
            if(
                this.ball.x + this.ball.radius >= this.ai.x &&
                this.ball.x - this.ball.radius <= this.ai.x + this.ai.width
            ) {
                if(
                    this.ball.y + this.ball.radius >= this.ai.y &&
                    this.ball.y - this.ball.radius <= this.ai.y + this.ai.height
                ) {
                    this.ball.x = this.ai.x - this.ball.radius;
                    this.ball.moveX = DIRECTION.LEFT
                }
            }
        }

        // SCORE AND WIN LOGIC
        if(this.player.score === rounds[this.round]) {
            if(!rounds[this.round + 1]) {
                this.over = true;
                setTimeout(function(){Pong.endGameMenu('Winner!');}, 1000);
            } else {
                this.color = this._generateRoundColor();
                this.player.score = this.ai.score = 0;
                this.player.speed += 0.5;
                this.ai.speed += 1;
                this.ball.speed += 1;
                this.round += 1;
            }
        }
        else if(this.ai.score === rounds[this.round]) {
            this.over = true;
            setTimeout(function(){Pong.endGameMenu('Game Over!');}, 1000);
        }
    },

    draw: function () {
        this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.color;

        this.context.fillRect(0,0,this.canvas.width, this.canvas.height);
        this.context.fillStyle = '#ffffff';

        // PLAYER
        this.context.fillRect(
            this.player.x,
            this.player.y,
            this.player.width,
            this.player.height
        )

        // COMPUTER
        this.context.fillRect(
            this.ai.x,
            this.ai.y,
            this.ai.width,
            this.ai.height
        )

        // BALL
        if(Pong._turnDelayIsOver.call(this)) {
            this.context.beginPath();
            this.context.arc(
                this.ball.x,
                this.ball.y,
                this.ball.radius,
                0,
                Math.PI * 2
            );
            this.context.fillStyle = '#ffffff';
            this.context.fill();
        }

        // DRAW THE LIMIT
        this.context.beginPath();
        this.context.moveTo((this.canvas.width / 2), this.canvas.height - 50);
        this.context.lineTo((this.canvas.width / 2), 50);
        this.context.lineWidth = 3;
        this.context.strokeStyle = '#ffffff';
        this.context.stroke();

        this.context.font = '14px sans-serif';
        this.context.textAlign = 'center';
        if(width <= 600 && height <= 400) {
            this.context.font = "14px sans-serif";
        }
        if(width <= 400 && height <= 300) {
            this.context.font = "12px Times New Roman";
        }
        if(width <= 300 && height <= 250) {
            this.context.font = "11px Times New Roman";
        }

        // PLAYER SCORE
        this.context.fillText(
            this.player.score.toString(),
            (this.canvas.width / 2) - 50,
            100
        );

        // COMPUTER SCORE
        this.context.fillText(
            this.ai.score.toString(),
            (this.canvas.width / 2) + 50,
            100
        );
        this.context.font = '14px sans-serif';
        this.context.font = '14px sans-serif';
        if(width <= 600 && height <= 400) {
            this.context.font = "14px sans-serif";
        }
        if(width <= 400 && height <= 300) {
            this.context.font = "12px Times New Roman";
        }
        if(width <= 300 && height <= 250) {
            this.context.font = "11px Times New Roman";
        }

        // CURRENT ROUND AND TOTAL POINT OF EACH ROUND
        this.context.fillText(
            'Round' + 
            (Pong.round + 1) + 
            ' | Total Point: ' + 
            (rounds[Pong.round] ? rounds[Pong.round] : rounds[Pong.round - 1]),
            (this.canvas.width / 2),
            20
        );
    },

    loop: function () {
        Pong.update();
        Pong.draw();
        if(!Pong.over) requestAnimationFrame(Pong.loop);
    },

    listen: function () {
        document.addEventListener('keydown', function (key) {
            if(Pong.running === false) {
                Pong.running = true;
                window.requestAnimationFrame(Pong.loop);
            }
            if(key.keyCode === 38 || key.keyCode === 87) Pong.player.move = DIRECTION.UP;
            if(key.keyCode === 40 || key.keyCode === 83) Pong.player.move = DIRECTION.DOWN;
        });

        document.addEventListener('keyup', function(key) { Pong.player.move = DIRECTION.IDLE });

        document.getElementById('UP').addEventListener('click', () => {
            if(Pong.running === false){
                Pong.running = true;
                window.requestAnimationFrame(Pong.loop);
            }
            Pong.player.move = DIRECTION.UP;
        });
        document.getElementById('DOWN').addEventListener('click', () => {
            if(Pong.running === false){
                Pong.running = true;
                window.requestAnimationFrame(Pong.loop);
            }
            Pong.player.move = DIRECTION.DOWN;
        });
        document.getElementById('RESET').addEventListener('click',()=>{
            location.reload();
        });
    },

    _resetTurn: function(victor, loser) {
        this.ball = Ball.new.call(this, this.ball.speed);
        this.turn = loser;
        this.timer = (new Date()).getTime();
        victor.score++;
    },

    _turnDelayIsOver: function() {
        return ((new Date()).getTime() - this.timer >= 1000);
    },

    _generateRoundColor: function() {
        var newColor = colors[Math.floor(Math.random() * colors.length)];
        if(newColor === this.color) return Pong._generateRoundColor();
        return newColor;
    },
};
var Pong = Object.assign({}, Game);
Pong.initialize();