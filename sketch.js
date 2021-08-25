let box;
let img;

function preload() {
  img = loadImage("bears.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  frameRate(60);

  img.resize(img.width * 0.8, img.height * 0.8);

  // add the one true maggs
  box = new Box(width / 2, height / 2, img);
}

function draw() {
  colorMode(RGB);
  //clear();
  background(0, 0, 0, 1);

  box.update();
  box.show();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  box = new Box(width / 2, height / 2, img);
}
