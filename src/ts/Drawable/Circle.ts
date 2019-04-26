import { Drawable, Node } from "../Drawable";
import { Vector, Color } from "../Utils";

export class Circle extends Node implements Drawable {
  constructor(
    public position: Vector,
    public radius: number = 0,
    public color: Color = new Color()
  ) {
    super();
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.translate(ctx);
    this.children.forEach(x => x.draw(ctx));
    ctx.fillStyle = this.color.toString();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.setTransform(1, 0, 1, 0, 0, 0);
    ctx.restore();
  }
}
