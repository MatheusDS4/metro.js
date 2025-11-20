// local
import type { Core, BulkChange } from "./Core";
import { CoreGroup, CoreTile } from "./CoreGroup";
import { SimpleGroup } from "./SimpleGroup";
import * as MathUtils from "../utils/MathUtils";

//
export class GroupPointerHandlers {
  //
  public constructor(
    private readonly $: Core,
    private readonly node: HTMLDivElement
  ) {
    //
  }

  //
  public attach(): void {
    const { node } = this;

    fixme();
  }
}