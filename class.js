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

    dispatchEvent(target) {
        if (this.__event[target] === undefined) return;
        this.__event[target].forEach(x => x());
    }
}

class Display extends EventTarget {
    constructor(id) {
        super();
        this._canvas = document.getElementById(id);
        this._context = this._canvas.getContext('2d');

        this._fps = 30;
        this.frameCount = 0;
        this.child = [];

        this.__mainLoop = setInterval(this.__draw.bind(this), 1000 / this._fps);
    }

    get fps() {
        return this._fps;
    }
    set fps(value) {
        clearInterval(this.___mainLoop);
        this._fps = value;
        this.__mainLoop = setInterval(this.__draw.bind(this), 1000 / this._fps);
    }

    __draw() {
        this.child.forEach(x => {
            x.dispatchEvent('update');
            this._context.save();
            this._context.drawImage(x._canvas, x.pos.x, x.pos.y);
            this._context.restore();
        });
        this.dispatchEvent('update');
        this.frameCount++;
    }

    addChild(child) {
        this.child.push(child);
    }
    removeChild(child) {
        var i = this.child.indexOf(child);
        this.child.splice(i, 1);
    }
}

class Node extends EventTarget {
    constructor(w, h) {
        super();
        this._canvas = document.createElement('canvas');
        this._canvas.width = w;
        this._canvas.height = h;
        this._context = this._canvas.getContext('2d');

        this.pos = new Vector();
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
}

class Rect extends Node {
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

class Vector {
    constructor(x, y) {
        this.x = x | 0;
        this.y = y | 0;
    }

    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}