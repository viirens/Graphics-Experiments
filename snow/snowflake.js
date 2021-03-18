function getRandomSize() {
  let r = randomGaussian() * 2;
  return constrain(abs(r * r), 2, 36);
}

class Snowflake {
  constructor() {
    let x = random(width);
    let y = random(-100, -10);
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);

    if (this.vel.mag() < 1) {
      this.vel.normalize();
    }
    this.acc = createVector();
    this.r = getRandomSize();
  }

  applyForce(force) {
    //Parallax
    let f = force.copy();
    f.mult(this.r);
    this.acc.add(f);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.r * 0.2);

    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  render() {
    stroke(0);
    strokeWeight(this.r);
    point(this.pos.x, this.pos.y);
  }

  offScreen() {
    return this.pos.y > height + this.r;
  }
}
