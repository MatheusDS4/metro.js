// local
import { Layout, SnapResult } from "./Layout";
import type { Core } from "../Core";

// horizontal layout
export class HorizontalLayout extends Layout {
  //
  public constructor($: Core) {
    super($);
  }

  /**
   * Rearranges everything.
   */
  public override rearrange(): void {
    fixme();
  }

  /**
   * Snaps location to grid.
   */
  public override snap(tileDND: HTMLElement): null | SnapResult {
    fixme();
  }
}