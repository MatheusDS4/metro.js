// local
import { Layout, SnapResult } from "./Layout";
import type { Core } from "../Core";

// vertical layout
export class VerticalLayout extends Layout {
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