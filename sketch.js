let box = [];
let img;
let maxBoxes = 10;
let imgScale = 0.8;
function preload() {
  img = loadImage("bears.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  frameRate(60);

  img.resize(img.width * imgScale, img.height * imgScale);

  // add the one true maggs
  box.push(new Box(random(width / 3, width / 4), random(height / 3, height / 4), img));
}

function draw() {
  colorMode(RGB);
  //clear();
  background(0, 0, 0, 0);

  for (let b of box) {
    b.update();
    b.show();
  }
}

function spawnAtLocation(location) {
  if (box.length + 1 > maxBoxes) {
    box.splice(0, 1);
  }

  let x = location.x || random(width / 3, width / 4);
  let y = location.y || random(height / 3, height / 4);
  let newBox = new Box(x, y, img);
  newBox.detecting = false;
  newBox.flashing = true;
  newBox.counter = 10;
  newBox.vel.x += random(-1, 1);
  newBox.vel.y += random(-1, 1);
  box.unshift(newBox);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  box = [];

  box.push(new Box(random(width / 3, width / 4), random(height / 3, height / 4), img));
}
