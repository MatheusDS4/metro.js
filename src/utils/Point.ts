// local
import { Rectangle } from "./Rectangle";

// A point in 2D coordinate space.
export class Point {
  //
  public x: number;
  public y: number;

  //
  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Converts from a different data type to a `Point` instance.
   * 
   * For `MouseEvent` and `Touch`, reuses the client X/Y coordinates.
   */
  public static from(arg: MouseEvent | Touch): Point {
    if (arg instanceof MouseEvent) {
      return new Point(arg.clientX, arg.clientY);
    } else {
      return new Point(arg.clientX, arg.clientY);
    }
  }

  /**
   * Checks whether the point intersects another shape.
   */
  public intersects(arg: Rectangle): boolean {
    return this.x >= arg.x && this.x < arg.right &&
      this.y >= arg.y && this.y < arg.bottom;
  }
}