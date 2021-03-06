'use strict'



class Node extends EventTarget {
    constructor() {
        super();
        this.pos = new Vector();
        this.rotation = 0;
        this.scale = new Vector(1, 1);
        this._child = [];
        this.parent;
        this.z_index = 0;
    }

    get globalPos() {
        if (this.parent instanceof Display) return this.pos.clone();
        return this.pos.clone().add(this.parent.globalPos);
    }

    get globalRotation() {
        if (this.parent instanceof Display) return this.rotation;
        return this.rotate + this.parent.globalRotation;
    }

    __draw(display) {
        this.dispatchEvent('update', display.frameCount);
        this._child.sort((x, y) => x.z_index > y.z_index);
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

}

class Group extends Node {
    constructor() {
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

    dispatchEvent(target, e) {
        super.dispatchEvent(target, e);
        if (/mouse*/.test(e.type)) e.localPos.sub(this.pos);
        return this._child.some(x => x.dispatchEvent(target, e));
    }
}

// 描画領域を持つNodeクラス
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

    get vertex() {
        let vert = [];
        for (let i = 0; i < 4; i++) {
            let v = new Vector(
                this.width / 2 * Math.sign(Math.cos(Math.PI / 4 + Math.PI / 2 * i)),
                this.height / 2 * Math.sign(Math.sin(Math.PI / 4 + Math.PI / 2 * i))
            );
            vert.push(new Vector(
                Math.cos(this.globalRotation) * v.x - Math.sin(this.globalRotation) * v.y,
                Math.sin(this.globalRotation) * v.x + Math.cos(this.globalRotation) * v.y,
            ).add(this.globalPos));
        }
        return vert;
    }

    __draw(display) {
        super.__draw(display);
        display._context.save();
        display._context.translate(this.pos.x, this.pos.y);
        display._context.rotate(this.rotation);
        display._context.scale(this.scale.x, this.scale.y);
        if (display.isDebug) {
            this._context.strokeStyle = 'red';
            this._context.strokeRect(0, 0, this.width, this.height);
        }
        display._context.drawImage(this._canvas, -this.width / 2, -this.height / 2);
        this._child.forEach(x => x.__draw(display));
        display._context.setTransform(1, 0, 1, 0, 0, 0);
        display._context.restore();
    }

    dispatchEvent(target, e) {
        if (/mouse*/.test(e.type)) {
            let width = this.width * Math.abs(this.scale.x);
            let height = this.height * Math.abs(this.scale.y);
            if (this.pos.x - width / 2 <= e.localPos.x &&
                this.pos.x + width / 2 >= e.localPos.x &&
                this.pos.y - height / 2 <= e.localPos.y &&
                this.pos.y + height / 2 >= e.localPos.y) {
                super.dispatchEvent(target, e);
                return true;
            }
        } else {
            super.dispatchEvent(target, e);
        }
        return this._child.some(x => x.dispatchEvent(target, e));
    }

    withIn(target, radius, callback) {
        if (target instanceof Drowable && target.globalPos.sub(this.globalPos).length <= 2 * radius) {
            if (callback) callback();
            return true;
        } else {
            return false;
        }
    }

    isHit(target) {
        if (!(target instanceof Drowable)) return false;
        return target.vertex.some((_, n, v) => this.vertex.some((_, m, w) => {
            let v1 = v[(n + 1) % v.length].clone().sub(v[n]);
            let v2 = w[m].clone().sub(v[n]);
            let v3 = w[(m + 1) % w.length].clone().sub(v[n]);
            let v4 = w[(m + 1) % w.length].clone().sub(w[m]);
            let v5 = v[n].clone().sub(w[m]);
            let v6 = v[(n + 1) % v.length].clone().sub(w[m]);
            return v1.cross(v2) * v1.cross(v3) < 0 && v4.cross(v5) * v4.cross(v6) < 0;
        }));
    }

}

// 矩形スプライトクラス
class Rect extends Drowable {
    constructor(w, h) {
        super(w, h);
        this._context.fillRect(0, 0, this.width, this.height);
    }

    get width() {
        return super.width;
    }
    set width(value) {
        this._canvas.width = value;
        this._context.fillRect(0, 0, this.width, this.height);
    }
    get height() {
        return super.height;
    }
    set height(value) {
        this._canvas.height = value;
        this._context.fillRect(0, 0, this.width, this.height);
    }

    get color() {
        return this._context.fillStyle;
    }
    set color(value) {
        this._context.clearRect(0, 0, this.width, this.height);
        this._context.fillStyle = value;
        this._context.fillRect(0, 0, this.width, this.height);
    }

}

// 円形スプライトクラス
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

// 画像スプライトクラス
class Sprite extends Drowable {
    constructor(w, h, tex) {
        super(w, h);
        this.texture = tex;
    }

    __draw(display) {
        this._context.drawImage(this.texture.image, 0, 0, this.width, this.height);
        super.__draw(display);
    }
}

// アニメーションするスプライトクラス
class AnimationSprite extends Drowable {
    constructor(w, h, texs) {
        super(w, h);
        this.frame = 0;
        this.textures = texs;
        this.rate = 30;
        this.on('update', e => {
            if (e % this.rate === 0) {
                this.frame++;
                this.frame %= this.textures.length;
            }
        });
    }

    __draw(display) {
        this._context.drawImage(this.textures[this.frame].image, 0, 0, this.width, this.height);
        super.__draw(display);
    }
}

// 文字を描画するスプライトクラス
class Label extends Drowable {
    constructor(str) {
        super(100, 16);
        this._context.font = this.fontSize + "px ''";
        this.width = this._context.measureText(str).width;

        this._text = str;
        this.color = 'black';
    }

    get fontSize() {
        return this.height;
    }
    set fontSize(value) {
        this.height = value;
        this._context.font = value + "px ''";
        this.width = this._context.measureText(this.text).width;
    }
    get text() {
        return this._text;
    }
    set text(value) {
        this._text = value;
        this.width = this._context.measureText(value).width;
    }

    __draw(display) {
        this._context.clearRect(0, 0, this.width, this.height);
        this._context.textBaseline = 'middle';
        this._context.font = this.fontSize + "px ''";
        this._context.fillStyle = this.color;
        this._context.fillText(this.text, 0, this.fontSize / 2);
        super.__draw(display);
    }
}

class Line extends Node {
    constructor(paths) {
        super();
        this.paths = paths.concat();
        this.lineWidth = 1;
    }

    addPath(path) {
        this.paths.push(path);
    }

    removePath(index) {
        this.paths.splice(index, 1);
    }

    __draw(display) {
        super.__draw(display);
        display._context.save();
        display._context.translate(this.pos.x, this.pos.y);
        display._context.rotate(this.rotation);
        display._context.scale(this.scale.x, this.scale.y);
        display._context.beginPath();
        this.paths.forEach(p => display._context.lineTo(p.x, p.y));
        display._context.lineWidth = this.lineWidth;
        display._context.stroke();
        display._context.closePath();
        this._child.forEach(x => x.__draw(display));
        display._context.setTransform(1, 0, 1, 0, 0, 0);
        display._context.restore();
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
        return this.length != 0 ? this.clone().div(this.length) : Vector.zero;
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

    clone() {
        return new Vector(this.x, this.y);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    cross(v) {
        return this.x * v.y - this.y * v.x;
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
        this.r = this.r > 255 ? 255 : (this.r < 0 ? 0 : this.r);
        this.g = this.g > 255 ? 255 : (this.g < 0 ? 0 : this.g);
        this.b = this.b > 255 ? 255 : (this.b < 0 ? 0 : this.b);
        this.a = this.a > 1 ? 1 : (this.a < 0 ? 0 : this.a);
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
        var y = Random.range(-1, 1);
        return new Vector(x, y).normalized;
    }
}

class Texture {
    constructor(path, w, h) {
        this.image = new Image(w, h);
        this.image.src = path;
        this.image.onload = () => this.image.setAttribute('loaded', 'true');
    }

    get loaded() {
        return this.image.getAttribute('loaded');
    }
}