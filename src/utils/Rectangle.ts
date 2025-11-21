import { OffsetType } from "getoffset";

/**
 * Basic rectangle.
 */
export class Rectangle {
  //
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  //
  public constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Converts from a different data type to a `Rectangle` instance.
   */
  public static from(arg: DOMRect | OffsetType): Rectangle {
    if (arg instanceof DOMRect) {
      return new Rectangle(arg.x, arg.y, arg.width, arg.height);
    } else {
      return new Rectangle(arg.x, arg.y, arg.width, arg.height);
    }
  }

  public get left() {
    return this.x;
  }

  public get top() {
    return this.y;
  }

  public get right() {
    return this.x + this.width;
  }

  public get bottom() {
    return this.y + this.height;
  }

  /**
   * Checks whether two rectangles intersect.
   */
  public intersects(other: Rectangle): boolean {
    return !(
      this.x + this.width <= other.x ||
      this.x >= other.x + other.width ||
      this.y + this.height <= other.y ||
      this.y >= other.y + other.height
    );
  }

  //
  public intersection(other: Rectangle): null | Rectangle {
    const { x: ax1, y: ay1 } = this;
    const ax2 = this.x + this.width;
    const ay2 = this.y + this.height;
    const { x: bx1, y: by1 } = other;
    const bx2 = other.x + other.width;
    const by2 = other.y + other.height;

    const ix1 = Math.max(ax1, bx1);
    const iy1 = Math.max(ay1, by1);
    const ix2 = Math.min(ax2, bx2);
    const iy2 = Math.min(ay2, by2);

    if (ix1 < ix2 && iy1 < iy2) {
      return new Rectangle(ix1, iy1, ix2 - ix1, iy2 - iy1);
    }
    return null;
  }

  /**
   * Determines what side of `other` this rectangle intersects with.
   */
  public intersectsSideOf(other: Rectangle): null | IntersectionSide {
    // based on ChatGPT

    const intersection = this.intersection(other);
    if (!intersection) {
      return null;
    }

    // compute overlap depths
    const overlap_x = intersection!.width;
    const overlap_y = intersection!.height;

    if (overlap_x < overlap_y) {
      // horizontal penetration is smaller → collision is Left/Right
      let from_left  = Math.abs(this.right - other.left);
      let from_right = Math.abs(other.right - this.left);

      if (from_left < from_right) {
        return "left";
      } else {
        return "right";
      }
    } else {
      // vertical penetration is smaller → collision is Top/Bottom
      let from_top    = Math.abs(this.bottom - other.top);
      let from_bottom = Math.abs(other.bottom - this.top);

      if (from_top < from_bottom) {
        return "top";
      } else {
        return "bottom";
      }
    }
  }

  /**
   * Checks whether this rectangle is more above `other`.
   */
  public isMoreAbove(other: Rectangle): boolean {
    const aCenterY = this.y + this.height / 2;
    const bCenterY = other.y + other.height / 2;

    return aCenterY < bCenterY;
  }

  /**
   * Checks whether this rectangle is more below `other`.
   */
  public isMoreBelow(other: Rectangle): boolean {
    return other.isMoreAbove(this);
  }

  /**
   * Checks whether this rectangle is more left to `other`.
   */
  public isMoreLeft(other: Rectangle): boolean {
    const aCenterX = this.x + this.width / 2;
    const bCenterX = other.x + other.width / 2;

    return aCenterX < bCenterX;
  }

  /**
   * Checks whether this rectangle is more right to `other`.
   */
  public isMoreRight(other: Rectangle): boolean {
    return other.isMoreLeft(this);
  }

  /**
   * Clones rectangle.
   */
  public clone(): Rectangle {
    return new Rectangle(this.x, this.y, this.width, this.height);
  }
}

/**
 * The side where a rectangle intersects with another.
 */
export type IntersectionSide =
  | "top"
  | "bottom"
  | "left"
  | "right";