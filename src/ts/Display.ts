import { EventTarget } from "./EventTarget";
import { MouseEvent } from "./Event";
import { Color } from "./Utils";
import { Node } from "./Drawable";

type Normal = { readonly type_: "normal" };
const Normal: Normal = { type_: "normal" };

type UseColor = { readonly type_: "use_color"; color: Color };
const UseColor: (color: Color) => UseColor = color => ({
  type_: "use_color",
  color
});

export type ClearMode = Normal | UseColor;
export type PreloadTexture = { image: HTMLImageElement };

export class Display extends EventTarget<number> {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private childlen: Array<Node<number>>;
  private frameCount: number;
  private textures: Array<PreloadTexture>;
  private mainLoop: number;

  public clearColor: string;
  public clearMode: ClearMode;
  public isDebug: boolean;

  constructor(id: string) {
    super();
    this.canvas = document.getElementById(id) as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d");

    this.frameCount = 0;
    this.childlen = [];
    this.textures = [];
    this.clearColor = "#fff";
    this.clearMode = Normal;
    this.isDebug = false;

    this.mainLoop = requestAnimationFrame(this.draw.bind(this));

    // キーイベント
    document.addEventListener("keydown", e => this.keyEvent("down", e));
    document.addEventListener("keyup", e => this.keyEvent("up", e));
    document.addEventListener("keypress", e => this.keyEvent("press", e));
    // マウスイベント
    this.canvas.addEventListener("mousedown", e =>
      this.__mouseEvent(new MouseEvent(e))
    );
    this.canvas.addEventListener("mouseup", e =>
      this.__mouseEvent(new MouseEvent(e))
    );
    this.canvas.addEventListener("mousemove", e =>
      this.__mouseEvent(new MouseEvent(e))
    );
    this.canvas.addEventListener("mouseout", e =>
      this.__mouseEvent(new MouseEvent(e))
    );
  }

  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }

  private draw() {
    if (!this.textures.every(x => x.image.hasAttribute("loaded"))) return;
    if (this.frameCount === 0) this.dispatchEvent("init", null);
    this.clear();
    this.dispatchEvent("update", this.frameCount);
    this.childlen.sort((x, y) => x.z_index - y.z_index);
    this.childlen.forEach(x => x.draw(this.context));
    this.frameCount++;
  }

  private keyEvent(eventType, eventData) {
    this.dispatchEvent(eventData.type, eventData);
    this.dispatchEvent(eventData.code + "-" + eventType, eventData);
    this.childlen.forEach(x => {
      x.dispatchEvent(eventData.type, eventData);
      x.dispatchEvent(eventData.code + "-" + eventType, eventData);
    });
  }

  private clear() {
    switch (this.clearMode.type_) {
      case "normal":
        this.context.clearRect(0, 0, this.width, this.height);
        break;
      case "use_color":
        this.context.fillStyle = this.clearMode.color.toString();
        this.context.fillRect(0, 0, this.width, this.height);
        break;
    }
  }

  private mouseEvent(eventData) {
    this.dispatchEvent(eventData.type, eventData);
    this.childlen.sort((x, y) => x.z_index - y.z_index);
    this.childlen.some(x => x.dispatchEvent(eventData.type, eventData));
  }

  addChild(child: Node<any>) {
    this.childlen.push(child);
    child.parent = this;
  }
  removeChild(child) {
    var i = this._child.indexOf(child);
    this._child.splice(i, 1);
    child.parent = null;
  }

  preload(paths) {
    let c = 0;
    paths.forEach(x => (this._textures[x] = new Texture(x)));
  }

  getTexture(path) {
    return this._textures[path];
  }
}
