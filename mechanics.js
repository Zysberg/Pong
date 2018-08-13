var canvas, canvasContext;
var ballX = 400,ballY = 300, ballSpeedX = 3,ballSpeedY=0;
var paddleLY = 250;
var paddleRY = 250;
const PADDLE_HEIGHT = 100;

var HUMscr = 0,CPUscr = 0;
const win = 3;

var endGame = false;

function calcMousePos(evt){
	var rect = canvas.getBoundingClientRect();
	var rt = document.documentElement;
	var mouseX = evt.clientX - rect.left - rt.scrollLeft;
	var mouseY = evt.clientY - rect.top - rt.scrollTop;
	return {x:mouseX,y:mouseY};
}

function handleMouseClick(evt){
	if (endGame){
		HUMscr=0;
		CPUscr=0;
		endGame=false;
	}
}

window.onload = function(){
	canvas = document.getElementById("gameCanvas");
	canvasContext = canvas.getContext('2d');
	var fps = 100;


	setInterval(execute,1000/fps);

	canvas.addEventListener('mousedown',handleMouseClick);

	canvas.addEventListener('mousemove', function(evt){
		var mousePos = calcMousePos(evt);
		paddleLY = mousePos.y-PADDLE_HEIGHT/2;
		//paddleRY = mousePos.y-PADDLE_HEIGHT/2;
	});

}

function execute(){
	mathTick();
	drawTick();
}

function reset(){
	if (HUMscr==win||CPUscr==win){
		endGame=true;
	}
	ballSpeedX=3 * (ballSpeedX/(Math.abs(ballSpeedX)));
	ballSpeedY=0;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function mathTick(){
	if (HUMscr==win||CPUscr==win){
		return;
	}
	CPU();
	ballX+=ballSpeedX;
	if (ballX<13.75){
		if (ballY>paddleLY&&ballY<(paddleLY+PADDLE_HEIGHT)){
			ballSpeedX = -ballSpeedX*1.25;
			var del = ballY - (paddleLY+PADDLE_HEIGHT/2);
			ballSpeedY = del*0.10;

		}
		else{
			CPUscr+=1;
			reset();
		}
	};

	if (ballX>canvas.width-13.75){
		if (ballY>paddleRY&&ballY<(paddleRY+PADDLE_HEIGHT)){
			ballSpeedX = -ballSpeedX*1.25;
			var del = ballY - (paddleRY+PADDLE_HEIGHT/2);
			ballSpeedY = del*0.10;
		}
		else{
			HUMscr+=1;
			reset();
		}
	}

	ballY+=ballSpeedY;
	if (ballY>canvas.height-3.75||ballY<3.75){
		ballSpeedY=-ballSpeedY;
	}
}

function renderGameAsset(X,Y,W,H,color){
	canvasContext.fillStyle = color;
	canvasContext.fillRect(X,Y,W,H);
}

function renderBall(X,Y,color){
	canvasContext.fillStyle = color;
	canvasContext.beginPath();
	canvasContext.arc(X,Y,7.5,0,Math.PI*2,true);
	canvasContext.fill();
}

function drawNet(){
	for (var i =10; i<canvas.height;i+=40){
		renderGameAsset(canvas.width/2-1,i,2,20,"white");
	}
}

function drawTick(){
	renderGameAsset(0,0,canvas.width,canvas.height,"black");
	canvasContext.fillStyle = "white";
	canvasContext.fillText(HUMscr,100,100);
	canvasContext.fillText(CPUscr,canvas.width-100,100);

	if (endGame){
		if (HUMscr == win){
			canvasContext.fillText("Winner is you!", 400,300);
		}
		else{
			canvasContext.fillText("CPU wins!", 400,300);
		}
		canvasContext.fillText("Game Over. Click to continue.",350,100);
		return;
	}

	//Ball
	renderBall(ballX,ballY,"red");
	//Paddle - HUM
	renderGameAsset(0,paddleLY,10,PADDLE_HEIGHT,"white");
	//Paddle - CPU
	renderGameAsset(790,paddleRY,10,PADDLE_HEIGHT,"white");

	drawNet();
}

function CPU(){
	CPUcenter = paddleRY+(PADDLE_HEIGHT/2);
	if (CPUcenter<ballY-35){
		paddleRY+=3;
	}
	else if (CPUcenter>ballY+35){
		paddleRY-=3;	
	}
};