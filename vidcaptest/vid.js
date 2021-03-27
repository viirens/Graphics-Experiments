var x;
var c;
let contrast = 150;
let state = 0;
let prevPix = [[]];
let flicker = [[]];
let nuNum = 0;
let lvr2 = true;

vScale = 30;
z = false;

function preload() {
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
      };
    });
  pixelDensity(1);
}

function draw() {
  state++;
  if (state > 150) state = 0;
  if (nuNum > 1000 && nuNum < 1100) {
    flicker = [[]];
    console.log(flicker);
  }
  if (nuNum > 15000) nuNum = 0;

  background(0);
  x = width;
  y = height;
  if (x > 100 && z == false) {
    video = createCapture(VIDEO);
    video.size(x / vScale, y / vScale);
    z = true;
  }
  if (x > 100 && z == true) {
    video.loadPixels();
    loadPixels();
    let loopState = 0;
    let white;
    for (var y = 0; y < video.height; y++) {
      for (var x = 0; x < video.width; x++) {
        var index = (video.width - x - 1 + y * video.width) * 4;
        var r = video.pixels[index];
        var g = video.pixels[index + 1];
        var b = video.pixels[index + 2];
        var bright = (r + g + b) / 3;
        contrastVal(contrast, r, g, b);
        let threshold = 127;
        stroke(100, 200, 200);
        if (bright > threshold) {
          fill(255);
          white = true;
        } else {
          fill(0);
          white = false;
        }
        if (x == 0 && y == 7) fill(255, 100, 200);
        else if (x == 10 && y == 0) fill(255, 100, 200);
        else if (x == 0 && y == 8) fill(255, 100, 200);
        // fill(newR, newG, newB);
        if (state % 4 == 0) {
          prevPix[loopState] = white;
        } else if (state % 4 != 0) {
          if (prevPix[loopState] != white) {
            for (i = 0; i < flicker.length; i++) {
              if (flicker[i][0] == x && flicker[i][1] == y) {
                flicker[i][2]++;
              }
            }
          }
          if (prevPix[loopState] != white && lvr2 == true) {
            flicker.push([x, y, 0]);
            console.log("hi");
          }
        }
        //set problem pixels in second array, iterate them based on frequency then only
        //return those those over some threshold
        // if (loopState == 3) {
        //   console.log(white);
        // }
        rect(x * vScale, y * vScale, vScale, vScale);
        loopState++;
        nuNum++;
      }
    }
  }
}

function contrastVal(contrast, r, g, b) {
  let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  newR = clamp(factor * (r - 128) + 128);
  newG = clamp(factor * (g - 128) + 128);
  newB = clamp(factor * (b - 128) + 128);

  return newR, newG, newB;
}

function clamp(val) {
  newVal = Math.max(0, Math.min(val, 255));
  return newVal;
}

// function streamData() {
//     // get stream resolution
//   var video = document.createElement('video')
//   navigator.mediaDevices.getUserMedia({
//       video: true
//   }).then((stream) => {
//       video.srcObject = stream;
//       video.play()
//       video.onloadedmetadata = function() {
//           return [this.videoWidth, this.videoHeight];
//       };
//   })
// }
