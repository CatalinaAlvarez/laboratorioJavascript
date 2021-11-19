class Board{

    constructor(width, height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }

    get elements(){
        //Devuelve los elementos:las barras y la pelota
        var elements = this.bars.map(function(bar){ return bar;});
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
        this.speed_x = 2;
        this.speed_y = 0;
        this.direction = -1;
        this.bounce_angle = 0;
		this.max_bounce_angle = Math.PI / 12;
        this.speed = 2;

        this.board.ball = this;
        this.kind = "circle";
    }
    move(){
        //Genera el movimiento de la pelota
        this.x += (this.speed_x * this.direction);
        this.y += (this.speed_y);
    }

    get width(){
        return this.radius * 2;
    }

    get height(){
        return this.radius * 2;
    }

    collision(){
        //Reacciona a la colisión con una barra que recibe como parametro
        var relative_intersect_y = ( bar.y + (bar.height / 2) ) - this.y;

        var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

        this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
        console.log(this.bounce_angle);
        this.speed_y = this.speed * -Math.sin(this.bounce_angle);
        this.speed_x = this.speed * Math.cos(this.bounce_angle);

        if(this.x > (this.board.width / 2)) this.direction = -1;
        else this.direction = 1;
    }

    wallCollision(){
        //Reacciona a la colisión de la pelota con el muro de arriba y abajo
        if(ball.y + ball.radius > board_view.canvas.height || ball.y - ball.radius <0){
            ball.speed_y = -ball.speed_y;
        }
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
        //Mueve la barra hacia abajo
        this.y += this.speed;
    }

    up(){
        //Mueve la barra hacia arriba
        this.y -= this.speed;
    }

    toString(){
        //Retorna el string
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
        //Limpia la pantalla
        this.ctx.clearRect(0,0,this.board.width,this.board.height);
    }

    draw(){
        //dibuja los elementos alojados en el Array Elements
        for(var i=this.board.elements.length-1;i>=0;i--){
            var el = this.board.elements[i];

            draw(this.ctx,el);
        }
    }

    check_collisions(){
        //Revisa dónde se está generando la colisión 
        for (var i = this.board.bars.length-1; i >= 0; i--) {
            var bar = this.board.bars[i];
            if(hit(bar,this.board.ball)){
                if(bar == barUp || bar == barDown){
                    this.board.ball.wallCollision(bar);
                }else{
                    this.board.ball.collision(bar);
                }
            }            
        }
    }

    play(){
        //Recibe las funciones para poner a funcionar el juego
        if(this.board.playing){
            this.clean();
            this.draw();
            this.check_collisions();
            this.board.ball.move();
        }
    }
}


function hit(a,b){
    //Revisa si a colisiona con b
    var hit = false;
    //Colisiones horizontales
    if(b.x + b.width >= a.x && b.x < a.x + a.width)
    {
        //Colisiones verticales
        if(b.y + b.height >= a.y && b.y < a.y + a.height)
            hit = true;
    }
    //Colisión de a con b
    if(b.x <= a.x && b.x + b.width >= a.x + a.width)
    {
        if(b.y <= a.y && b.y + b.height >= a.y + a.height)
            hit = true;
    }
    //Colisión b con a
    if(a.x <= b.x && a.x + a.width >= b.x + b.width)
    {
        if(a.y <= b.y && a.y + a.height >= b.y + b.height)
            hit = true;
    }    
    return hit;
}

function draw(ctx,element){ 
    //Recibe el tipo de elemento, y lo dibuja   
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
var barUp = new Bar(1,1,800,1,board);
var barDown = new Bar(1,399,800,1,board);
var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas, board);
var ball = new Ball(350,100,10,board);
var scoreP1 = 0;
var scoreP2 = 0;

document.addEventListener("keydown", function(ev){
    //Añade el EventListener de qué tecla se presiona para generar el movimiento con up() y down()
    if(ev.keyCode == 87){
        ev.preventDefault();
        //movimiento de la barra1 hacia arriba
        bar.up();
    }else if(ev.keyCode == 83){
        ev.preventDefault();
        //movimiento de la barra1 hacia abajo
        bar.down();
    }else if(ev.keyCode == 38){
        ev.preventDefault();
        //movimiento de la barra2 hacia arriba
        bar2.up();
    }else if(ev.keyCode == 40){
        ev.preventDefault();
        //movimiento de la barra2 hacia abajo
        bar2.down();
    }else if(ev.keyCode == 32){
        ev.preventDefault();
        //barra espaciadora
        board.playing = !board.playing;
    }
});

board_view.draw();
window.requestAnimationFrame(controller);

window.addEventListener("load", controller);

function controller(){
    //Llama la función play(), y controla el juego para que se ejecute cada vez que hay un movimiento
    board_view.play();
    window.requestAnimationFrame(controller);
}
