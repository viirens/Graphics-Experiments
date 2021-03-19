//how to modularly integrate dialogue?
let dialogue = [
  [
    "Novalis: The lighting in a ruin can often be quite flattering.",
    "Novalis: The nice thing about a home in ruin",
    "is that the light can get in.",
    "And how great that, when you’re about to cross the threshold to leave",
    "you know you’ve not forgotten anything behind you.",
    "The lighting in a ruin can often be quite flattering.",
    "The nice thing about a home in ruin",
    "is that the light can get in.",
    "And how great that, when you’re about to cross the threshold to leave,",
    "you know you’ve not forgotten anything behind you.",
  ],
  ["hi..", "this", "should", "work"],
];
let dialogueKey = [];
//index listed will skip line animation
let dialogueCode0 = [[1, 5], []];
let currState = 0;
let isTyping = false;
let page = 0;

// dialogueCode = {2:true, 5:true};
// //dialogue settings, maybe temporary solution 4 anim. behavior
// for (i = 0; i < dialogue[0].length; i++) {
//     if (i = true) dialogueCode = true;
//     else dialogueKey[i] = false;
// }

// console.log(dialogueKey);

function setup() {
  c = createCanvas(windowWidth, windowHeight);
  c.parent("canvasWrapper");
  gravity = createVector(0, 0.03);
  displayDialogBox();
}

function displayDialogBox() {
  domel = createElement("div");
  domel.id("dialogBox");
  domel.parent("diaWrapper");
}

function draw() {
  background(200, 220, 255);
  strokeWeight(0);
  textSize(14);
  text(
    currState + "-" + isTyping + "-" + isBusy,
    20,
    height - 30,
    width / 5,
    100
  );
}

let snow = [];
let gravity;

function particlePush() {
  snow.push(new Snowflake());

  for (flake of snow) {
    flake.applyForce(gravity);
    flake.render();
    flake.update();
  }

  for (let i = snow.length - 1; i >= 0; i--) {
    if (snow[i].offScreen()) {
      snow.splice(i, 1);
    }
  }
}

//test
function addText() {
  document.getElementById("dialogBox").innerHTML += dialogue[frame][currState];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(140, 150, 200);
}

let frame = 0;

function keyPressed() {
  //   if (keyCode === LEFT_ARROW) {
  //     if (currImg > 0) currImg--;
  //     else currImg = 0;

  //cap iterations to length of dialogue array and iterate
  if (keyCode === RIGHT_ARROW && isTyping != true && isBusy != true) {
    if (currState >= dialogue[frame].length) currState = dialogue[frame].length;
    else currState++;
  }
  //change speed if right arrow pressed while typing animation still executing
  if (isTyping == true && keyCode === RIGHT_ARROW) {
    speed = 0;
  }

  //append text to same paragraph (additive text)
  if (
    currState < dialogue[frame].length &&
    keyCode === RIGHT_ARROW &&
    isTyping != true &&
    isBusy != true
  ) {
    txt += dialogue[frame][currState] + " ";
    typeWriter();
    //remove added cursor for animation
    if (currState > 1) {
      let crsr = select("#cursor");
      crsr.remove();
    }
  }

  //this causes hella problems bruh
  if (keyCode === ENTER) {
    // txt = "";
    // document.getElementById("dialogBox").innerHTML = txt;
  }

  return false;
}

let i = 0;
let intlSpd = 40;
let speed = intlSpd;
let txt = "";
let isBusy = false;

//typewriter animation
function typeWriter() {
  let chatWindow = document.getElementById("dialogBox");

  if (i < txt.length) {
    chatWindow.innerHTML = chatWindow.innerHTML.slice(0, -1);
    chatWindow.innerHTML += txt.charAt(i - 1) + "█";
    i++;
    setTimeout(typeWriter, speed, (isTyping = true));
    //get currString len
    let currLength = dialogue[0][currState].length;
    let enterDelay = currLength * 12;
    enterDelay = Math.min(enterDelay, 1500);
    enterDelay = Math.max(enterDelay, 620);

    //skip txt animation mechanic
    //ENTER key simulation
    if (i == txt.length) {
      isTyping = false;
      speed = intlSpd;
      //call cursor blink function only once per "frame"
      if (currState == 1) setInterval(cursorBlink, 420);
      //   make cursor into span object to animate
      let avno = chatWindow.innerHTML;
      let avn = avno.slice(0, -1);
      chatWindow.innerHTML = avn + "<span id=cursor>█</span>";

      //pause before ENTER effect
      if (!dialogueCode0[frame].includes(currState)) {
        isBusy = true;

        setTimeout(() => {
          chatWindow.innerHTML += "<span class=br></span>";
          let avno = chatWindow.innerHTML;
          let avn = avno.slice(0, -70) + avno.slice(-24);
          chatWindow.innerHTML = avn + "<span id=cursor>█</span>";
          isBusy = false;
          //keep chatWindow at bottom while reading
          chatWindow.scrollTo(0, chatWindow.scrollHeight);
        }, enterDelay);
      }
    }
  }
  chatWindow.scrollTo(0, chatWindow.scrollHeight);
}

let cursor2 = true;
function cursorBlink() {
  if (isTyping != true) {
    if (cursor2) {
      document.getElementById("cursor").style.opacity = 0;
      cursor2 = false;
    } else {
      document.getElementById("cursor").style.opacity = 1;
      cursor2 = true;
    }
  }
}

//--dialogSys--
/*Display first line of text on start. 
when "proceed" button clicked, clear string and display new one. 
if string still in process of being typed, jump to end of function. 
if "back" button pushed, return to previous string*/

// class dialogSys {
//   constructor(dialog) {
//       this.dialog = dialog;
//   }
// }
