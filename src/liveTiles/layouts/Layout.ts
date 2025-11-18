// local
import type { Core } from "../Core";

// layout
export abstract class Layout {
  //
  public constructor(public readonly $: Core) {
    //
  }

  /**
   * Rearranges everything.
   */
  public abstract rearrange(): void;

  /**
   * Snaps location to grid.
   */
  public abstract snap(tileDND: HTMLElement): null | SnapResult;
}

/**
 * Grid snap result.
 */
export type SnapResult = {
  /**
   * Group ID.
   *
   * If none, requests a new group.
   */
  group?: string,
  /**
   * X-coordinate in 1x1 tiles.
   */
  x: number,
  /**
   * Y-coordinate in 1x1 tiles.
   */
  y: number,
};