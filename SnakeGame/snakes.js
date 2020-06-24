//Game Loop - Init, Draw, Update

//localStorageFunctionality can't be added here, because that's a chrome extension, can run on a browser only
highest_score = 0;

function getRandomFood(){
	var foodX = Math.round(Math.random()*(W-10)/10);
	var foodY = Math.round(Math.random()*(H-10)/10);

	foodColors = ["red", "green", "aqua", "orchid", "ivory", "coral"];

	var i = Math.round(Math.random() * (foodColors.length-1));

	var food = {
		x : foodX,
		y : foodY,
		color: foodColors[i]
	}

	return food;
}

function init(){
	//console.log("init");
	canvas = document.getElementById('mycanvas');
	pen = canvas.getContext('2d');
	W = canvas.width;
	H = canvas.height;
	game_over = false;

	// box = {
	// 	x:10,
	// 	y:20,
	// 	w:20,
	// 	h:20,
	// 	speed:5
	// }

	food = getRandomFood();
	score = 0;

	snake = {
		init_length: 5,
		color: "yellow",
		cells: [],
		direction: "right",

		createSnake: function(){
			for(var i=this.init_length-1;i>=0;i--){
				this.cells.push({x:i, y:0});
			}
			// ({4,0}, {3,0}, {2,0}, {1,0}, {0,0})

			//ToMove, pop last, and push at front
			//that is ({5,0} ,{4,0}, {3,0}, {2,0}, {1,0})
			//so, draw karein, toh it looks like snake is moving right
			//this is implemented in updateSnake()
		},

		drawSnake: function(){
			for(var i=0;i<this.cells.length;i++){
				pen.fillStyle = this.color;

				pen.strokeStyle = "black";
				pen.lineWidth = 5;

				pen.strokeRect(this.cells[i].x * 10, this.cells[i].y * 10, 10, 10);
				pen.fillRect(this.cells[i].x * 10, this.cells[i].y * 10, 10, 10);
			}
		},

		updateSnake: function(){
			var headX = this.cells[0].x;
			var headY = this.cells[0].y;

			//Assuming snake is moving right
			//Insertion at head
			// nextHeadX = headX+1;
			//this.cells.pop();
			// this.cells.unshift({x: nextHeadX, y: headY});

			if(headX == food.x && headY == food.y){
				food = getRandomFood();
				score++;
			}
			else{
				//Pop last cell if food not eaten
				this.cells.pop();
			}

			if(this.direction == "right"){
				nextX = headX + 1;
				nextY = headY;
			}
			else if(this.direction == "left"){
				nextX = headX - 1;
				nextY = headY;
			}
			else if(this.direction == "down"){
				nextX = headX;
				nextY = headY + 1;
			}
			else if(this.direction == "up"){
				nextX = headX;
				nextY = headY - 1;
			}

			//Insert the new cell at head/front
			this.cells.unshift({x:nextX, y:nextY});


			//Find out the last coordinate (boundaries)
			var last_x = Math.round(W/10);
			var last_y = Math.round(H/10);

			if(this.cells[0].y < 0 || this.cells[0].x < 0 ||
				this.cells[0].y > last_y || this.cells[0].x > last_x){
				if(score > highest_score){
					highest_score = score;
				}
				alert("Gameover");
				game_over = true;
			}
		}
	};

	snake.createSnake();

	//Add event listeners to our game
	//Listen for keyboard events

	function KeyPressed(e){ // e is an object
		if(e.key == "ArrowRight"){
			snake.direction = "right";
		}
		else if(e.key == "ArrowLeft"){
			snake.direction = "left";
		}
		else if(e.key == "ArrowDown"){
			snake.direction = "down";
		}
		else if(e.key == "ArrowUp"){
			snake.direction = "up";
		}
	}

	document.addEventListener('keydown', KeyPressed);
} 

function draw(){
	pen.clearRect(0,0,W,H);
	//console.log("Draw");
	snake.drawSnake();

	//Let's draw the food
	pen.fillStyle = food.color;
	pen.fillRect(food.x * 10, food.y * 10, 10, 10);

	pen.fillStyle = "white";
	pen.font = "14px Roboto";
	pen.fillText("Score: " + score, 10, 10);
	pen.fillText("Highest Score " + highest_score, 100, 10);

}

function update(){
	//console.log("Update");
 	snake.updateSnake();
}

function gameLoop(){
	draw();
	update();

	if(game_over == true){
		clearInterval(f);
	}
}

init();

//Call Game Loop after t time

var f = setInterval(gameLoop, 100);
