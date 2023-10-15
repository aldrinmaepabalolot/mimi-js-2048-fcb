//declare variables
let board;
let score = 0;
let rows = 4;
let columns = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

//create function for the gameboard

function setGame(){
	//initialize 4x4 gameboard, all tiles set to 0
	board = [
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0]
	]

	for(r=0;r<rows;r++){//rows
		for(c=0;c<columns;c++){//columns
			//create a div element representing a tile
			let tile = document.createElement("div");

			//set unique identifier tile
			//r0c0 -> 0-0
			tile.id = r.toString() + "-" + c.toString();

			let num = board[r][c];//example: board[0][0]

			//update the tile's appearance based on num values
			updateTile(tile,num);

			//append tile to gameboard container.
			document.getElementById("board").append(tile);
		}
	}

	//random tile
	setTwo();
	setTwo();
}

//update tile appearance based on number value
function updateTile(tile,num){
	//clear the tile content
	tile.innerText = "";

	//clear class list to avoid multiple classes
	tile.classList.value = "";

	//add class named "tile"
	tile.classList.add("tile");


	// This will check for the "num" parameter and will apply specific styling based on the number value.
	// If num is positive, the number is converted to a string and placed inside the tile as text.
	if(num > 0) {
	    // Set the tile's text to the number based on the num value.
	    tile.innerText = num.toString();
	    // if num is less than or equal to 4096, a class based on the number is added to the tile's classlist. 
	    if (num <= 4096){
	        tile.classList.add("x"+num.toString());
	    } else {
	        // if num is greater than 4096, a special  class "x8192" is added.
	        tile.classList.add("x8192");
	    }
	}
}


//trigger web page
window.onload = function(){
	//execute setGame function
	setGame();
}

//create function for event listiners
function handleSlide(e){
	//console.log(e.code);
	
	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]){
		e.preventDefault();

		if(e.code == "ArrowLeft"){
			slideLeft();
			setTwo();
		}
		else if(e.code == "ArrowRight"){
			slideRight();
			setTwo();
		}
		else if(e.code == "ArrowUp"){
			slideUp();
			setTwo();
		}
		else if(e.code == "ArrowDown"){
			slideDown();
			setTwo();
		}
	}

	//update score
	document.getElementById("score").innerText = score;

	checkWin();

	   // Call hasLost() to check for game over conditions
	   if (hasLost()) {
	       // Use setTimeout to delay the alert
	       setTimeout(() => {
	           alert("Game Over! You have lost the game. Game will restart");
	           restartGame();
	           alert("Click any arrow key to restart");
	           // You may want to reset the game or perform other actions when the user loses.
	       }, 100); // Adjust the delay time (in milliseconds) as needed

	   }
}
document.addEventListener("keydown",handleSlide);

function filterZero(row){
	return row.filter(num => num != 0);//remove empty tiles
}

//core function
function slide(row){
	row = filterZero(row);//get rid of zero tiles

	//check adjacent equal numbers.
	for(let i = 0; i < row.length - 1; i++){
		if(row[i] == row[i+1]){
			row[i] *= 2; //double first number
			row[i+1] = 0;//set second number to 0

			//logic for score
			score+=row[i];
		}//[2,2,2] -> [4,0,2]
	}
	//[4,2]
	row = filterZero(row);

	//[4,2]->[4,2,0,0]
	//add zeros back
	while(row.length < columns){
		row.push(0);
	}

	return row;
}

function slideLeft(){
	//iterate each row for checking
	for(let r=0; r<rows; r++){
		let row = board[r];

		let originalRow = row.slice();//store original row

		row = slide(row);//merge tiless

		board[r] = row;//updates row value

		//update tile id
		for(let c = 0; c<columns; c++){
			let tile = document.getElementById(r.toString()+"-"+c.toString());
			let num = board[r][c];

			//check if there is changes in style
			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-right 0.3s";

				//remove animation for another animation
				setTimeout(()=>{
					tile.style.animation = "";
				}, 300)
			}

			updateTile(tile,num);
		}
	}
}

function slideRight(){
	//iterate each row for checking
	for(let r=0; r<rows; r++){
		let row = board[r];

		let originalRow = row.slice();//store original row

		//reverse order of row
		row.reverse();

		row = slide(row);//merge tiless

		row.reverse();

		board[r] = row;//updates row value

		//update tile id
		for(let c = 0; c<columns; c++){
			let tile = document.getElementById(r.toString()+"-"+c.toString());
			let num = board[r][c];

			//check if there is changes in style
			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-left 0.3s";

				//remove animation for another animation
				setTimeout(()=>{
					tile.style.animation = "";
				}, 300)
			}

			updateTile(tile,num);
		}
	}
}

function slideUp(){
    for(let c = 0; c < columns; c++) {
        // In two dimensional array, the first number represents row, and second is column.
        // Create a temporary array called row that represents a column from top to bottom.
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]] // first column of the board =  [2, 0, 2, 0]

        let originalRow = row.slice();//store original row

        row = slide(row) // [2, 2] -> [4, 0] -> [4, 0, 0, 0]

        //check which tiles changed in column
        let changedIndices = [];

        for(let r=0; r<rows; r++){
        	if(originalRow[r] !==row[r]){
        		changedIndices.push(r);
        	}
        }

        // Update the id of the tile
        for(let r = 0; r < rows; r++){
            // sets the values of the board array back to the values of the modified row, essentially updating the column in the game board.
            board[r][c] = row[r]
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if(changedIndices.includes(r)&&num!==0){
            	tile.style.animation ="slide-from-bottom 0.3s";

            	setTimeout(()=>{
            		tile.style.animation = "";
            	}, 300);
            }
            updateTile(tile, num)
        }
    }
}

function slideDown(){
	for(let c = 0; c < columns; c++) {
	    
	    let row = [board[0][c], board[1][c], board[2][c], board[3][c]] // first column of the board =  [2, 0, 2, 0]
	   	let originalRow = row.slice();//store original row
	    row.reverse();
	    row = slide(row) 
	    row.reverse();

	    let changedIndices = [];

	    for(let r=0; r<rows; r++){
	    	if(originalRow[r] !==row[r]){
	    		changedIndices.push(r);
	    	}
	    }
	    // Update the id of the tile
	    for(let r = 0; r < rows; r++){
	        // sets the values of the board array back to the values of the modified row, essentially updating the column in the game board.
	        board[r][c] = row[r]
	        let tile = document.getElementById(r.toString() + "-" + c.toString());
	        let num = board[r][c];
	        if(changedIndices.includes(r)&&num!==0){
	        	tile.style.animation ="slide-from-top 0.3s";

	        	setTimeout(()=>{
	        		tile.style.animation = "";
	        	}, 300);
	        }
	        updateTile(tile, num)
	    }
	}
}

//check if there is empty(zero) tile
function hasEmptyTile(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			//check if zero
			if(board[r][c] == 0){
				return true;
			}
		}
	}
	//no tile with zero value
	return false;
}

//function that adds 2 value in a tile
function setTwo(){
	if(!hasEmptyTile()){
		return;
	}

	let found = false;

	while(!found){
		//random-generate number between 0 - 1, then multiplies row or column
		//floor-round down to nearest integer
		let r = Math.floor(Math.random()*rows);
		let c = Math.floor(Math.random()*columns);

		//check if [r,c] is empty
		if(board[r][c] == 0){
			board[r][c] = 2;

			let tile = document.getElementById(r.toString()+"-"+c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");

			//skipped loop coz emty tile is found
			found=true;
		}
	}
}

function checkWin(){
    // iterate through the board
    for(let r =0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            // check if current tile == 2048 and is2048Exist == false
            if(board[r][c] == 2048 && is2048Exist == false){
                alert('You Win! You got the 2048');  // If true, alert and  
                is2048Exist = true;     // reassigned the value of is2048Exist to true to avoid continuous appearance of alert.
            } else if(board[r][c] == 4096 && is4096Exist == false) {
                alert("You are unstoppable at 4096! You are fantastically unstoppable!");
                is4096Exist = true;     // reassigned the value of is4096Exist to true to avoid continuous appearance of alert.
            } else if(board[r][c] == 8192 && is8192Exist == false) {
                alert("Victory!: You have reached 8192! You are incredibly awesome!");
                is8192Exist = true;    // reassigned the value of is8192Exist to true to avoid continuous appearance of alert.
            }
        }
    }
}


function hasLost() {
    // Check if the board is full
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                // Found an empty tile, user has not lost
                return false;
            }

            const currentTile = board[r][c];

            // Check adjacent cells (up, down, left, right) for possible merge
            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }
        }
    }

    // No possible moves left or empty tiles, user has lost
    return true;
}

// RestartGame by replacing all values into zero.
function restartGame(){
    // Iterate in the board and 
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            board[r][c] = 0;    // change all values to 0
        }
    }
    score = 0; //reset score
    setTwo();    // new tile   
}

//Mobile comp

document.addEventListener("touchstart", (e)=>{
	//capture coordinates
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e)=>{
	//prevent scrolling
	if(!e.target.className.includes("tile")){
		return;
	}
	e.preventDefault();//disable line scrolling
},{passive: false});

//listen touchend event
document.addEventListener("touchend", (e) =>{

	// check if the element triggered the event has a classname tile
	if(!e.target.className.includes("tile")){
		return // exit the function
	}

	// Calculate the horizontal and vertical difference between the initial position and final position.
	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;

	// Chekc if the horizontal swipe is greater magnitude than the vertical swipe
	if(Math.abs(diffX) > Math.abs(diffY)){
		//horizontal swipe
		if(diffX > 0){
			slideLeft();
			setTwo();
		}
		else{
			slideRight();
			setTwo();
		}
	}
	else{
		// vertical swipe
		if(diffY > 0){
			slideUp();
			setTwo();
		}
		else{
			slideDown();
			setTwo();
		}
	}

	//update score
	document.getElementById("score").innerText = score;

	checkWin();

	   // Call hasLost() to check for game over conditions
	   if (hasLost()) {
	       // Use setTimeout to delay the alert
	       setTimeout(() => {
	           alert("Game Over! You have lost the game. Game will restart");
	           restartGame();
	           alert("Click any arrow key to restart");
	           // You may want to reset the game or perform other actions when the user loses.
	       }, 100); // Adjust the delay time (in milliseconds) as needed

	   }
});