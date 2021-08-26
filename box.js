class Box {
  constructor(x, y, img) {
    this.pos = createVector(x, y);
    this.img = img;
    this.size = createVector(this.img.width, this.img.height);
    this.hitCount = 0;
    this.maxSpeed = 4;
    this.minMaxOffset = 0.3;
    this.randJitter = 1;
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
    this.corner = [false, false, false, false]; // LU, RU, LD, RD
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
    let hitL = this.pos.x - this.size.x < 0 - this.size.x;
    let hitR = this.pos.x + this.size.x > width;
    let hitU = this.pos.y - this.size.y < 0 - this.size.y;
    let hitD = this.pos.y + this.size.y > height;

    // check X bounds
    if (hitL || hitR) {
      this.vel.x *= -1;
      this.vel.x += random(-this.randJitter, this.randJitter);
      this.pos.x = this.pos.x <= 0 + this.size.x ? 1 : width - this.size.x - 1;
    }

    // check Y bounds
    if (hitU || hitD) {
      this.vel.y *= -1;
      this.vel.y += random(-this.randJitter, this.randJitter);
      this.pos.y = this.pos.y - this.size.y < 0 ? 1 : height - this.size.y - 1;
    }

    // we hit a corner! special surprise :)
    if (this.detecting && ((hitL && hitU) || (hitL && hitD) || (hitR && hitU) || (hitR && hitD))) {
      this.hitCount++;
      this.flashing = true;
      this.detecting = false;

      this.corner[0] = hitL && hitU;
      this.corner[1] = hitR && hitU;
      this.corner[2] = hitL && hitD;
      this.corner[3] = hitR && hitD;

      if (this.corner[0]) {
        spawnAtLocation(createVector(1, 1));
      }
      if (this.corner[1]) {
        spawnAtLocation(createVector(width - 1, 1));
      }
      if (this.corner[2]) {
        spawnAtLocation(createVector(1, height - 1));
      }
      if (this.corner[3]) {
        spawnAtLocation(createVector(width - 1, height - 1));
      }
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

      this.corner = [false, false, false, false];
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
