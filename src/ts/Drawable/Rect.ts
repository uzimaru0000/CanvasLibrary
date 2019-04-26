import { Drawable, Node } from "../Drawable";
import { Vector, Color } from "../Utils";

export class Rect extends Node implements Drawable {
  constructor(
    public position: Vector,
    public width: number = 0,
    public height: number = 0,
    public color: Color = new Color()
  ) {
    super();
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.translate(ctx);
    this.children.forEach(x => x.draw(ctx));
    ctx.fillStyle = this.color.toString();
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.setTransform(1, 0, 1, 0, 0, 0);
    ctx.restore();
  }
}
