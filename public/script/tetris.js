// import { I, J, L, O, S, T, U, Z, W } from "./data";
import { I, J, L, O, S, T, U, Z, W } from "/script/data.js";
const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");

const ROW = 30;
const COL = 15;
const SQ = 15;
const VACANT = "WHITE"; // color of an empty square

// draw a square
function drawSquare(x,y,color, isTetrominoSquare){
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);
    if(isTetrominoSquare){
        ctx.strokeStyle = "white";
        ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
    }else{
        ctx.strokeStyle = "white";
        ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
    }
}

// create the board
let board = [];
for(let r = 0; r <ROW; r++){
    board[r] = [];
    for(let c = 0; c < COL; c++){
        board[r][c] = VACANT;
    }
}

// draw the board
function drawBoard(){
    for(let r = 0; r <ROW; r++){
        for(let c = 0; c < COL; c++){
            drawSquare(c,r,board[r][c], false);
        }
    }
}

drawBoard();

// the pieces and their colors
const PIECES = [
    [Z,"red"],
    [S,"green"],
    [T,"brown"],
    [O,"blue"],
    [L,"purple"],
    [I,"darkgoldenrod"],
    [J,"darkorange"],
    [U, "crimson"],
    [W, "darkviolet"]
];

// generate random pieces
function randomPiece(){
    let r = Math.floor(Math.random() * PIECES.length) // 0 -> 6
    return new Piece( PIECES[r][0],PIECES[r][1]);
}

let p = randomPiece();

// The Object Piece
function Piece(tetromino,color){
    this.tetromino = tetromino;
    this.color = color;
    
    this.tetrominoN = 0; // we start from the first pattern
    this.activeTetromino = this.tetromino[this.tetrominoN];
    
    // we need to control the pieces
    this.x = 6;
    this.y = -2;
}

// fill function
Piece.prototype.fill = function(color){
    for(let r = 0; r < this.activeTetromino.length; r++){
        for(let c = 0; c < this.activeTetromino.length; c++){
            // we draw only occupied squares
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color, true);
            }
        }
    }
}

// draw a piece to the board
Piece.prototype.draw = function(){
    this.fill(this.color);
}

// undraw a piece
Piece.prototype.unDraw = function(){
    this.fill(VACANT);
}

// move Down the piece
Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
        // we lock the piece and generate a new one
        this.lock();
        p = randomPiece();
    }
    
}

// move Right the piece
Piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}

// move Left the piece
Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// rotate the piece
Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;
    
    if(this.collision(0,0,nextPattern)){
        if(this.x > COL/2){
            // it's the right wall
            kick = -1; // we need to move the piece to the left
        }else{
            // it's the left wall
            kick = 1; // we need to move the piece to the right
        }
    }
    
    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; // (0+1)%4 => 1
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

let score = 0;

Piece.prototype.lock = function(){
    for(let r = 0; r < this.activeTetromino.length; r++){
        for(let c = 0; c < this.activeTetromino.length; c++){
            // we skip the vacant squares
            if( !this.activeTetromino[r][c]){
                continue;
            }
            // pieces to lock on top = game over
            if(this.y + r < 0){
                alert("Game Over");
                // stop request animation frame
                gameOver = true;
                break;
            }
            // we lock the piece
            board[this.y+r][this.x+c] = this.color;
        }
    }
    // remove full rows
    for(let r = 0; r < ROW; r++){
        let isRowFull = true;
        for(let c = 0; c < COL; c++){
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if(isRowFull){
            // if the row is full
            // we move down all the rows above it
            for(let y = r; y > 1; y--){
                for(let c = 0; c < COL; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            // the top row board[0][..] has no row above it
            for(let c = 0; c < COL; c++){
                board[0][c] = VACANT;
            }
            // increment the score
            score += 10;
        }
    }
    // update the board
    drawBoard();
    
    // update the score
    scoreElement.innerHTML = score;
}

// collision fucntion
Piece.prototype.collision = function(x,y,piece){
    for(let r = 0; r < piece.length; r++){
        for(let c = 0; c < piece.length; c++){
            // if the square is empty, we skip it
            if(!piece[r][c]){
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            
            // conditions
            if(newX < 0 || newX >= COL || newY >= ROW){
                return true;
            }
            // skip newY < 0; board[-1] will crush our game
            if(newY < 0){
                continue;
            }
            // check if there is a locked piece alrady in place
            if( board[newY][newX] != VACANT){
                return true;
            }
        }
    }
    return false;
}

// CONTROL the piece
document.addEventListener("keydown",CONTROL);
function CONTROL(event){
    if(event.keyCode == 37){ //LEFT KEY = ARROW LEFT
        p.moveLeft();
        dropStart = Date.now();
    }else if(event.keyCode == 38){ //UP KEY = ARROW UP
        p.rotate();
        dropStart = Date.now();
    }else if(event.keyCode == 39){ //RIGHT KEY = ARROW RIGHT
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == 40){ //DOWN KEY = ARROW DOWN
        p.moveDown();
    }
}

// drop the piece every 1sec
let dropStart = Date.now();
let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        p.moveDown();
        dropStart = Date.now();
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}
drop();

//BUTTONS FOR MOBILE AND TABLET USERS
let dob = document.getElementById("DOWN");
dob.addEventListener("click", () =>{
    p.moveDown();
})
let upb = document.getElementById("UP");
upb.addEventListener("click", () =>{
    p.rotate();
    dropStart = Date.now();
})
let rib = document.getElementById("RIGHT");
rib.addEventListener("click", () =>{
    p.moveRight();
    dropStart = Date.now();
})
let lfb = document.getElementById("LEFT");
lfb.addEventListener("click", () => {
    p.moveLeft();
    dropStart = Date.now();
})
let space = document.getElementById('SPACE');
space.addEventListener("click", function(){
    location.reload();
})
let buttongroup = document.getElementById("BTN_SEC");
function updateButtonVisibility(){
    if(window.innerWidth <= 768){
        buttongroup.style.display = "block";
    }else{
        buttongroup.style.display = "none";
    }
}
window.addEventListener('resize',updateButtonVisibility);
updateButtonVisibility();