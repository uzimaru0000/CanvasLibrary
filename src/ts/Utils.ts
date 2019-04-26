class Random {
  static range(min: number, max: number, flag: boolean = false) {
    var r = (max - min) * Math.random() + min;
    return flag ? Math.floor(r) : r;
  }
  static get vector() {
    var x = Random.range(-1, 1);
    var y = Random.range(-1, 1);
    return new Vector(x, y).normalized;
  }
}

export class Color {
  constructor(
    readonly red: number = 0,
    readonly green: number = 0,
    readonly blue: number = 0,
    readonly alpha: number = 1
  ) {}

  toString(): string {
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
  }

  static random(a: number = 1): Color {
    return new Color(
      Random.range(0, 255, true),
      Random.range(0, 255, true),
      Random.range(0, 255, true),
      a
    );
  }
}

export class Vector {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}

  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  get normalized(): Vector {
    const n = new Vector(this.x, this.y, this.z);
    return this.length !== 0 ? n.div(this.length) : n;
  }

  add(v: Vector) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  sub(v: Vector) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }
  mul(s: number) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }
  div(s: number) {
    if (s === 0) throw new Error("Don't divide to zero");
    this.x /= s;
    this.y /= s;
    this.z /= s;
    return this;
  }

  dot(v: Vector) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vector) {
    return this.x * v.y - this.y * v.x;
  }

  static get up() {
    return new Vector(0, 1, 0);
  }
  static get down() {
    return new Vector(0, -1, 0);
  }
  static get left() {
    return new Vector(-1, 0, 0);
  }
  static get right() {
    return new Vector(1, 0, 0);
  }
  static get forward() {
    return new Vector(0, 0, 1);
  }
  static get back() {
    return new Vector(0, 0, -1);
  }
  static get one() {
    return new Vector(1, 1, 1);
  }
  static get zero() {
    return new Vector();
  }
}

class Texture {
  private image: HTMLImageElement;

  constructor(path: string, w: number, h: number) {
    this.image = new Image(w, h);
    this.image.src = path;
    this.image.onload = () => this.image.setAttribute("loaded", "true");
  }

  get loaded() {
    return this.image.getAttribute("loaded");
  }
}
