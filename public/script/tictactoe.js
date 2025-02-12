// RANDOM CHOICE BETWEEN X & O
let turn = Math.random() < 0.5 ? "X" : "O";
let gameWin = false;
let move = 0;

// DISPLAY THE INITIAL TURN IN THE BOX
document.getElementsByClassName("info")[0].innerText = "Turn For " + turn;

// FUNCTION TO CHANGE THE TURN
const changeTurn = () => {
    return turn === "X" ? "O" : "X";
}

// FUNCTION TO CHECK THE WINNER
const checkWin = () => {
    let boxtexts = document.getElementsByClassName("boxcontent");
    let wins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    wins.forEach((e) => {
        if(
            (
                boxtexts[e[0]].innerText === boxtexts[e[1]].innerText && 
                (boxtexts[e[2]].innerText === boxtexts[e[1]].innerText) && 
                (boxtexts[e[0]].innerText !== "")
            )
        ) {
            document.querySelector('.info').innerText = boxtexts[e[0]].innerText + " Won The Game!";
            move = 0;
            gameWin = true;
        }
    });
}

// TIC TAC TOE GAME LOGIC
let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach((element) => {
    let boxtest = element.querySelector('.boxcontent');
    element.addEventListener("click",()=>{
        if(gameWin){
            move = 0;
            return;
        }
        if(boxtest.innerText === "") {
            boxtest.innerText = turn;
            boxtest.style.color = turn === "X" ? 'rgb(255, 251, 0)' : 'rgb(0, 228, 209)';
            turn = changeTurn();
            move++;
            checkWin();
            if(!gameWin) {
                document.getElementsByClassName("info")[0].innerText = "Turn For " + turn;
            }
            if(!gameWin && move === 9) {
                document.querySelector('.info').innerText = "The Game Is Draw!";
                move = 0;
            }
        }
    })
})

// RESET BUTTON FUNCITON
reset.addEventListener('click',() => {
    gameWin = false;
    let boxtexts = document.querySelectorAll('.boxcontent');
    Array.from(boxtexts).forEach((element) => {
        element.innerText = "";
    });
    turn = Math.random() < 0.5 ? "X" : "O";
    move = 0;
    document.getElementsByClassName("info")[0].innerText = "Turn For " + turn;
})