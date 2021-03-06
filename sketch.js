let box = [];
let img;
let cnv;
let clearCanvas = false;
let maxBears = 10;
let flashTime = null;
let imgScale = 0.8;
let bearSpeed = null;
function preload() {
  img = loadImage("bears.png");
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  frameRate(60);

  let props = window.getComputedStyle(cnv.elt, null);

  imgScale = props.getPropertyValue("--bearResize");
  maxBears = props.getPropertyValue("--maxBears");
  flashTime = props.getPropertyValue("--flashTime");
  bearSpeed = props.getPropertyValue("--bearMaxSpeed");
  props.getPropertyValue("--trails") == 0 ? (clearCanvas = true) : (clearCanvas = false);

  img.resize(img.width * imgScale, img.height * imgScale);

  // add the one true maggs
  box.push(new Box(random(width / 3, width / 4), random(height / 3, height / 4), img));
}

function draw() {
  colorMode(RGB);
  if (clearCanvas) {
    clear();
  } else {
    background(0, 0, 0, 0);
  }

  for (let b of box) {
    b.update();
    b.show();
  }
}

function spawnAtLocation(location) {
  if (box.length + 1 > maxBears) {
    return;
    box.splice(0, 1);
  }

  let x = location.x || random(width / 3, width / 4);
  let y = location.y || random(height / 3, height / 4);
  let newBox = new Box(x, y, img);
  newBox.detecting = false;
  newBox.flashing = true;
  newBox.flashCounter = 10;
  newBox.vel.x += random(-1, 1);
  newBox.vel.y += random(-1, 1);
  box.unshift(newBox);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  box = [];

  box.push(new Box(random(width / 3, width / 4), random(height / 3, height / 4), img));
}
