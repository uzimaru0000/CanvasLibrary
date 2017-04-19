'use strict'

class EventTarget {
    constructor() {
        this.__event = {};
    }

    addEventListener(target, func) {
        if (this.__event[target] === undefined) this.__event[target] = [];
        this.__event[target].push(func);
    }

    removeEventListener(target, func) {
        if (this.__event[target] === undefined) return;
        this.__event[target].some((x, index) => {
            if (x === func) this.__event[target].splice(index, 1);
        });
    }

    dispatchEvent(target, e) {
        if (this.__event[target] === undefined) return;
        this.__event[target].forEach(x => x.call(this, e));
    }
}

class Display extends EventTarget {
    constructor(id) {
        super();
        this._canvas = document.getElementById(id);
        this._context = this._canvas.getContext('2d');

        this._fps = 30;
        this.frameCount = 0;
        this._child = [];
        this._textures = {};
        this.clearColor = '#fff';

        this.__mainLoop = setInterval(this.__draw.bind(this), 1000 / this._fps);

        document.addEventListener('keydown', e => {
            this.dispatchEvent('keydown', e);
            this.dispatchEvent(e.key + '-down', e);
            this._child.forEach(x => {
                x.dispatchEvent('keydown', e);
                x.dispatchEvent(e.key + '-down', e);
            });
        });
        document.addEventListener('keyup', e => {
            this.dispatchEvent('keyup', e);
            this.dispatchEvent(e.key + '-up', e);
            this._child.forEach(x => {
                x.dispatchEvent('keyup', e);
                x.dispatchEvent(e.key + '-up', e);
            });
        });
        document.addEventListener('keypress', e => {
            this.dispatchEvent('keypress', e);
            this.dispatchEvent(e.key + '-press', e);
            this._child.forEach(x => {
                x.dispatchEvent('keypress', e);
                x.dispatchEvent(e.key + '-press', e);
            });
        });
    }

    get width() {
        return this._canvas.width;
    }
    get height() {
        return this._canvas.height;
    }

    get fps() {
        return this._fps;
    }
    set fps(value) {
        clearInterval(this.__mainLoop);
        this._fps = value;
        this.__mainLoop = setInterval(this.__draw.bind(this), 1000 / this._fps);
    }

    __draw() {
        if (!Object.values(this._textures).every(x => x.image.getAttribute('loaded'))) return;
        if (this.frameCount === 0) this.dispatchEvent('init');
        this._context.fillStyle = this.clearColor;
        this._context.fillRect(0, 0, this.width, this.height);
        this.dispatchEvent('update', this.frameCount);
        this._child.forEach(x => x.__draw(this));
        this.frameCount++;
    }

    addChild(child) {
        if (child instanceof Node) {
            this._child.push(child);
            child.parent = this;
        }
    }
    removeChild(child) {
        var i = this._child.indexOf(child);
        this._child.splice(i, 1);
        child.parent = null;
    }

    preload(paths) {
        let c = 0;
        paths.forEach(x => {
            this._textures[x] = new Texture(x);
            this._textures[x].image.onload = e => this._textures[x].image.setAttribute('loaded', 'true');
        });
    }

    getTexture(path) {
        return this._textures[path];
    }
}

class Node extends EventTarget {
    constructor() {
        super();
        this.pos = new Vector();
        this.rotation = 0;
        this.scale = new Vector(1, 1);
        this._child = [];
        this.parent;
    }

    __draw(display) {
        this.dispatchEvent('update', display.frameCount);
    }

    addChild(child) {
        if (child instanceof Node) {
            this._child.push(child);
            child.parent = this;
        }
    }

    removeChild(child) {
        this._child.some((x, index) => {
            if (x === child) {
                this._child.splice(index, 1);
            } 
        });
        child.parent = null;
    }

    rotate(deg) {
        this.rotation += deg * Math.PI / 180;
    }

    dispatchEvent(target, e) {
        super.dispatchEvent(target, e);
        this._child.forEach(x => x.dispatchEvent(target, e));
    }
}

class Group extends Node {
    constructor(w, h) {
        super();
    }

    __draw(display) {
        super.__draw(display);
        display._context.save();
        display._context.translate(this.pos.x, this.pos.y);
        display._context.rotate(this.rotation);
        display._context.scale(this.scale.x, this.scale.y);
        this._child.forEach(x => x.__draw(display));
        display._context.setTransform(1, 0, 1, 0, 0, 0);
        display._context.restore();
    }
}

class Drowable extends Node {
    constructor(w, h) {
        super();
        this._canvas = document.createElement('canvas');
        this._canvas.width = w;
        this._canvas.height = h;
        this._context = this._canvas.getContext('2d');
    }
    get width() {
        return this._canvas.width;
    }
    set width(value) {
        this._canvas.width = value;
    }

    get height() {
        return this._canvas.height;
    }
    set height(value) {
        this._canvas.height = value;
    }

    __draw(display) {
        super.__draw(display);
        display._context.save();
        display._context.translate(this.pos.x, this.pos.y);
        display._context.rotate(this.rotation);
        display._context.scale(this.scale.x, this.scale.y);
        display._context.drawImage(this._canvas, -this.width / 2, -this.height / 2);
        this._child.forEach(x => x.__draw(display));
        display._context.setTransform(1, 0, 1, 0, 0, 0);
        display._context.restore();
    }
}

class Rect extends Drowable {
    constructor(w, h) {
        super(w, h);
        this._context.fillRect(0, 0, this.width, this.height);
    }

    get width() {
        return this._canvas.width;
    }
    set width(value) {
        this._canvas.width = value;
        this._context.fillRect(0, 0, this.width, this.height);
    }
    get height() {
        return this._canvas.height;
    }
    set height(value) {
        this._canvas.height = value;
        this._context.fillRect(0, 0, this.width, this.height);
    }

    get color() {
        return this._context.fillStyle;
    }
    set color(value) {
        this._context.fillStyle = value;
        this._context.fillRect(0, 0, this.width, this.height);
    }

}

class Circle extends Drowable {
    constructor(r) {
        super(2 * r, 2 * r);
        this._context.arc(r, r, r, 0, 2 * Math.PI, false);
        this._context.fill();
    }

    get radius() {
        return this.width / 2;
    }
    set radius(value) {
        this._canvas.width = value * 2;
        this._canvas.height = value * 2;
        this._context.clearRect(0, 0, 2 * this.radius, 2 * this.radius);
        this._context.arc(r, r, r, 0, 2 * Math.PI, false);
        this._context.fill();
    }
    get color() {
        return this._context.fillStyle;
    }
    set color(value) {
        this._context.fillStyle = value;
        this._context.clearRect(0, 0, 2 * this.radius, 2 * this.radius);
        this._context.arc(this.radius, this.radius, this.radius, 0, 2 * Math.PI, false);
        this._context.fill();
    }
}

class Sprite extends Drowable {
    constructor(w, h, tex) {
        super(w, h);
        this._context.drawImage(tex.image, 0, 0, w, h);
    }
}

// util class
class Vector {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    get normalized() {
        return this.mul(this.length);
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    mul(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    div(s) {
        this.x /= s;
        this.y /= s;
        return this;
    }

    toString() {
        return "Vector [" + this.x + ", " + this.y + "]";
    }

    static dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    static get up() { return new Vector(0, 1); }
    static get down() { return new Vector(0, -1); }
    static get left() { return new Vector(-1, 0); }
    static get right() { return new Vector(1, 0); }
    static get one() { return new Vector(1, 1); }
    static get zero() { return new Vector(0, 0); }
}

class Color {
    constructor(r, g, b, a) {
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = a || 1;
    }

    toString() {
        return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
    }

    static random(a) {
        a = a || 1;
        return new Color(
            Random.range(0, 255, true),
            Random.range(0, 255, true),
            Random.range(0, 255, true),
            a);
    }
}

class Random {
    static range(min, max, flag) {
        var r = ((max - min) * Math.random()) + min;
        return flag ? parseInt(r) : r;
    }
    static get vector() {
        var x = Random.range(-1, 1);
        var y= Random.range(-1, 1);
        return new Vector(x, y).normalized;
    }
}

class Texture {
    constructor(path, w, h) {
        this.image = new Image(w, h);
        this.image.src = path;
    }
}