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
        this.dispatchEvent('update');
        this.frameCount++;
    }
}