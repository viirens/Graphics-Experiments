let mover;

function setup() {
    createCanvas(800, 800);
    mover = new Mover(310, 275);
    background(0);
    
}


function draw() {
 
    
    mover.update();
    mover.show();  
   

}









