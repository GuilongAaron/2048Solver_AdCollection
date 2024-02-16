// below are global CONST.
// game related
let board;
let score = 0;

// algorithm related
let max_element = 0;
const rows = 4;
const columns = 4;
const VICTORY_SCORE = 30; // it should be set as 2048 for testing, 4
var acceptKeyboardInput = true;
var playerTurn = true
const DEPTH = 4;
const ALPHA = 4;
const BETA = 4;

// position related score, may not be used. 
const SCORE_BOARD_1 = [
    [4**0, 4**1, 4**2, 4**3],
    [4**7, 4**6, 4**5, 4**4],
    [4**8, 4**9, 4**10, 4**11],
    [4**15, 4**14, 4**13, 4**12]
];
// monotoned score
const SCORE_BOARD_2 = [
    [4**9, 4**7, 4**5, 4**3],
    [4**11, 4**9, 4**7, 4**5],
    [4**13, 4**11, 4**9, 4**7],
    [4**15, 4**13, 4**11, 4**9]
];

// main program
window.onload = function() {
    setGame();
    if (!playerTurn) {
        run_AI();
    }
}

// interact with input.
document.addEventListener('keyup', (e) => {

    if (acceptKeyboardInput){
        slideWithMove(board, e.key)
        setTwo();
    }
    document.getElementById("score").innerText = score;
    max_element = findMaxElement(board);
    if (max_element >= VICTORY_SCORE) {
        displayVictory();
        acceptKeyboardInput = false;
    }
})


function run_AI(){
    acceptKeyboardInput = false;

    // loop below, not finished
    moveDir = searchBestMove(board, DEPTH, ALPHA, BETA);
    slideWithMove(board, moveDir);
}

function searchBestMove(board, DEPTH, ALPHA, BETA){
    //make a copy of board.
    let new_board = clone_board(board);
    let bestScore = -1;
    let bestMove = "ArrowDown";
    let result = -1;

    bestScore = BETA;

    // try 2 in each cell, and measure how annoying it is
    let candidates = [];
    let cells = availableCells(new_board);
    let scores = {2:[], 4:[]};
    for (let value in scores){
        for (let i in cells){
            scores[value].push(null);
            let cell = cells[i];

        }
    }

}

function clone_board(board){
    let board_ = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    for (let r = 0; r < rows; r++){
        for (let c = 0; c < columns; c++){
            board_[r][c] = board[r][c];
        }
    }
    return board_
}

function eval(board_){
    let emptyCells_len = availableCells(board_).length;

    let smoothWeight = 0.1;
    let mono2Weight = 1.0;
    let emptyWeight = 2.7;
    let maxWeight = 1.0;
    return smoothness(board_) * smoothWeight
            + monotonicity2(board_) * mono2Weight
            + Math.log(emptyCells_len) * emptyWeight 
            + max_element * maxWeight  

}


function slideWithMove(board_, move){

    if (move == "ArrowLeft") {
        slideLeft(board_);  
    }
    else if (move == "ArrowRight") {
        slideRight(board_);  
    }
    else if (move == "ArrowUp") {
        slideUp(board_);   

    }
    else if (move == "ArrowDown") {
        slideDown(board_);  

    }
}



function setGame() {

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    //create 2 to begin the game
    setTwo();
    setTwo();
}

function updateTile(tile, num){
    tile.innerText = "";
    tile.classList.value = ""; // clear the class List;
    tile.classList.add("tile");
    if (num > 0){
        tile.innerText = num;
        if (num <= 1024) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x2048");            
        }        
    }
}


function displayVictory() {
    const resultArea = document.getElementById('resultArea');
    resultArea.textContent = "You Win!";
}


function filterZero(row){
    return row.filter(num => num != 0); //create new array of all nums != 0
}

function slide(row) {
    //[0, 2, 2, 2] move to left
    row = filterZero(row);  //[2, 2, 2]  first remove zeros
    //[4, 0, 2]  combine the adjacent idential elements
    for (let i = 0; i < row.length-1; i++){
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    } 
    row = filterZero(row); //[4, 2]
    //add zeroes
    while (row.length < columns) {
        row.push(0);
    } //[4, 2, 0, 0]
    return row;
}


function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}


function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];         //[0, 2, 2, 2]
        row.reverse();              //[2, 2, 2, 0]
        row = slide(row)            //[4, 2, 0, 0]
        board[r] = row.reverse();   //[0, 0, 2, 4];
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}


function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}


function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        //find random row and column to place a 2 in
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}



function hasEmptyTile() {
    //let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) { //at least one zero in the board
                return true;
            }
        }
    }
    return false;
}


function findMaxElement(array) {
    let max = array[0][0];
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        if (array[i][j] > max) {
          max = array[i][j];
        }
      }
    }
    return max;
  }



function smoothness(board_) {
    let smoothness = 0;
    let directions = ["ArrowRight", "ArrowDown"];
    // let value;
    // let targetCell;
    for (let x=0; x<4; x++) {
        for (let y=0; y<4; y++) {
            if (cellOccupied(board_, x, y)) {
                let value = Math.log(board_[x][y]) / Math.log(2);  //base 2, the log value
                for (const direction of directions) {                
                    let targetCell = findFurthestPosition(board_, x, y, direction);
                    // I strongly feel here, should be previous_row, previous_col
                    // (board_, targetCell.previous_row, targetCell.previous_col)
                    // (board_, targetCell.next_x, targetCell.next_y)
                    if (cellOccupied(board_, targetCell.previous_row, targetCell.previous_col)) {
                        console.log("if-clause in smoothness is executed.");
                        let target = cellContent(board_, targetCell.previous_row, targetCell.previous_col);
                        let targetValue = Math.log(target) / Math.log(2);
                        smoothness -= Math.abs(value - targetValue);
                    }
                }
            }
        }
    }
    return smoothness;
}

function withinBounds(x, y){
    return x>=0 && x<4 &&y>=0 && y<4;
}

function cellContent(board_, x, y){
    if (withinBounds(board_, x, y)){
        return board_[x][y];
    }else{
        return null;
    }
}

function cellOccupied(board_, x, y){
    return !!cellContent(board_, x, y);
}

function findFurthestPosition(board_, x, y, MoveDir){
    let previous_row;
    let previous_col;
    let moving_x_co;
    let moving_y_co;
    if (MoveDir === "ArrowRight"){
        moving_x_co = 1;
        moving_y_co = 0;
    } else if (MoveDir === "ArrowDown"){
        moving_x_co = 0;
        moving_y_co = 1;
    }
    do {
        previous_row = x;
        previous_col = y;
        x = previous_row + moving_x_co;
        y = previous_col + moving_y_co;
    }while(withinBounds(x, y) && !cellOccupied(board_, x, y));

    return {
        furthest_x: previous_row,
        furthest_y: previous_col,
        next_x: x,
        next_y: y
        };
}

function availableCells(board_){
    let cells = [];
    for (let r = 0; r < rows; r++){
        for (let c = 0; c < columns; c++){
            if (board_[r][c] !==0) {
                cells.push({x: r, y: c});
            }
        }
    }
    return cells;
}


function monotonicity2(board_){
    let totals = [0, 0, 0, 0];

    for (let r = 0; r < rows; r++){
        let current = 0;
        let next = current + 1;

        while(next<4){
            while(next<4 && !cellOccupied(board_, r, next)){
                next++;
            }
            if (next>=4) {
                next--;
            }
            let currentValue = cellOccupied(board_, r, current) ? Math.log(cellContent(board_, r, current)) / Math.log(2) : 0;
            let nextValue = cellOccupied(board_, r, next) ? Math.log(cellContent(board_, r, next)) / Math.log(2) : 0;
            
            if (currentValue > nextValue){
                totals[0] += nextValue - currentValue;
            } else if (nextValue > currentValue){
                totals[1] += currentValue - nextValue
            }
            current = next;
            next++;
        }
    }

    for (let c = 0; c < columns; c++){
        let current = 0;
        let next = current + 1;
        while(next<4){
            while(next<4 && !cellOccupied(board_, next, c)){
                next++;
            }
            if (next>=4) {
                next--;
            }
            let currentValue = cellOccupied(board_, current, c) ? Math.log(cellContent(board_, current, c)) / Math.log(2) : 0;
            let nextValue = cellOccupied(board_, next, c) ? Math.log(cellContent(board_, next, c)) / Math.log(2) : 0;
            
            if (currentValue > nextValue){
                totals[0] += nextValue - currentValue;
            } else if (nextValue > currentValue){
                totals[1] += currentValue - nextValue
            }
            current = next;
            next++;
        }
    }
    return Math.max(totals[0], totals[1]) + Math.max(totals[2], totals[3]);

}



// function convolution(input, filter) {
// const inputRows = input.length;
// const inputCols = input[0].length;
// const filterRows = filter.length;
// const filterCols = filter[0].length;

// const result = [];

// for (let i = 0; i <= inputRows - filterRows; i++) {
//     const row = [];
//     for (let j = 0; j <= inputCols - filterCols; j++) {
//     let sum = 0;
//     for (let x = 0; x < filterRows; x++) {
//         for (let y = 0; y < filterCols; y++) {
//         sum += input[i + x][j + y] * filter[x][y];
//         }
//     }
//     row.push(sum);
//     }
//     result.push(row);
// }

// return result;
// }
  
// function sumOfSquares(matrix) {
// let sum = 0;
// for (let i = 0; i < matrix.length; i++) {
//     for (let j = 0; j < matrix[i].length; j++) {
//     sum += matrix[i][j] ** 2;
//     }
// }
// return sum;
// }


// CHECK maximum element when checking gameOver()
// establish a scoring system:
// 1. 

