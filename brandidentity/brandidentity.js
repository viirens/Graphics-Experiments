var video;
var vScale = 12;
var imgs = [];
var place;

//thinking about switching mcdonalds and walmart
function setup() {
    imgs = [['imgs/1.jpg',255,255,255],['imgs/2.jpg',214,77,70],['imgs/16.jpg',253,235,112],
    ['imgs/18.jpg',253,253,81],['imgs/20.jpg',12,110,67],['imgs/25.jpg',251,13,27],
    ['imgs/27.jpg',0,0,0],['imgs/28.jpg',20,20,20],['imgs/29.jpg',217,25,48],
    ['imgs/30.jpg',253,187,47],['imgs/31.jpg',164,202,57],['imgs/32.jpg',186,56,51]
    ];

    for (let i=0;i < imgs.length; i++) {
        imgs[i] = new Logo(imgs[i][0],imgs[i][1],imgs[i][2],imgs[i][3]);
    }

    c = createCanvas(852, 480);
    c.position((windowWidth-c.width)/2,(windowHeight-c.height)/2);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.size(width/vScale, height/vScale);
    video.hide();
}

function distance(r1,g1,b1,bright1,r2,g2,b2,bright2) {
    d = ((r2-r1)*0.30)**2 + ((g2-g1)*0.59)**2 + ((b2-b1)*0.11)**2 + ((bright2-bright1)*.50)**2;
    return Math.round(d);
}

function draw() {
    background(255);
    video.loadPixels();

    for (var y = 0; y < video.height;y++) {
        for (var x = 0; x < video.width; x++){
           var index = (video.width - x - 1 + (y * video.width)) * 4;
           var r = video.pixels[index];
           var g = video.pixels[index+1];
           var b = video.pixels[index+2];
           var bright = (r+g+b)/3;
           let least = 9999999;
         
           for (var i = 0; i < imgs.length; i++) {
              if (distance(imgs[i].r,imgs[i].g,imgs[i].b,imgs[i].bright,r,g,b,bright) < least) {
                least = distance(imgs[i].r,imgs[i].g,imgs[i].b,imgs[i].bright,r,g,b,bright);
                place = imgs[i].img;
              }
            }   
         image(place,x*vScale,y*vScale,vScale,vScale); 
        }
    }
}

class Logo {
        constructor(imgpath,r,g,b) {
           this.img = loadImage(imgpath);
           this.r = r;
           this.g = g;
           this.b = b;
           this.bright =  (this.r+this.g+this.b)/3; 
        }   
}

function windowResized() {

    c.position((windowWidth-c.width)/2,(windowHeight-c.height)/2);
}

//color block replacement
// if (r-g < gs && b - g < gs) {
//     set = imgs[0];
// }
// if (r > g && r > b) {
//     set = imgs[1];
// }

// else if (g > r && g > b) {
//     set = imgs[3];
// }
// else if (b > g && b > r) {   
//     set = imgs[2];
// }

// else if (r == g && b == g && bright > threshold) {
//     set = imgs[0];
// }



//brightness scale
// if (bright <= 63) {
//     set = imgs[0];
// }
// else if (bright > 63 && bright <= 126) {
//     set = imgs[1];
// }

// else if (bright > 126 && bright <= 189) {
//     set = imgs[3];
// }
// else if (bright > 189 && bright <= 255) {   
//     set = imgs[2];
// }

// else {
//     set = imgs[0];
// }