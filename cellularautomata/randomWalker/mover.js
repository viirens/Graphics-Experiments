class Mover {

    
    constructor(x,y) {
        this.pos = createVector(x,y);
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(3));
        
        
       
    }
  
    update() {
        this.acc = p5.Vector.random2D();
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.vel.limit(2);
        

    }

    show() {
        stroke(0,255,0, 100);
        strokeWeight(2);
        fill(0,255,0,100);
        ellipse(this.pos.x, this.pos.y, 1);   
        
    }
}