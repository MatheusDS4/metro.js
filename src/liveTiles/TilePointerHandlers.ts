// local
import type { Core, BulkChange } from "./Core";
import { CoreGroup, CoreTile } from "./CoreGroup";
import { SimpleGroup } from "./SimpleGroup";
import * as MathUtils from "../utils/MathUtils";

//
export class TilePointerHandlers {
  //
  public constructor(
    private readonly $: Core,
    private readonly node: HTMLButtonElement
  ) {
    //
  }

  //
  public attach(): void {
    const { node } = this;

    // mouse handlers
    node.addEventListener("mousedown", this.mouse_down.bind(this));
    node.addEventListener("mouseup", this.mouse_up.bind(this));
    node.addEventListener("mouseout", this.mouse_out.bind(this));
    node.addEventListener("click", this.click.bind(this));

    // touch handlers
    fixme();
  }

  //
  private mouse_down(e: MouseEvent): void {
    // at some point...
    //    window.addEventListener("mousemove", this.window_mouse_move.bind(this));
    fixme();
  }

  //
  private window_mouse_move(e: MouseEvent): void {
    fixme();
  }

  //
  private mouse_up(e: MouseEvent): void {
    fixme();
  }

  //
  private mouse_out(e: MouseEvent): void {
    fixme();
  }

  //
  private click(e: MouseEvent): void {
    fixme();
  }
}