var video;
var vScale = 9;
var imgs = [];
var place;
var x;
var y;
var z = false;
var tran;
var threshold = 35;
let winner;

function setup() {
  imgs = [
    ["imgs/1.jpg", 255, 255, 255],
    ["imgs/2.jpg", 214, 77, 70],
    ["imgs/20.jpg", 12, 110, 67],
    ["imgs/25.jpg", 251, 13, 27],
    ["imgs/27.jpg", 0, 0, 0],
    ["imgs/28.jpg", 5, 5, 5],
    ["imgs/29.jpg", 217, 25, 48],
    ["imgs/30.jpg", 253, 187, 47],
    ["imgs/31.jpg", 164, 202, 57],
    ["imgs/32.jpg", 186, 56, 51],
    ["imgs/37.jpg", 229, 228, 210],
    ["imgs/38.jpg", 17, 168, 114],
  ];

  for (let i = 0; i < imgs.length; i++) {
    imgs[i] = new Logo(imgs[i][0], imgs[i][1], imgs[i][2], imgs[i][3]);
  }

  // get stream resolution
  var video = document.createElement("video");
  navigator.mediaDevices
    .getUserMedia({
      video: true,
    })
    .then((stream) => {
      video.srcObject = stream;
      video.onloadedmetadata = function () {
        if (windowWidth < this.videoWidth) {
          respwidth = windowWidth;
          respheight = this.videoHeight - (this.videoWidth - windowWidth);
        } else {
          respwidth = this.videoWidth;
          respheight = this.videoHeight;
        }

        c = createCanvas(respwidth, respheight);
        c.position((windowWidth - c.width) / 2, (windowHeight - c.height) / 2);
        c.parent("canvasWrapper");
      };
    });
}

function distance(r1, g1, b1, bright1, r2, g2, b2, bright2) {
  d = sqrt(
    ((r2 - r1) * 0.3) ** 2 +
      ((g2 - g1) * 0.59) ** 2 +
      ((b2 - b1) * 0.11) ** 2 +
      ((bright2 - bright1) * 0.75) ** 2
  );
  return Math.round(d);
}

function draw() {
  x = width;
  y = height;

  background(255);

  if (x > 100 && z == false) {
    video = createCapture(VIDEO);
    video.size(x / vScale, y / vScale);
    video.hide();
    z = true;
  }

  // translate according to even or odd resolution
  if (x % 2 == 0) {
    tran = 2;
  } else {
    tran = 3;
  }
  translate(tran, tran);

  if (x > 100 && z == true) {
    video.loadPixels();

    for (var y = 0; y < video.height; y++) {
      for (var x = 0; x < video.width; x++) {
        var index = (video.width - x - 1 + y * video.width) * 4;
        var r = video.pixels[index];
        var g = video.pixels[index + 1];
        var b = video.pixels[index + 2];
        var bright = (r + g + b) / 3;

        for (var i = 0; i < imgs.length; i++) {
          naiveClusters(r, g, b, bright, threshold, i);
          place = winner;
        }

        image(place, x * vScale, y * vScale, vScale, vScale);

        for (let i = 0; i < imgs.length; i++) {
          imgs[i].points = 0;
        }
      }
    }
  }
}

class Logo {
  constructor(imgpath, r, g, b) {
    this.img = loadImage(imgpath);
    this.r = r;
    this.g = g;
    this.b = b;
    this.bright = (this.r + this.g + this.b) / 3;
    this.points = 0;
  }
}

function windowResized() {
  c.position((windowWidth - c.width) / 2, (windowHeight - c.height) / 2);
}

function naiveClusters(r, g, b, bright, threshold, i) {
  //calculate proximities

  if (
    distance(r, g, b, bright, imgs[i].r, imgs[i].g, imgs[i].b, imgs[i].bright) <
    threshold
  ) {
    imgs[i].points += 1;
  }

  var leader = 0;

  for (let i = 0; i < imgs.length; i++) {
    if (imgs[i].points > leader) {
      leader = imgs[i].points;
      winner = imgs[i].img;
    }
  }
  return winner;
}
