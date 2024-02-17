// below are global CONST.
// game related
let board;
let playerTurn = false;
let score_global = 0;
const VICTORY_SCORE = 30; // it should be set as 2048 for testing, 4

// ai run
let runAI = true;

// algorithm related
let max_element = 0;
const rows = 4;
const columns = 4;
let acceptKeyboardInput = true;
const MINSearchTime = 500;
const MAX_DEPTH = 10;
const DIRECTIONS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];


// // position related score, may not be used. 
// const SCORE_BOARD_1 = [
//     [4**0, 4**1, 4**2, 4**3],
//     [4**7, 4**6, 4**5, 4**4],
//     [4**8, 4**9, 4**10, 4**11],
//     [4**15, 4**14, 4**13, 4**12]
// ];
// // monotoned score
// const SCORE_BOARD_2 = [
//     [4**9, 4**7, 4**5, 4**3],
//     [4**11, 4**9, 4**7, 4**5],
//     [4**13, 4**11, 4**9, 4**7],
//     [4**15, 4**13, 4**11, 4**9]
// ];

// main program
window.onload = function() {
    setGame();
    if (runAI) {
        run_AI();
    }
}

// interact with input.
document.addEventListener('keyup', (e) => {

    if (acceptKeyboardInput){
        slideWithMove(board, e.key)
        setTwo(board);
    }
    document.getElementById("score").innerText = score_global;
    max_element = findMaxElement(board);
    if (max_element >= VICTORY_SCORE) {
        displayVictory();
        acceptKeyboardInput = false;
    }
})


function run_AI(){
    acceptKeyboardInput = false;
    
    // loop below, not finished: if game is not over: then loop. else: displayGameOver();
    while(true){
        if (max_element >= VICTORY_SCORE) {
            displayVictory();
            break;
        }else if (is_gameOver(board)){
            break;
        }else{            
            let moveDir = getBestMove(board, playerTurn);
            if (moveDir ==-1){
                console.log("best move is found as -1.");
                break;
            }
            slideWithMove(board, moveDir);
            setTwo(board);
        }
    }
}

function getBestMove(board_, playerTurn_){
    let start = (new Date()).getTime();
    let depth = 0;
    let best = -1;

    do{
        let newBest = searchBestMove(board_, playerTurn_, depth, -10000, 10000, 0, 0);
        if (newBest.move == -1){
            break;
        }else{
            best = newBest.move;
        }
        depth++;
    }while((new Date()).getTime() - start < MINSearchTime || depth < MAX_DEPTH);
    
    return best;
}

function searchBestMove(board_, playerTurn_, depth, alpha, beta, positions, cutoffs){
    //make a copy of board.
    // let new_board_origin = clone_board(board);
    let bestScore = -1;
    let bestMove = -1;  //default value to be adjust !!!
    let result = -1;
    
    // from if-condition, line 30
    if (playerTurn_){
        bestScore = alpha;
        for (let direction of DIRECTIONS){
            let new_board = clone_board(board_); 
            let new_playTurn = true;
            //
            slideWithMove(new_board, direction);
            setTwo(new_board);
            // 
            positions++;
            //
            if (is_end(new_board, direction)){
                return {move: direction, score: 10000, positions: positions, cutoffs: cutoffs };
            }            
            if (depth == 0){
                return { move: direction, score: eval(new_board) };
            } else {
                result = searchBestMove(new_board, new_playTurn, depth-1, bestScore, beta, positions, cutoffs);
                if (result.score > 9900){
                    result.score--;
                }
                positions = result.positions;
                cutoffs = result.cutoffs;
            }

            if (result.score > bestScore){
                bestScore = result.score;
                bestMove = direction;
            }

            if (bestScore > beta){
                cutoffs++;
                return  {move: bestMove, score: beta, positions: positions, cutoffs: cutoffs};
            }
        }
    } else {
        // computer turn.
        bestScore = beta;
        let candidates = [];

        // try 2 in each cell, and measure how annoying it is
        let cells = availableCells(board_);
        let scores = {2:[]}; // removed 4 case
        for (let value in scores){  // value == 0;
            for (let i in cells){  // i is the index.
                scores[value].push(null);
                let cell = cells[i];
                board_[cell.x][cell.y] = 2;
                scores[value][i] = -smoothness(board_);  //+ islands(new_board);
                board_[cell.x][cell.y] = 0; 
            }
        }
        
        
        let maxScore = Math.max(Math.max.apply(null, scores[2]))
        for (let value in scores){
            for (let i = 0; i < scores[value].length; i++){
                if (scores[value][i] == maxScore){
                    candidates.push({position: cells[i], value: parseInt(value, 10)});
                }
            }
        }
        
        //search on each candidate
        for (let i = 0; i<candidates.length; i++){
            let position = candidates[i].position;
            let value = candidates[i].value;
            let new_board = clone_board(board_);
            let new_playTurn = true;
            //let new_board2 = clone_board(board);
            new_board[position.x][position.y] = value;
            positions++;
            result = searchBestMove(new_board, new_playTurn, depth, alpha, beta, positions, cutoffs);
            cutoffs = result.cutoffs;
            
            if (result.score < bestScore){
                bestScore = result.score;
            }
            if (bestScore < alpha){
                cutoffs++;
                return { move: -1, score: alpha, positions: positions, cutoffs: cutoffs };
            }
            
        }
    }
    return { move: bestMove, score: bestScore, positions: positions, cutoffs: cutoffs };
}

function is_end(board_, direction){
    let max_ele = findMaxElement(board_);
    //max_ele = 2048. or cannot move.
    if (max_ele === 2048 || !is_movable(board_, direction)){
        // return true
        return true;
    }else{
        //else return false
        return false;
    }
}
function is_gameOver(board_){

    for (let direction of DIRECTIONS){
        let new_board = clone_board(board_);
        slideWithMove(new_board, direction);
        //if one element in board is different, then return true. --> movable
        //else return false: all direction return same board.
        for(let r = 0; r <rows; r++){
            for(let c = 0; c < columns; c++){
                if (board_[r][c] !== new_board[r][c]){
                    return false;
                }
            }
        }        
    }
    return true;
}

function is_movable(board_, direction){
    // let directions = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"];
    // for (let direction of DIRECTIONS){
        let new_board = clone_board(board_);
        slideWithMove(new_board, direction);
        //if one element in board is different, then return true. --> movable
        //else return false: all direction return same board.
        for(let r = 0; r <rows; r++){
            for(let c = 0; c < columns; c++){
                if (board_[r][c] !== new_board[r][c]){
                    return true;
                }
            }
        }        
    // }
    return false;
}
//
// function islands(board_){
//     var mark = function(x, y, value) {
//         if (x >= 0 && x <= 3 && y >= 0 && y <= 3 &&
//             self.cells[x][y] &&
//             self.cells[x][y].value == value &&
//             !self.cells[x][y].marked ) {
//           self.cells[x][y].marked = true;
          
//           for (direction in [0,1,2,3]) {
//             var vector = self.getVector(direction);
//             mark(x + vector.x, y + vector.y, value);
//           }
//         }
//     }
    
//     var islands = 0;
//     for (var x=0; x<4; x++) {
//         for (var y=0; y<4; y++) {
//             if (board_[x][y]) {
//                 this.cells[x][y].marked = false
//             }
//         }
//     }
// }


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
    setTwo(board);
    setTwo(board);
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

function slide(row, board_) {
    //[0, 2, 2, 2] move to left
    row = filterZero(row);  //[2, 2, 2]  first remove zeros
    //[4, 0, 2]  combine the adjacent idential elements
    for (let i = 0; i < row.length-1; i++){
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            if (board_ === board){
                score_global += row[i];
            }
            //add logic here, if row[i] == 2048, displayVictory!
        }
    } 
    row = filterZero(row); //[4, 2]
    //add zeroes
    while (row.length < columns) {
        row.push(0);
    } //[4, 2, 0, 0]
    return row;
}


function slideLeft(board_) {
    for (let r = 0; r < rows; r++) {
        let row = board_[r];
        row = slide(row, board_);
        board_[r] = row;
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board_[r][c];
            updateTile(tile, num);
        }
    }
}


function slideRight(board_) {
    for (let r = 0; r < rows; r++) {
        let row = board_[r];         //[0, 2, 2, 2]
        row.reverse();              //[2, 2, 2, 0]
        row = slide(row, board_)            //[4, 2, 0, 0]
        board_[r] = row.reverse();   //[0, 0, 2, 4];
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board_[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp(board_) {
    for (let c = 0; c < columns; c++) {
        let row = [board_[0][c], board_[1][c], board_[2][c], board_[3][c]];
        row = slide(row, board_);
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board_[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board_[r][c];
            updateTile(tile, num);
        }
    }
}


function slideDown(board_) {
    for (let c = 0; c < columns; c++) {
        let row = [board_[0][c], board_[1][c], board_[2][c], board_[3][c]];
        row.reverse();
        row = slide(row, board_);
        row.reverse();
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board_[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board_[r][c];
            updateTile(tile, num);
        }
    }
}


function setTwo(board_) {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        //find random row and column to place a 2 in
        // this portion can be chosen from availableCell, and random a index.
        let cells = availableCells(board_);
        if(cells.length === 0) {
            break;
        }
        let cell = cells[Math.floor(Math.random() * cells.length)];
        let r = cell.x;  //.random() * cells.length);
        let c = cell.y; // Math.floor(Math.random() * columns);

        if (board_[r][c] == 0) {
            board_[r][c] = 2;
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
                    if (cellOccupied(board_, targetCell.next_x, targetCell.next_y)) {
                        // console.log("if-clause in smoothness is executed.");
                        let target = board_[targetCell.next_x][targetCell.next_y];
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
    if (withinBounds(x, y)){
        return board_[x][y];
    }else{
        return null;
    }
}

function cellOccupied(board_, x, y){

    // if (withinBounds(board_, x, y)){
    //     return board_[x][y];
    // }else{
    //     return null;
    // }
    return !!cellContent(board_, x, y);
}

function findFurthestPosition(board_, x, y, MoveDir){
    let previous_row;
    let previous_col;
    let moving_x_co;
    let moving_y_co;
    if (MoveDir === "ArrowRight"){
        moving_x_co = 0;
        moving_y_co = 1;
    } else if (MoveDir === "ArrowDown"){
        moving_x_co = 1;
        moving_y_co = 0;
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
            if (board_[r][c] ===0) {
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

