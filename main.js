class Board{
    width;
    height;
    playing;
    game_over;
    bars;
    ball;
    playing; 

    constructor(width, height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
        this.playing = false;
    }

    get elements(){
        var elements = this.bars;
        elements.push(this.ball);
        return elements;
    }

}

class Ball{
    constructor(x,y,radius,board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.board = board; 
        this.speed_x = 3;
        this.speed_y = 0;

        this.board.ball = this;
        this.kind = "circle";
    }
}

class Bar{
    constructor(x,y,width,height,board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 10;
    }

    down(){
        this.y += this.speed;
    }

    up(){
        this.y -= this.speed;
    }

    toString(){
        return "x: " + this.x + " y: " + this.y;
    }
}

class BoardView{

    constructor(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

    clean(){
        this.ctx.clearRect(0,0,this.board.width,this.board.height);
    }

    draw(){
        for(var i=this.board.elements.length-1;i>=0;i--){
            var el = this.board.elements[i];

            draw(this.ctx,el);
        }
    }

    play(){
        this.clean();
        this.draw(); 
    }
}

function draw(ctx,element){    
    switch(element.kind){
         case "rectangle":
            ctx.fillRect(element.x,element.y,element.width,element.height);
            break;
        case "circle":
            ctx.beginPath();
            ctx.arc(element.x,element.y,element.radius,0,7);
            ctx.fill();
            ctx.closePath();
            break;
    }
    
}

var board = new Board(800,400);
var bar = new Bar(20,100,40,100,board);
var bar2 = new Bar(740,100,40,100,board);
var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas, board);
var ball = new Ball(350,100,10,board);

document.addEventListener("keydown", function(ev){
    if(ev.keyCode == 38){
        ev.preventDefault();
        //movimiento de la barra1 hacia arriba
        bar.up();
    }else if(ev.keyCode == 40){
        ev.preventDefault();
        //movimiento de la barra1 hacia abajo
        bar.down();
    }else if(ev.keyCode == 87){
        ev.preventDefault();
        //movimiento de la barra2 hacia arriba
        bar2.up();
    }else if(ev.keyCode == 83){
        ev.preventDefault();
        //movimiento de la barra2 hacia abajo
        bar2.down();
    }
});

window.requestAnimationFrame(controller);

window.addEventListener("load", controller);


function controller(){
    board_view.play();
    window.requestAnimationFrame(controller);

}