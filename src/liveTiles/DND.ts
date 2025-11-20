// third-party
import Draggable from "@hydroperx/draggable";

// local
import type { BulkChange, Core } from "./Core";
import { CoreGroup, CoreTile } from "./CoreGroup";
import { MAXIMUM_Z_INDEX } from "../utils/Constants";
import { type SnapResult } from "./layouts/Layout";

/**
 * Drag-n-drop implementation.
 */
export class DND {
  // dragging something? (whether a tile or whole group.)
  public dragging: boolean = false;

  // TileDND is a direct child of the Core's container.
  public tileDNDDOM: null | HTMLElement = null;

  // used for propagating click to the true tile <button>
  private _tile_dnd_click_handler: null | Function = null;

  // original state (in compact form (no DOM, no group labels))
  private _original_state: Map<number, CoreGroup> = new Map();

  //
  private _snap: null | SnapResult = null;

  //
  public tileButton: null | HTMLButtonElement = null;

  // tile actively dragging
  public tileId: string = "";

  //
  public tileDNDDraggable: null | Draggable = null;

  // unique group Draggable `[groupId, draggable]`
  public groupDraggable: null | [string, Draggable] = null;

  //
  public constructor(private readonly $: Core) {
    //
  }

  //
  public initTileDNDDraggable(): void {
    if (this.tileDNDDOM && this._tile_dnd_click_handler) {
      this.tileDNDDOM!.removeEventListener("click", this._tile_dnd_click_handler! as any);
    }
    // destroy previous Draggable
    this.tileDNDDraggable?.destroy();

    // find DND element and build Draggable up
    const dnd_dom_list = this.$._container.getElementsByClassName(this.$._class_names.tileDND);
    this.tileDNDDOM = dnd_dom_list.length == 0 ? null : dnd_dom_list[0] as HTMLElement;
    if (this.tileDNDDOM) {
      this.tileDNDDOM!.style.visibility = "visible";
      this.tileDNDDraggable = new Draggable(this.tileDNDDOM!, {
        threshold: "0.7rem",
        cascadingUnit: "rem",
        setPosition: false,
        onDragStart: this._tile_drag_start.bind(this),
        onDrag: this._tile_drag_move.bind(this),
        onDragEnd: this._tile_drag_end.bind(this),
      });

      // propagate click
      this._tile_dnd_click_handler = (e: MouseEvent) => {
        this.tileButton?.click();
        this.cancel();
      };
      this.tileDNDDOM!.addEventListener("click", this._tile_dnd_click_handler! as any);
    }
  }

  // cancels any active drag-n-drop
  public cancel(): void {
    if (this.tileDNDDOM && this._tile_dnd_click_handler) {
      this.tileDNDDOM!.removeEventListener("click", this._tile_dnd_click_handler! as any);
    }
    if (this.dragging && this.tileButton) {
      this.tileButton!.style.visibility = "visible";
    }
    this.tileButton = null;
    this.tileId = "";
    // destroy previous Draggable
    this.tileDNDDraggable?.destroy();
    this.tileDNDDraggable = null;
    this.groupDraggable?.[1].destroy();
    this.groupDraggable = null;
    /*
    this.restore();
    */
    // clear state backup
    this._original_state.clear();

    this.dragging = false;
    if (this.tileDNDDOM) {
      this.tileDNDDOM.style.visibility = "hidden";
    }
    this.tileDNDDOM = null;
  }

  /*
  // restore initial layout state before drag-n-drop.
  //
  // for tiles: this should restore state, remove dead dragging tile if the case,
  // re-add any new tiles and groups,
  // and re-arrange later.
  //
  // for groups: this should restore state, remove dead dragging group if the case,
  // re-add any new groups, and re-arrange later.
  //
  // this will also update the `_original_state` variable
  // with the current changes.
  //
  // this might trigger some events.
  private _restore(): void {
    fixme();
  }
  */

  //
  private _tile_drag_start(element: Element, x: number, y:  number, event: Event): void {
    // visibility changes
    this.tileDNDDOM!.style.visibility = "visible";
    this.tileButton!.style.visibility = "hidden";

    // original state
    this._original_state = this.$._clone_state();

    //
    this.dragging = true;

    //
    this.tileDNDDOM!.style.zIndex = MAXIMUM_Z_INDEX;

    // reset snap cache
    this._snap = null;

    // Core#dragStart
    this.$.dispatchEvent(new CustomEvent("dragStart", {
      detail: { id: this.tileId, dnd: this.tileDNDDOM! },
    }));
  }

  //
  private _tile_drag_move(element: Element, x: number, y:  number, event: Event): void {
    // update tile <button> reference as its DOM may have been re-created
    // (typically in response to React.js's rendering)
    this.tileButton = this.$._groups.values()
      .find(g => g.tiles.has(this.tileId))?.tiles.get(this.tileId)?.dom ?? null;

    // visibility changes
    if (this.tileButton) {
      this.tileButton!.style.visibility = "hidden";
    }

    // exit if the tile has been removed while dragging.
    if (!(this.tileButton && this.tileButton!.parentElement)) {
      return;
    }

    // track last snap
    const old_snap = this._snap;

    // try snapping to grid now
    this._snap = this.$._layout.snap(this.tileDNDDOM!);

    // if snap resolves successfully to an existing area
    if (!!this._snap && !!this._snap!.group) {
      let threshold_met = true;

      if (old_snap) {
        threshold_met =
          old_snap.group !== this._snap!.group ||
          Math.abs(old_snap!.x - this._snap!.x) >= 1 ||
          Math.abs(old_snap!.y - this._snap!.y) >= 1;

        // revert shifting changes
        /*
        if (threshold_met) {
          this._restore();
        }
        */
      }

      // if threshold is met
      if (threshold_met) {
        const old_group_id = this.tileId;
        const new_group_id = this._snap!.group;
        if (old_group_id == new_group_id) {
          // move tile
          const bulkChange: BulkChange = {
            movedTiles: [{ id: this.tileId, x: this._snap!.x, y: this._snap!.y }],
            groupTransfers: [],
            groupRemovals: [],
            groupCreation: null,
          };
          this.$.dispatchEvent(new CustomEvent("bulkChange", {
            detail: bulkChange,
          }));
        } else {
          // group transfer
          const bulkChange: BulkChange = {
            movedTiles: [],
            groupTransfers: [{ group: new_group_id, id: this.tileId, x: this._snap!.x, y: this._snap!.y }],
            groupRemovals: [],
            groupCreation: null,
          };
          this.$.dispatchEvent(new CustomEvent("bulkChange", {
            detail: bulkChange,
          }));
        }
      }
    }/*
    // otherwise restore state
    else {
      this._restore();
    }
    */

    // trigger Core#dragMove
    this.$.dispatchEvent(new CustomEvent("dragMove", {
      detail: { id: this.tileId, dnd: this.tileDNDDOM! },
    }));
  }

  //
  private _tile_drag_end(element: Element, x: number, y:  number, event: Event): void {
    // update tile <button> reference as its DOM may have been re-created
    // (typically in response to React.js's rendering)
    this.tileButton = this.$._groups.values()
      .find(g => g.tiles.has(this.tileId))?.tiles.get(this.tileId)?.dom ?? null;

    // exit if the tile has been removed while dragging.
    if (!(this.tileButton && this.tileButton!.parentElement)) {
      return;
    }

    // last grid-snapping may have requested a new group,
    // which is appropriate to create during drag end.
    if (this._snap && !this._snap!.group) {
      // group transfer
      const bulkChange: BulkChange = {
        movedTiles: [],
        groupTransfers: [],
        groupRemovals: [],
        groupCreation: { tile: this.tileId },
      };
      this.$.dispatchEvent(new CustomEvent("bulkChange", {
        detail: bulkChange,
      }));
    }

    this.dragging = false;
    this.tileId = "";
    this._original_state.clear();

    // visibility changes
    this.tileButton!.style.visibility = "";
    this.tileDNDDOM!.style.visibility = "hidden";
  }
}