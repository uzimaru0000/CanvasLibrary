import { Vector } from "./Utils";
import { IEventTarget, Event } from "./EventTarget";

export interface Drawable {
  draw(ctx: CanvasRenderingContext2D): void;
}

interface Transform {
  position: Vector;
  rotate: number;
  scale: Vector;
}

interface Groupable<T> {
  addChild(child: T);
  removeChild(target: T);
}

export type INode<T> = Transform & Groupable<T>;

export class Node implements INode<Node & Drawable>, IEventTarget {
  public position: Vector;
  public rotate: number = 0;
  public scale: Vector = new Vector(1, 1);
  protected event: { [target: string]: ((e: Event) => void)[] } = {};
  protected children: (Node & Drawable)[] = [];

  constructor() {}

  public addEventListener(target: string, func: (e: Event) => void) {
    if (this.event[target] === undefined) {
      this.event[target] = [];
    }
    this.event[target].push(func);
  }

  public removeEventListener(target: string, func: (e: Event) => void) {
    if (this.event[target] === undefined) return;
    this.event[target] = this.event[target].filter(x => x !== func);
  }

  public dispatchEvent(target: string, event: Event) {
    if (this.event[target] === undefined) return;
    this.event[target].forEach(func => func(event));
  }

  public addChild(child: Node & Drawable) {
    this.children.push(child);
  }

  public removeChild(target: Node & Drawable) {
    this.children = this.children.filter(x => x !== target);
  }

  protected translate(ctx: CanvasRenderingContext2D) {
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotate);
    ctx.scale(this.scale.x, this.scale.y);
  }
}
