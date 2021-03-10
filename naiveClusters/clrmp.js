var clr;
var winner;
var loopNum;
var data = [];
var kvals = [];
var inLoc = [];
var k = 40;
var threshold = 2;
var lvr = true;

/* this implementation is badly thought out for a few reasons,
outside of the fact that it doesn't fit the funciton I designed
it for to begin with: the k value of random seeds is so close to the
size of the sampled (downsized) img/video as to not even justify
using random seeds, should just be calculating distance based on each
iterated pixel. This would be fine if it were intended to be scalable,
but I ended up having to hardcode in the index values of the pixel strands
to be iterated in the end anyway. Also I'm pretty sure that even if I wanted
to only iterate edge pixels, there's probably a better way to do so than 
4 seperate loops. Plus, going forward with this would require
some kind of LERP function to smooth jumps between colors.
Its also just generally sloppy. Anyways ya. Naive cluster solution
to video glow project is a failure.  */

function preload() {
  clr = loadImage("clrtest.jpg");
}

function setup() {
  image(clr, 0, 400);
  c = createCanvas(200, 200);
  c.position(0, 0);
  pixelDensity(1);
  clr.resize(50, 50);
}

function scan() {
  loadPixels();
  clr.loadPixels();

  for (var y = 0; y < 1; y++) {
    lvr = true;
    for (var x = 0; x < clr.width; x++) {
      var index = (x + y * clr.width) * 4;
      var r = clr.pixels[index];
      var g = clr.pixels[index + 1];
      var b = clr.pixels[index + 2];

      loopNum = 1;
      inLoc = [0, 200];
      topRow = naiveClusters(r, g, b, inLoc, threshold, loopNum);
    }
  }
  for (var x = 0; x < 1; x++) {
    lvr = true;
    for (var y = 0; y < clr.height; y++) {
      var index = (x + y * clr.width) * 4;
      var r = clr.pixels[index];
      var g = clr.pixels[index + 1];
      var b = clr.pixels[index + 2];

      loopNum = 2;
      inLoc = [0, 9800];
      leftCol = naiveClusters(r, g, b, inLoc, threshold, loopNum);
    }
  }
  for (var x = clr.width - 1; x < clr.width; x++) {
    lvr = true;
    for (var y = 0; y < clr.height; y++) {
      var index = (x + y * clr.width) * 4;
      var r = clr.pixels[index];
      var g = clr.pixels[index + 1];
      var b = clr.pixels[index + 2];

      loopNum = 3;
      inLoc = [196, 9996];
      rightCol = naiveClusters(r, g, b, inLoc, threshold, loopNum);
    }
  }
  for (var y = clr.height - 1; y < clr.height; y++) {
    lvr = true;
    for (var x = 0; x < clr.width; x++) {
      var index = (x + y * clr.width) * 4;
      var r = clr.pixels[index];
      var g = clr.pixels[index + 1];
      var b = clr.pixels[index + 2];

      loopNum = 4;
      inLoc = [9800, 9996];
      botRow = naiveClusters(r, g, b, inLoc, threshold, loopNum);
    }
  }
}

function naiveClusters(r, g, b, inLoc, threshold, loopNum) {
  //for given #k as random seed values, finds which has highest numbers of values beneath threshold value

  //Index Generator:randomly generate index values associated with pixel subarray for seed sample
  var inGen = [];
  //only allow seed assignment on first run of loop
  if (lvr == true) {
    for (n = 0; n < k; n++) {
      // inGen[n] = floor(random(0, 192 / 4));
      // pass index to ingen, only randomly generate in that range
      if (loopNum == 1 || loopNum == 4) {
        let x = random(inLoc[0], inLoc[1]);
        inGen = x - (x % 4);
      } else if (loopNum == 2) {
        let x = random(inLoc[0], inLoc[1]);
        inGen = x - (x % 200);
      } else if (loopNum == 3) {
        let x = random(100, 9900);
        inGen = x - (x % 200) + 196;
      }

      //assign seed color found at (adjstd) random index
      var r2 = clr.pixels[inGen];
      var g2 = clr.pixels[inGen + 1];
      var b2 = clr.pixels[inGen + 2];
      kvals[n] = [r2, g2, b2, 0];

      if (lvr == true && n == k - 1) {
        lvr = false;
      }
    }
  }

  for (let i = 0; i < k; i++) {
    //calculate proximities
    // # of colors found within threshold assigned to kvals[n][3]
    if (distance(r, g, b, kvals[i][0], kvals[i][1], kvals[i][2]) < threshold) {
      kvals[i][3] += 1;
    }
  }

  //for each pixel calculate distance, if less than threshold increase value of seed
  var leader = 0;

  for (let i = 0; i < k; i++) {
    if (kvals[i][3] > leader) {
      leader = kvals[i][3];
      winner = kvals[i];
    }
  }
  return winner;
}

function draw() {
  scan();
  background(rightCol[0], rightCol[1], rightCol[2]);
  fill(topRow[0], topRow[1], topRow[2]);
  rect(0, 0, width, 50);
  fill(leftCol[0], leftCol[1], leftCol[2]);
  rect(0, 50, width / 2, 100);
  fill(botRow[0], botRow[1], botRow[2]);
  rect(0, height - 50, width, 50);
}

function distance(r1, g1, b1, r2, g2, b2) {
  d = sqrt(
    ((r2 - r1) * 0.3) ** 2 + ((g2 - g1) * 0.59) ** 2 + ((b2 - b1) * 0.11) ** 2
  );

  return Math.round(d);
}
