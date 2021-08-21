class Box {
  constructor(x, y, img) {
    this.pos = createVector(x, y);
    this.img = img;
    this.size = createVector(this.img.width, this.img.height);
    this.hitCount = 0;
    this.maxSpeed = 4;
    this.minSpeed = -4;
    this.tint = 127;
    this.counter = 6000;
    this.blinkCounter = 45000;
    // starting direction should be random
    this.vel = createVector(
      random(1) >= 0.5
        ? random(this.minSpeed * -1, this.maxSpeed) + random(-0.01, 0.01)
        : -random(this.minSpeed * -1, this.maxSpeed) + random(-0.01, 0.01),
      random(1) >= 0.5
        ? random(this.minSpeed * -1, this.maxSpeed) + random(-0.01, 0.01)
        : -random(this.minSpeed * -1, this.maxSpeed) + random(-0.01, 0.01)
    );
    this.flashing = false;
    this.detecting = true;
  }

  move() {
    // if x negative, make sure its not too slow or fast
    if (this.vel.x < 0) {
      if (this.vel.x < this.minSpeed - 0.5) {
        this.vel.x = this.minSpeed;
      }
      if (this.vel.x > this.minSpeed + 1.5) {
        this.vel.x = this.minSpeed + 1;
      }
    }

    // if x positive, make sure its not too slow or fast
    if (this.vel.x > 0) {
      if (this.vel.x > this.maxSpeed + 0.5) {
        this.vel.x = this.maxSpeed;
      }
      if (this.vel.x < this.maxSpeed - 1.5) {
        this.vel.x = this.maxSpeed - 1;
      }
    }

    // if y negative, make sure its not too slow or fast
    if (this.vel.y < 0) {
      if (this.vel.y < this.minSpeed - 0.5) {
        this.vel.y = this.minSpeed;
      }
      if (this.vel.y > this.minSpeed + 1.5) {
        this.vel.y = this.minSpeed + 1;
      }
    }

    // if y positive, make sure its not too slow or fast
    if (this.vel.y > 0) {
      if (this.vel.y > this.maxSpeed + 0.5) {
        this.vel.y = this.maxSpeed;
      }
      if (this.vel.y < this.maxSpeed - 1.5) {
        this.vel.y = this.maxSpeed - 1;
      }
    }

    // do the move
    this.pos = p5.Vector.add(this.pos, this.vel);
  }

  hit() {
    var hitLR = false;
    var hitUD = false;

    // check X bounds
    if (
      this.pos.x - this.size.x < 0 - this.size.x ||
      this.pos.x + this.size.x > width
    ) {
      this.vel.x *= -1;
      this.vel.x += random(-0.1, 0.1);
      this.pos.x = this.pos.x <= 0 + this.size.x ? 1 : width - this.size.x - 1;
      hitLR = true;
    }

    // check Y bounds
    if (
      this.pos.y - this.size.y < 0 - this.size.y ||
      this.pos.y + this.size.y > height
    ) {
      this.vel.y *= -1;
      this.vel.y += random(-0.1, 0.1);
      this.pos.y = this.pos.y - this.size.y < 0 ? 1 : height - this.size.y - 1;
      hitUD = true;
    }

    // we hit the corner! special surprise :)
    if (hitLR && hitUD && this.detecting) {
      this.hitCount++;
      this.flashing = true;
      this.detecting = false;
    }
  }

  blink() {
    // reset the gif counter if its complete
    if (this.blinkCounter <= 0) {
      this.img.reset();
      this.blinkCounter = 45000;
      print("blinking");
    }

    this.blinkCounter -= 60;
  }

  update() {
    this.hit();
    this.move();
    //this.blink();

    // flash counter is up
    if (this.counter <= 0) {
      this.counter = 6000;
      this.flashing = false;
      this.detecting = true;
    }
  }

  show() {
    // flashing reward for corner hit!
    if (this.flashing) {
      colorMode(HSB);
      tint(this.tint, 200, 255);
      this.tint = this.tint <= 1 ? (this.tint = 255) : (this.tint -= 10);
      this.counter -= 60;
    }
    // flashing is done
    else {
      noTint();
    }

    // draw the maggles
    image(this.img, this.pos.x, this.pos.y, this.size.x, this.size.y);

    // draw the counter so we know how many happened
    if (this.hitCount > 0) {
      textSize(32);
      fill(255);
      strokeWeight(4);
      stroke(0);
      text(this.hitCount, this.pos.x + 10, this.pos.y + 48);
    }
  }
}
