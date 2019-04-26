import { Display } from "./ts/Display";
import { Rect } from "./ts/Drawable/Rect";
import { Vector, Color } from "./ts/Utils";
import { Circle } from "./ts/Drawable/Circle";

const display = new Display();
const rect = new Rect(new Vector(100, 100), 100, 100, new Color(255, 0, 0));
const circle = new Circle(new Vector(200, 200), 50, new Color(0, 255, 0));
rect.addEventListener("update", ({ dt }) => {
  rect.rotate += 10 * (180 / Math.PI / dt);
});
circle.addEventListener("update", ({ dt }) => {
  circle.position = new Vector(Math.cos(dt), Math.sin(dt))
    .mul(10)
    .add(Vector.one.mul(200));
});
rect.addChild(circle);
display.addChild(rect);
