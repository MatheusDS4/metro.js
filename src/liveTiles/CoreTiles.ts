// third-party
import assert from "assert";
import { TypedEventTarget } from "@hydroperx/event";

// local
import { REMObserver } from "../utils/REMObserver";
import * as MathUtils from "../utils/MathUtils";

/**
 * Live tiles core implementation.
 */
export class CoreTiles extends (EventTarget as TypedEventTarget<CoreTilesEventMap>) {
  /**
   * Constructs a `CoreTiles` instance.
   */
  public constructor(params: {
    classNames: CoreTilesClassNames,
  }) {
    super();
  }
}

/**
 * Class names used by `CoreTiles`.
 */
export type CoreTilesClassNames = {
  group: string,
  groupLabel: string,
  groupLabelText: string,
  groupTiles: string,
  tile: string,
  tileContent: string,
  tileDND: string,
};

/**
 * Events emitted by `Tiles` instances.
 */
export type CoreTilesEventMap = {
  //
};

/**
 * Core tiles state.
 */
export class CoreTilesState {
}