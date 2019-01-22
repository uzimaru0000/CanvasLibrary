import { EventTarget } from './EventTarget'
import { MouseEvent } from './Event'

export enum ClearMode {
    Normal,
    UseColor
}

interface PreloadTexture { image: HTMLImageElement }

export class Display extends EventTarget {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private childlen: Array<Node>;
    private frameCount: number;
    private textures: Array<PreloadTexture>;
    private mainLoop: number;

    public clearColor: string;
    public clearMode: ClearMode;
    public isDebug: boolean;

    constructor(id: string) {

        super();
        this.canvas = document.getElementById(id) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d');

        this.frameCount = 0;
        this.childlen = [];
        this.textures = [];
        this.clearColor = '#fff';
        this.clearMode = ClearMode.Normal;
        this.isDebug = false;

        this.mainLoop = requestAnimationFrame(this.draw.bind(this));

        // キーイベント
        document.addEventListener('keydown', e => this.keyEvent('down', e));
        document.addEventListener('keyup', e => this.keyEvent('up', e));
        document.addEventListener('keypress', e => this.keyEvent('press', e));
        // マウスイベント
        this.canvas.addEventListener('mousedown', e => this.__mouseEvent(new MouseEvent(e)));
        this.canvas.addEventListener('mouseup', e => this.__mouseEvent(new MouseEvent(e)));
        this.canvas.addEventListener('mousemove', e => this.__mouseEvent(new MouseEvent(e)));
        this.canvas.addEventListener('mouseout', e => this.__mouseEvent(new MouseEvent(e)));
    }

    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
    }

    private draw() {
        if (!this.textures.every(x => x.image.hasAttribute('loaded'))) return;
        if (this.frameCount === 0) this.dispatchEvent('init', null);
        this.__clear();
        this.dispatchEvent('update', this.frameCount);
        this.childlen.sort((x, y) => x.z_index > y.z_index);
        this.childlen.forEach(x => x.__draw(this));
        this.frameCount++;
    }

    private keyEvent(eventType, eventData) {
        this.dispatchEvent(eventData.type, eventData);
        this.dispatchEvent(eventData.code + '-' + eventType, eventData);
        this.childlen.forEach(x => {
            x.dispatchEvent(eventData.type, eventData);
            x.dispatchEvent(eventData.code + '-' + eventType, eventData);
        });
    }

    __clear() {
        switch (this.clearMode) {
            case Display.clearMode.Normal:
                this._context.clearRect(0, 0, this.width, this.height);
                break;
            case Display.clearMode.UseColor:
                this._context.fillStyle = this.clearColor;
                this._context.fillRect(0, 0, this.width, this.height);
                break;
        }
    }

    __mouseEvent(eventData) {
        this.dispatchEvent(eventData.type, eventData);
        this._child.sort((x, y) => x.z_index < y.z_index);
        this._child.some(x => x.dispatchEvent(eventData.type, eventData));
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
        paths.forEach(x => this._textures[x] = new Texture(x));
    }

    getTexture(path) {
        return this._textures[path];
    }
}