var inc = 0.003;
var start = 0;

function setup() {
    createCanvas(900, 800);
}

function draw() {
    
    background(0);
    stroke(255);
    noFill();
    beginShape();
    var xoff = start;
    for (var x = 0; x < width; x++) {
        stroke(255);
        var y = noise(xoff) * height;
     
        vertex(x, y);

        xoff += inc;
        
    }
    endShape();
    start += inc;





}