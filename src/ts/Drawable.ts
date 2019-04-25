import { Vector } from "./Utils";
import { EventTarget } from "./EventTarget";

export interface Drawable {
  draw(): void;
}

export abstract class Node<T> extends EventTarget<T> {
  public z_index: number;

  constructor(public pos: Vector) {
    super();
  }

  public abstract draw(context: CanvasRenderingContext2D): void;
}
