const canvasSketch = require('canvas-sketch');
const p5 = require('p5');


new p5()

let walls = [];

let particle;
let hr;

const settings = {
  pixelsPerInch: 300,
  p5: true,
  duration: 3,
  animate: true,
  dimensions: [1024, 1024],
  bleed: 1 / 8,
};

canvasSketch(() => {



  for (let i = 0; i < 24; i++) {
    let x1 = width/24 + i * width/24 ;
    let x2 = width/24 + i * width/24;
    let y1 =   random(height/3,height);
    let curve = map(i, 0, 24,  0, random(0,height/2));
    let y2 =  height - curve ;
    walls.push(new Boundary(x1, y1, x2, y2));
  
  }


  walls.push(new Boundary(-1, -1, width, -1));
  walls.push(new Boundary(width, -1, width, height));
  walls.push(new Boundary(width, height, -1, height));
  walls.push(new Boundary(-1, height, -1, -1));
   particle = new Particle();
 
  noCursor();
  return ({
    playhead,
    width,
    height
  }) => {
    strokeWeight(2);
    background(0);
  
  for (let wall of walls) {
    wall.show();
  }
 
let sc =second();
let mn =minute();
let hr =hour();


let x = map(hr, 0, 24, 0, width);
let y = map(mn, 0, 60, 0, height);




  particle.update(x, y);
  particle.show();
  particle.look(walls);
  
    fill(0);    
      let seconds = map(sc, 0, 60, 0, x);
      strokeWeight(8);
      line(x, 0, x,height);
      line(0, y, x, y);
      ellipse(seconds,y, 80); 

}
}, settings);

class Particle {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.rays = [];
    for (let a = 0; a < 360; a += 1) {
      this.rays.push(new Ray(this.pos, radians(a)));
    }
  }

  update(x, y) {
    this.pos.set(x, y);
  }

  look(walls) {
    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      let closest = null;
      let record = Infinity;
      for (let wall of walls) {
        const pt = ray.cast(wall);
        if (pt) {
          const d = p5.Vector.dist(this.pos, pt);
          if (d < record) {
            record = d;
            closest = pt;
          }
        }
      }
      if (closest) {
  
        // stroke((i + frameCount * 2) % 360, 255, 255, 50);
        stroke(255);
        line(this.pos.x, this.pos.y, closest.x, closest.y);
      }
    }
  }

  show() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, 4);
    for (let ray of this.rays) {
      ray.show();
    }
  }
}



class Ray {
  constructor(pos, angle) {
    this.pos = pos;
    this.dir = p5.Vector.fromAngle(angle);
  }

  lookAt(x, y) {
    this.dir.x = x - this.pos.x;
    this.dir.y = y - this.pos.y;
    this.dir.normalize();
  }

  show() {
  strokeWeight(2);
    stroke(255);
    push();
    translate(this.pos.x, this.pos.y);
    line(0, 0, this.dir.x * 10, this.dir.y * 10);
    pop();
  }

  cast(wall) {
    const x1 = wall.a.x;
    const y1 = wall.a.y;
    const x2 = wall.b.x;
    const y2 = wall.b.y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den == 0) {
      return;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
    if (t > 0 && t < 1 && u > 0) {
      const pt = createVector();
      pt.x = x1 + t * (x2 - x1);
      pt.y = y1 + t * (y2 - y1);
      return pt;
    } else {
      return;
    }
  }
} 


class Boundary {
  constructor(x1, y1, x2, y2) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
  }

  show() {
    strokeWeight(4)
    stroke(255);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}

