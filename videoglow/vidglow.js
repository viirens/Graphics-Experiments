var video;
var box;
var bigVid;
var colors = {};
var yy;
var threshold = 5;

function setup() {
  createCanvas(200, 200);
  background(0);
  video = createVideo("grignoter.mp4");
  video.size(100, 100);
  box = select("#box");
  bigVid = select("#video");
}

function draw() {
  box.mouseOver(playVis);
  box.mouseOut(stopHide);
  video.loadPixels();
  var col,
    colors = {};

  for (var y = 0; y < 1; y++) {
    for (var x = 0; x < video.width; x++) {
      var index = (x + y * video.width) * 4;
      var r = video.pixels[index];
      var g = video.pixels[index + 1];
      var b = video.pixels[index + 2];

      col = rgbToHex(r, g, b);
      if (!colors[col]) colors[col] = 0;
      colors[col]++;
    }
    yy = colors;
    return yy;
  }
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function getKeysWithHighestValue(o, n) {
  var keys = Object.keys(o);
  keys.sort(function (a, b) {
    return o[b] - o[a];
  });
  return keys.slice(0, n);
}

function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
  return ((r << 16) | (g << 8) | b).toString(16);
}

function playVis() {
  console.log(yy);
  video.play();
  bigVid.play();
}

function stopHide() {
  video.pause();
  bigVid.pause();
}

function getColors(c) {
  var col,
    colors = {};
  var pixels, r, g, b, a;
  r = g = b = a = 0;
  pixels = c.getImageData(0, 0, c.width, c.height);
  for (var i = 0, data = pixels.data; i < data.length; i += 4) {
    r = data[i];
    g = data[i + 1];
    b = data[i + 2];
    a = data[i + 3]; // alpha
    // skip pixels >50% transparent
    if (a < 255 / 2) continue;
    col = rgbToHex(r, g, b);
    if (!colors[col]) colors[col] = 0;
    colors[col]++;
  }
  return colors;
}
