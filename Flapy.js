
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;

let ZekeImg ;
let activeZeke = false;

let pipeArray =[];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let buttomPipeImg;


let velocityY = 0;


let velocityX = -2;

let gravity = 0.2;

let gameOver = false;

let score =0;

let zeke ={
    img:ZekeImg
}


let bird ={
    x:birdX,
    y:birdY,
    width:birdWidth -10,
    height:birdHeight -10
}

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    board.classList.add("roundBorder");

    context = board.getContext("2d");
    ZekeImg = new Image();
    ZekeImg.src = "FlapyBird/Zeke.png";
    birdImg = new Image();
    birdImg.src = "FlapyBird/flappybird1 (1).png";
    birdImg.onload = function(){
        context.drawImage(birdImg,bird.x , bird.y , bird.width , bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "FlapyBird/toppipe.png";

    buttomPipeImg = new Image();
    buttomPipeImg.src = "FlapyBird/bottompipe.png";

    requestAnimationFrame(Update);
    setInterval(placePipes, 2200);

    document.addEventListener("keydown",moveBird);

    // Listen for touch events (for mobile devices)
    document.addEventListener("touchstart", function () {
        jump();
    });

}


function Update(){
    requestAnimationFrame(Update);

    if(gameOver){
        return;
    }

    context.clearRect(0,0,board .width,board.height);
 
    velocityY += gravity;
    bird.y += velocityY;

    bird.y = Math.max(bird.y ,0);
    context.drawImage(ZekeImg,bird.x , bird.y , ZekeImg.width/6,ZekeImg.height/6);

    //context.drawImage(birdImg,bird.x , bird.y , bird.width , bird.height);
        
    if(bird.y > board.height){
        gameOver = true;
    }
    for(let i=0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x+= velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score+=0.5;     
            pipe.passed = true;
        }      

        if(detectCollision(bird, pipe)){
            gameOver = true;
        }   
    }
    while(pipeArray.length >0 && pipeArray[0].x < - pipeWidth){
        pipeArray.shift(); // removes first element
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif"
    context.fillText(score , 5, 45);

    if(gameOver){
        context.fillText("Zekeriya Öldü :(" , 5, 100);
    }

}

function placePipes(){ 
    if(gameOver){
        return;  
    }
    let openingSpace = board.height/3;
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*pipeHeight/2;
    let toppipe={
        img:topPipeImg,
        x:pipeX,
        y:randomPipeY,
        width:pipeWidth,
        height:pipeHeight,
        passed:false
    }

    let buttompipe={
        img:buttomPipeImg,
        x:pipeX,
        y:randomPipeY + pipeHeight + openingSpace,
        width:pipeWidth,
        height:pipeHeight,
        passed:false
    }

    pipeArray.push(buttompipe);
    pipeArray.push(toppipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        jump();
    }
}

// Function to handle jump logic
function jump() {
    velocityY = -6;

    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}






function detectCollision(a, b){
    return a.x < b.x + b.width && 
           a.x + a.width > b.x &&
           a.y <b.y + b.height &&
           a.y + a.height > b.y;
}
