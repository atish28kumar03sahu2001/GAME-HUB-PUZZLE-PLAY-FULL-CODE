(function(){
    // SELECT THE CANVAS ELEMENT AND SETTING UP 2D DRAWING CONTEXT
    const canvas_board = document.getElementById("CANVAS_BOARD");
    const ctx = canvas_board.getContext("2d");
    const canvasSize = 450;
    const w = (canvas_board.width = canvasSize);
    const h = (canvas_board.height = canvasSize);
    const canvasFillColor = "rgb(0, 0, 0)";
    const canvasStrokeColor = "rgb(0, 0, 0)";

    // SELECTING DOM ELEMENTS FOR GAME CONTROLS AND DISPLAY
    const your_score = document.getElementById("YOUR_SCORE");
    const high_score = document.getElementById("HIGH_SCORE");

    const reset = document.getElementById("RESET");
    const reset_mobile = document.getElementById("RESET_MOBILE");

    const play = document.getElementById("PLAY");
    const pause = document.getElementById("PAUSE");

    const right = document.getElementById("RIGHT");
    const left = document.getElementById("LEFT");

    const up = document.getElementById("UP");
    const down = document.getElementById("DOWN");

    // SET THE INITIAL SCORE FOR GAME
    let score = 0;

    // UPDATE SCORE DISPLAY AND STORES HIGH SCORE IN LOCALSTORAGE
    const setScore = () => {
        your_score.innerHTML = `${score}`;
        if(score >= localStorage.getItem("HighScore"))
            localStorage.setItem("HighScore",score);
        high_score.innerHTML = `${localStorage.getItem("HighScore")}`;
    }

    // GAME FRAMERATE SETTINGS
    const FrameRate = 9.5;

    // TRACK IF THE GAME IS ACTIVE OR NOT
    let GameActive = false;

    // GRID SETTING FOR CANVAS
    const pGrid = 4; // PADDING FOR THE GRID
    const grid_line_len = canvasSize - 2 * pGrid; // GRID WIDTH
    const cellCount = 44; // NUMBER OF CELLS IN THE CANVAS GRID
    const cellSize = grid_line_len / cellCount;

    // FUNCTION TO GENERATE RANDOM POSITIONS WITHIN CANVAS GRID
    const getRandomPosition = () => {
        return {
            x: Math.floor(Math.random() * cellCount),
            y: Math.floor(Math.random() * cellCount),
        }
    }

    // SNAKE HEAD PROPERTIES AND RENDERING
    const head = {
        ...getRandomPosition(),
        color: "#6ad8e9", // SNAKE HEAD COLOR
        vX: 0, // X VELOCITY
        vY: 0, // Y VELOCITY
        draw: () => {
            ctx.fillStyle = head.color;
            ctx.shadowColor = head.color;
            ctx.shadowBlur = 2.5;
            ctx.fillRect(
                head.x * cellSize + pGrid,
                head.y * cellSize + pGrid,
                cellSize, cellSize
            );
        },
    };

    // INITIAL LENGTH OF THE SNAKE TAIL AND BODY
    let TailLength = 3;

    // ARRAY TO STORE THE SNAKE BODY PART AND TAIL
    let SnakeBodyParts = [];

    // TAIL CLASS TO HANDLE TAIL RENDERING
    class Tail {
        color = "#6030fc"; //  SET THE SNAKE BODY AND TAIL COLOR
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 2.5;
            ctx.fillRect(
                this.x * cellSize + pGrid,
                this.y * cellSize + pGrid,
                cellSize, cellSize
            );
        };
    };

    // RED FRUIT PROPERTIES AND RENDERING
    const Red_Fruit = {
        ...getRandomPosition(),
        color: "#ff0008", // RED_FRUIT COLOR
        draw: () => {
            ctx.fillStyle = Red_Fruit.color;
            ctx.shadowColor = Red_Fruit.color;
            ctx.shadowBlur = 5;
            ctx.fillRect(
                Red_Fruit.x * cellSize + pGrid,
                Red_Fruit.y * cellSize + pGrid,
                cellSize, cellSize
            );
        }, 
    };

    // YELLOW FRUIT PROPERTIES AND RENDERING
    const Yellow_Fruit = {
        // INITIALLY NOT ON THE CANVAS GRID
        x: -1,
        y: -1,
        color: "#fffb1c", // YELLOW_FRUIT COLOR
        visible: false,
        draw: () => {
            if(Yellow_Fruit.visible) {
                ctx.fillStyle = Yellow_Fruit.color;
                ctx.shadowColor = Yellow_Fruit.color;
                ctx.shadowBlur = 5;
                ctx.fillRect(
                    Yellow_Fruit.x * cellSize + pGrid,
                    Yellow_Fruit.y * cellSize + pGrid,
                    cellSize, cellSize
                );
            }
        },
        spawn: () => {
            const randomChance = Math.floor(Math.random() * 3);
            if(randomChance === 0) {
                const pos = getRandomPosition();
                Yellow_Fruit.x = pos.x;
                Yellow_Fruit.y = pos.y;
                Yellow_Fruit.visible = true;
            } else {
                Yellow_Fruit.visible = false;
            }
        },
    };

    // SET THE FRUIT COUNT
    let Red_Yellow_Fruit_Count = 0;

    // SET THE CANVAS BACKGROUND AND BORDER STYLE
    const setCanvas = () => {
        ctx.fillStyle = canvasFillColor;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = canvasStrokeColor;
        ctx.strokeRect(0, 0, w, h);
    }

    // RENDER THE SNAKE AND MANAGES ITS BODY TAIL GROWTH
    const drawSnake = () => {
        SnakeBodyParts.forEach((part) => {
            part.draw();
        });
        SnakeBodyParts.push(new Tail(head.x, head.y));
        if(SnakeBodyParts.length > TailLength){
            SnakeBodyParts.shift();
        }
        head.draw();
    }

    // UPDATE SNAKE'S POSITION BASED ON VELOCITY
    const updateSnakePosition = () => {
        head.x += head.vX;
        head.y += head.vY;
    };

    // HANDLES DIRECTIONS CHANGES FOR THE SNAKE
    const changeDir = (e) => {
        let key = e.keyCode;

        if(key == 68 || key == 39) {
            // RIGHT ARROW OR 'D'
            if(head.vX === -1) return;
            head.vX = 1;
            head.vY = 0;
            GameActive = true;
            return;
        }
        if(key == 65 || key == 37) {
            // LEFT ARROW OR 'A'
            if(head.vX === 1) return;
            head.vX = -1;
            head.vY = 0;
            GameActive = true;
            return;
        }
        if(key == 87 || key == 38) {
            // UP ARROW OR 'W'
            if(head.vY === 1) return;
            head.vX = 0;
            head.vY = -1;
            GameActive = true;
            return;
        }
        if(key == 83 || key == 40) {
            // DOWN ARROW OR 'S'
            if(head.vY === -1) return;
            head.vX = 0;
            head.vY = 1;
            GameActive = true;
            return;
        }
        if(key == 69 || key == 101) {
            // 'E' OR 'e'
            pauseGame();
            return;
        }
        if(key == 81 || key == 113) {
            // 'Q' OR 'q'
            playGame();
            return;
        }
    };

    right.addEventListener("click",()=>{
        if(head.vX !== -1) {
            head.vX = 1;
            head.vY = 0;
            GameActive = true;
        }
    });

    left.addEventListener("click",()=>{
        if(head.vX !== 1) {
            head.vX = -1;
            head.vY = 0;
            GameActive = true;
        }
    })

    up.addEventListener("click",()=>{
        if(head.vY !== 1) {
            head.vX = 0;
            head.vY = -1;
            GameActive = true;
        }
    })

    down.addEventListener("click",()=>{
        if(head.vY !== -1) {
            head.vX = 0;
            head.vY = 1;
            GameActive = true;
        }
    })

    // HANDLES FOOD COLISION AND UPDATE FOOD POSITION
    const foodCollision = () => {
        let foodCollision = false;
        SnakeBodyParts.forEach((part) => {
            if(part.x == Red_Fruit.x && part.y == Red_Fruit.y) {
                foodCollision = true;
            }
        });
        if(foodCollision) {
            const pos = getRandomPosition();
            Red_Fruit.x = pos.x;
            Red_Fruit.y = pos.y;
            score++;
            TailLength++;
            Red_Yellow_Fruit_Count++;
            if(Red_Yellow_Fruit_Count % 3 === 0 || Red_Yellow_Fruit_Count % 5 === 0 || Red_Yellow_Fruit_Count % 7 === 0){
                Yellow_Fruit.spawn();
            }
        }
    }

    // HANDLES YELLOW FRUIT COLLISION
    const YellowFruitCollision = () => {
       if(
        Yellow_Fruit.visible &&
        head.x === Yellow_Fruit.x &&
        head.y === Yellow_Fruit.y
       ) {
        score += 5;
        TailLength += 5;
        Yellow_Fruit.visible = false;
       }
    }

    // CHECK IF THE GAME IS OVER
    const isGameOver = () => {
        let gameOver = false;
        SnakeBodyParts.forEach((part) => {
            if(part.x == head.x && part.y == head.y) {
                gameOver = true;
            }
        });
        if(head.x < 0 || head.y < 0 || head.x > cellCount - 1 || head.y > cellCount - 1) {
            gameOver = true;
        }
        return gameOver;
    }

    // DISPLAY GAME OVER MESSAGE
    const showGameOver = () => {
        const text = document.createElement("div");
        text.setAttribute("id","game_over");
        text.innerHTML = "GAME OVER!";
        document.body.appendChild(text);
    }

    // ADD THE EVENT LISTENER FOR KEYBOARD INPUTS
    addEventListener("keydown",changeDir);

    // HELPER FUNCTION TO SET RANDOM DIRECTION EVERYTIME
    const setRandomDirection = () => {
        const directions = [
            {vX: 1, vY: 0},
            {vX: -1, vY: 0},
            {vX: 0, vY: 1},
            {vX: 0, vY: -1}
        ];
        const randomeDirection = directions[Math.floor(Math.random() * directions.length)];
        head.vX = randomeDirection.vX;
        head.vY = randomeDirection.vY;
    }

    // PAUSE THE GAME
    const pauseGame = () => {
        GameActive = false;
        head.vX = 0;
        head.vY = 0;
        pause.setAttribute('class',"BUTTON");
        play.setAttribute('class',"BUTTON");
    }
    pause.addEventListener("click", pauseGame);

    // PLAY GAME
    const playGame = () => {
        GameActive = true;
        if(head.vX === 0 && head.vY === 0) {
            setRandomDirection();
        }
        pause.setAttribute('class',"BUTTON");
        play.setAttribute('class',"BUTTON");
    }
    play.addEventListener("click", playGame);


    // GAME ANIMATION LOOP
    const animate = () => {
        setCanvas();
        drawSnake();
        Red_Fruit.draw();
        Yellow_Fruit.draw();
        if(GameActive) {
            updateSnakePosition();
            if(isGameOver()){
                showGameOver();
                return;
            }
        }
        setScore();
        foodCollision();
        YellowFruitCollision();
        setTimeout(animate, 1000 / FrameRate);
    }

    // GAME RESET LOGIC
    const resetGame = () => {
        location.reload();
    }
    reset.addEventListener("click",resetGame);
    reset_mobile.addEventListener("click",resetGame);

    animate();

})();