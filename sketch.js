let box;
let img;

function preload() {
  img = loadImage("bears.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  frameRate(60);

  // add the one true maggs
  box = new Box(width / 2, height / 2, img);
}

function draw() {
  colorMode(RGB);
  //clear();
  background(0, 0, 0, 0);

  box.update();
  box.show();
}
