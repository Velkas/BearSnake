class Box {
  constructor(x, y, img) {
    this.pos = createVector(x, y);
    this.img = img;
    this.size = createVector(this.img.width, this.img.height);
    this.hitCount = 0;
    this.maxSpeed = 4;
    this.minMaxOffset = 0.2;
    this.bounceOffsetRange = 2;
    this.tint = 127;
    this.counter = 8000;
    this.blinkCounter = 45000;
    // starting direction should be random
    this.vel = createVector(
      random(1) >= 0.5
        ? random(-this.maxSpeed * -1, this.maxSpeed) + random(-0.01, 0.01)
        : -random(-this.maxSpeed * -1, this.maxSpeed) + random(-0.01, 0.01),
      random(1) >= 0.5
        ? random(-this.maxSpeed * -1, this.maxSpeed) + random(-0.01, 0.01)
        : -random(-this.maxSpeed * -1, this.maxSpeed) + random(-0.01, 0.01)
    );
    this.flashing = false;
    this.detecting = true;
    this.reverseImage;
  }

  move() {
    // clamp the values in a donut shape so its never too slow or too fast
    if (this.vel.x >= 0) {
      this.vel.x = this.clamp(
        this.vel.x,
        this.maxSpeed - this.maxSpeed * this.minMaxOffset,
        this.maxSpeed + this.maxSpeed * this.minMaxOffset
      );
    } else {
      this.vel.x = this.clamp(
        Math.abs(this.vel.x),
        this.maxSpeed - this.maxSpeed * this.minMaxOffset,
        this.maxSpeed + this.maxSpeed * this.minMaxOffset
      );
      this.vel.x *= -1;
    }

    if (this.vel.y >= 0) {
      this.vel.y = this.clamp(
        this.vel.y,
        this.maxSpeed - this.maxSpeed * this.minMaxOffset,
        this.maxSpeed + this.maxSpeed * this.minMaxOffset
      );
    } else {
      this.vel.y = this.clamp(
        Math.abs(this.vel.y),
        this.maxSpeed - this.maxSpeed * this.minMaxOffset,
        this.maxSpeed + this.maxSpeed * this.minMaxOffset
      );
      this.vel.y *= -1;
    }

    // do the move
    this.pos = p5.Vector.add(this.pos, this.vel);
  }

  hit() {
    var hitLR = false;
    var hitUD = false;

    // check X bounds
    if (this.pos.x - this.size.x < 0 - this.size.x || this.pos.x + this.size.x > width) {
      this.vel.x *= -1;
      this.vel.x += random(-this.bounceOffsetRange, this.bounceOffsetRange);
      this.pos.x = this.pos.x <= 0 + this.size.x ? 1 : width - this.size.x - 1;
      hitLR = true;
    }

    // check Y bounds
    if (this.pos.y - this.size.y < 0 - this.size.y || this.pos.y + this.size.y > height) {
      this.vel.y *= -1;
      this.vel.y += random(-this.bounceOffsetRange, this.bounceOffsetRange);
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

  update() {
    this.reverseImage = this.vel.x < 0;
    this.hit();
    this.move();

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

    push();
    imageMode(CENTER);
    translate(this.pos.x + this.img.width / 2, this.pos.y + this.img.height / 2);
    scale(this.reverseImage ? -1 : 1, 1);
    image(this.img, 0, 0, this.size.x, this.size.y);
    pop();
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
}
