// third-party
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";

// local
import * as MathUtils from "./MathUtils";

//
gsap.registerPlugin(ScrollToPlugin);

// (some of the code here is ChatGPT-based.)

/**
 * A cancelable scroller for the touchscreen.
 * Must be discarded/created on touch start.
 */
export class TouchScroller {
  private _scroll_node: HTMLElement;
  private _orientation: ScrollOrientation;
  private _last_position: number = 0;
  private _last_time: number = 0;
  private _velocity: number = 0;
  private _tween: null | gsap.core.Tween = null;
  private _scrolled: boolean = false;
  private _touching: boolean = false;

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
    const touch = e.touches[0];

    this._last_position = this._orientation == "horizontal" ? touch.clientX : touch.clientY;
    this._touching = true;
    this._last_time = performance.now();
    this._velocity = 0;
    this._tween?.kill();
    this._tween = null;
  }

  //
  public move(e: TouchEvent): void {
    const now = performance.now();

    const touch = e.touches[0];

    const current_position = this._orientation == "horizontal" ? touch.clientX : touch.clientY;
    const delta = this._last_position - current_position;
    const dt = Math.max(16, now - this._last_time);

    // px/ms
    const v = delta / dt;

    // velocity smoothing
    this._velocity = this._velocity * 0.8 + v * 0.2;

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

    this._tween?.kill();
    this._tween = null;

    this._apply_scroll(delta);

    if (Math.abs(target_scroll - old_scroll) > 3) {
      this._scrolled = true;
    }

    this._last_position = current_position;
    this._last_time = now;
  }

  //
  public end(e: TouchEvent): void {
    this._touching = false;

    const node = this._scroll_node;

    const currentScroll =
      this._orientation === "horizontal"
        ? node.scrollLeft
        : node.scrollTop;

    const maxScroll =
      this._orientation === "horizontal"
        ? node.scrollWidth - node.clientWidth
        : node.scrollHeight - node.clientHeight;

    // project distance based on velocity
    const projected = currentScroll + this._velocity * 300;

    const target = MathUtils.clamp(projected, 0, maxScroll);

    const distance = Math.abs(target - currentScroll);

    if (distance < 5) return;

    const duration = Math.min(1.5, Math.max(0.3, distance / 1000));

    this._tween = gsap.to(node, {
      scrollLeft: this._orientation === "horizontal" ? target : undefined,
      scrollTop: this._orientation === "vertical" ? target : undefined,
      duration,
      ease: "power3.out",
      overwrite: true,
    });

    this._tween!.then(() => {
      this._tween = null;
    });
  }

  //
  public destroy(): void {
    this._tween?.kill();
    this._tween = null;
  }

  //
  private _apply_scroll(delta: number): void {
    const node = this._scroll_node;

    let current =
      this._orientation === "horizontal"
        ? node.scrollLeft
        : node.scrollTop;

    let next = current + delta;

    const maxScroll =
      this._orientation === "horizontal"
        ? node.scrollWidth - node.clientWidth
        : node.scrollHeight - node.clientHeight;

    next = MathUtils.clamp(next, 0, maxScroll);

    if (this._orientation === "horizontal") {
      node.scrollLeft = next;
    } else {
      node.scrollTop = next;
    }
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