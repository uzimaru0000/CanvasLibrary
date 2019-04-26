import { IEventTarget, Event } from "./EventTarget";
import { Color } from "./Utils";
import { Node, Drawable } from "./Drawable";

type Normal = { readonly type_: "normal" };
const Normal: Normal = { type_: "normal" };

type UseColor = { readonly type_: "use_color"; color: Color };
export const UseColor: (color: Color) => UseColor = color => ({
  type_: "use_color",
  color
});

export type ClearMode = Normal | UseColor;
export type PreloadTexture = { image: HTMLImageElement };

export class Display implements IEventTarget {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private children: (Drawable & IEventTarget)[] = [];
  private event: { [target: string]: ((e: Event) => void)[] } = {};
  public clearMode: ClearMode = Normal;

  constructor(id: string = "display") {
    this.canvas = document.getElementById(id) as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d");

    this.loop(Date.now());
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  addEventListener(target: string, func: (e: Event) => void) {
    if (this.event[target] === undefined) {
      this.event[target] = [];
    }
    this.event[target].push(func);
  }

  removeEventListener(target: string, func: (e: Event) => void) {
    if (this.event[target] === undefined) return;
    this.event[target].filter(x => x !== func);
  }

  dispatchEvent(target: string, event: Event) {
    this.children
      .filter(x => (x as IEventTarget).dispatchEvent !== undefined)
      .map(x => x as IEventTarget)
      .forEach(x => x.dispatchEvent(target, event));
    if (this.event[target] === undefined) return;
    this.event[target].forEach(func => func(event));
  }

  public addChild(child: Drawable & IEventTarget) {
    this.children.push(child);
  }

  public removeChild(child: Drawable & IEventTarget) {
    this.children = this.children.filter(c => c !== child);
  }

  private draw() {
    this.children.forEach(c => c.draw(this.context));
  }

  private loop(ms: number) {
    this.dispatchEvent("update", {
      type: "update",
      dt: (Date.now() - ms) * 1000
    });
    this.clear();
    this.draw();
    requestAnimationFrame(this.loop.bind(this, Date.now()));
  }

  private clear() {
    switch (this.clearMode.type_) {
      case "normal":
        this.context.save();
        this.context.fillStyle = new Color(255, 255, 255).toString();
        break;
      case "use_color":
        this.context.save();
        this.context.fillStyle = this.clearMode.color.toString();
        break;
    }
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.restore();
  }
}
