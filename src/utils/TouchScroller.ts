// third-party
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";

// local
import * as MathUtils from "./MathUtils";

//
gsap.registerPlugin(ScrollToPlugin);

/**
 * A cancelable scroller for the touchscreen.
 * Must be discarded/created on touch start.
 */
export class TouchScroller {
  private _scroll_node: HTMLElement;
  private _orientation: ScrollOrientation;
  private _last_position: number = 0;
  private _tween: null | gsap.core.Tween = null;
  private _scrolled: boolean = false;

  //
  public constructor(node: HTMLElement, orientation: ScrollOrientation) {
    this._scroll_node = getScrollTarget(node);
    this._orientation = orientation;
  }

  //
  public get scrolled(): boolean {
    return this._scrolled;
  }

  //
  public start(e: TouchEvent): void {
    this._last_position = this._orientation == "horizontal" ? e.touches[0].clientX : e.touches[0].clientY;
  }

  //
  public move(e: TouchEvent): void {
    this._tween?.kill();
    this._tween = null;

    const touch = e.touches[0];

    const current_position = this._orientation == "horizontal" ? touch.clientX : touch.clientY;
    const delta = this._last_position - current_position;

    const old_scroll = (
      this._orientation == "horizontal" ?
        this._scroll_node.scrollLeft :
        this._scroll_node.scrollTop
    );

    let target_scroll = old_scroll + delta;

    const max_scroll = (
      this._orientation === "horizontal"
        ? this._scroll_node.scrollWidth - this._scroll_node.clientWidth
        : this._scroll_node.scrollHeight - this._scroll_node.clientHeight
    );

    target_scroll = MathUtils.clamp(target_scroll, 0, max_scroll);

    if (Math.abs(target_scroll - old_scroll) > 3) {
      this._scrolled = true;
    }

    if (this._orientation === "horizontal") {
      this._scroll_node.scrollLeft = target_scroll;
    } else {
      this._scroll_node.scrollTop = target_scroll;
    }

    /*
    this._tween = gsap.to(this._scroll_node, {
      scrollLeft: this._orientation === "horizontal" ? target_scroll : undefined,
      scrollTop: this._orientation === "vertical" ? target_scroll : undefined,
      duration: 0.3,
      ease: "power1.out",
    });
    this._tween!.then(() => {
      this._tween = null;
    });
    */

    this._last_position = current_position;
  }

  //
  public destroy(): void {
    this._tween?.kill();
    this._tween = null;
  }
}

type ScrollOrientation = "horizontal" | "vertical";

/**
 * Finds nearest scroll container.
 */
function getScrollTarget(el: HTMLElement): HTMLElement {
  let node: HTMLElement | null = el;

  while (node && node !== document.body) {
    const style = getComputedStyle(node);
    if (
      /(auto|scroll|overlay)/.test(style.overflowY) &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
    node = node.parentElement;
  }

  return document.scrollingElement as HTMLElement;
}