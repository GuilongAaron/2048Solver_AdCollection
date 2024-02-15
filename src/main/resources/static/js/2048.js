var board;
var score = 0;
var rows = 4;
var columns = 4;
var max_element = 0;
var VICTORY_SCORE = 30; // it should be set as 2048 for testing, 4
var acceptKeyboardInput = true;


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


window.onload = function() {
    setGame();
}


document.addEventListener('keyup', (e) => {

    if (acceptKeyboardInput){
        if (e.code == "ArrowLeft") {
            slideLeft();
            //setTwo();
        }
        else if (e.code == "ArrowRight") {
            slideRight();
            //setTwo();
        }
        else if (e.code == "ArrowUp") {
            slideUp();
            //setTwo();

        }
        else if (e.code == "ArrowDown") {
            slideDown();
            
        }
    } 
    document.getElementById("score").innerText = score;
    max_element = findMaxElement(board);
    if (max_element >= VICTORY_SCORE) {
        displayVictory();
        acceptKeyboardInput = false;
    }
    setTwo();
})


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
    resultArea.textContent = "You Win";
}


function filterZero(row){
    return row.filter(num => num != 0); //create new array of all nums != 0
}

function slide(row) {
    //[0, 2, 2, 2] 
    row = filterZero(row); //[2, 2, 2]
    for (let i = 0; i < row.length-1; i++){
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    } //[4, 0, 2]
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
    let count = 0;
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


  function convolution(input, filter) {
    const inputRows = input.length;
    const inputCols = input[0].length;
    const filterRows = filter.length;
    const filterCols = filter[0].length;
  
    const result = [];
  
    for (let i = 0; i <= inputRows - filterRows; i++) {
      const row = [];
      for (let j = 0; j <= inputCols - filterCols; j++) {
        let sum = 0;
        for (let x = 0; x < filterRows; x++) {
          for (let y = 0; y < filterCols; y++) {
            sum += input[i + x][j + y] * filter[x][y];
          }
        }
        row.push(sum);
      }
      result.push(row);
    }
  
    return result;
  }
  
  function sumOfSquares(matrix) {
    let sum = 0;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        sum += matrix[i][j] ** 2;
      }
    }
    return sum;
  }

  
  // CHECK maximum element when checking gameOver()
  // establish a scoring system:
  // 1. 