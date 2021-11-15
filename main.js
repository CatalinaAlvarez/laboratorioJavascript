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

    draw(){
        for(var i=this.board.elements.length-1;i>=0;i--){
            var el = this.board.elements[i];

            draw(this.ctx,el);
        }
    }


}

function draw(ctx,element){
    if(element !== null && element.hasOwnProperty("kind")){
        switch(element.kind){
            case "rectangle":
                ctx.fillRect(element.x,element.y,element.width,element.height);
                break;
        }
    }
}

var board = new Board(800,400);
var bar = new Bar(20,100,40,100,board);
var bar2 = new Bar(740,100,40,100,board);
var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas, board);

document.addEventListener("keydown", function(ev){
    if(ev.keyCode == 38){
        //movimiento de la barra1 hacia arriba
        bar.up();
    }else if(ev.keyCode == 40){
        //movimiento de la barra1 hacia abajo
        bar.down();
    }else if(ev.keyCode == 87){
        //movimiento de la barra2 hacia arriba
        bar2.down();
    }else if(ev.keyCode == 83){
        //movimiento de la barra2 hacia abajo
        bar2.down();
    }
});

window.requestAnimationFrame(controller);

window.addEventListener("load", main);


function controller(){
    board_view.draw(); 
    window.requestAnimationFrame(controller);

}