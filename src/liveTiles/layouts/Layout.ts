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
  public abstract snapToGrid(tileDND: HTMLElement): null | GridSnapResult;
}

/**
 * Grid snap result.
 */
export type GridSnapResult = {
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